const fs = require('node:fs/promises') 
const path = require('node:path') 

class GenerateKeyPairUseCase {
  constructor ({
    rsaEncryptionRepository,
    keyManagementRepository
  }) {
    this.rsaEncryptionRepository = rsaEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  async excecute () {
    try {
      const keyPath = path.resolve(path.join(__dirname, '../../keys'))

      const [
        publicKey,
        privateKey
      ] = await Promise.allSettled([
        fs.readFile(`${keyPath}/private-key.pem`),
        fs.readFile(`${keyPath}/public-key.pem`)
      ])

      console.log({
        publicKeyPem: Buffer.from(publicKey.value).toString(),
        privateKeyPem: Buffer.from(privateKey.value).toString()
      })

      this.keyManagementRepository.saveKeyPair({
        publicKey: Buffer.from(publicKey.value).toString(),
        privateKey: Buffer.from(privateKey.value).toString()
      })

      if (publicKey.status === 'rejected' || privateKey.status === 'rejected') {
        console.log('Private or public key invalid, generating key pairs...')

        const { publicKeyPem, privateKeyPem } = this.rsaEncryptionRepository.generatePairKeys()
        this.keyManagementRepository.saveKeyPair({
          publicKey: publicKeyPem,
          privateKey: privateKeyPem
        })
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = {
  GenerateKeyPairUseCase
}