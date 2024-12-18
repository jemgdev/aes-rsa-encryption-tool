const forge =  require('node-forge')

class RSAEncryptionRepository {
  generatePairKeys () {
    try {
      const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 })

      const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey)
      const privateKeyPem = forge.pki.publicKeyToPem(keyPair.privateKey)

      return {
        publicKeyPem,
        privateKeyPem
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  encryptWithRSA() {}

  decryptWithRSA() {}
}

module.exports = {
  RSAEncryptionRepository
}