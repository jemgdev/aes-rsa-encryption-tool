const forge =  require('node-forge')

class RSAEncryptionRepository {
  generateKey () {
    try {
      const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 })

      const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey)
      const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey)

      return {
        publicKeyPem,
        privateKeyPem
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  encrypt ({
    payload,
    publicKey
  }) {
    try {
      const hashes = {
        md: forge.md.sha256.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha256.create()),
      }
  
      const key = forge.pki.publicKeyFromPem(publicKey)
  
      const encryptedData = key.encrypt(
        payload,
        'RSA-OAEP',
        hashes
      )
  
      const encryptedDataBase64 = forge.util.encode64(encryptedData)
  
      return encryptedDataBase64
    } catch (error) {
      throw new Error(error.message)
    }
  }

  decrypt ({
    payload,
    privateKey
  }) {
    try {
      const hashes = {
        md: forge.md.sha256.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha256.create()),
      }
  
      const key = forge.pki.decryptRsaPrivateKey(privateKey)
  
      const payloadDecoded = forge.util.decode64(payload)
  
      const decryptedData = key.decrypt(
        payloadDecoded,
        'RSA-OAEP',
        hashes
      )
  
      return decryptedData
    } catch (error) {
      if (error.message === 'Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.') {
        const hashes = {
          md: forge.md.sha256.create(),
          mgf1: forge.mgf.mgf1.create(forge.md.sha256.create()),
        }
    
        const key = forge.pki.decryptRsaPrivateKey(privateKey)

        console.log(key)
    
        const payloadDecoded = forge.util.decode64(payload)
    
        const decryptedData = key.decrypt(
          payloadDecoded,
          'RSA-OAEP',
          hashes
        )
    
        return decryptedData
      }

      throw new Error(error.message)
    }
  }
}

module.exports = {
  RSAEncryptionRepository
}