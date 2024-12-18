const fs = require('node:fs/promises') 
const path = require('node:path')
const { environment } = require('../../../constants')

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
      const keyPath = path.resolve(path.join(__dirname, '../../../custom-keys'))

      const [
        publicKey,
        privateKey
      ] = await Promise.allSettled([
        fs.readFile(`${keyPath}/${environment}/public-key.pem`),
        fs.readFile(`${keyPath}/${environment}/private-key.pem`)
      ])

      if (publicKey.status === 'rejected' || privateKey.status === 'rejected') {
        console.log('Private or public key invalid, generating key pairs...')

        const { publicKeyPem, privateKeyPem } = this.rsaEncryptionRepository.generateKey()
        this.keyManagementRepository.saveKeyPair({
          publicKey: publicKeyPem,
          privateKey: privateKeyPem
        })

        return
      }

      this.keyManagementRepository.saveKeyPair({
        publicKey: Buffer.from(publicKey.value).toString(),
        privateKey: Buffer.from(privateKey.value).toString()
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = {
  GenerateKeyPairUseCase
}