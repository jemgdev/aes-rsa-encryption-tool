class AESRSAEncryptionUseCase {
  constructor ({
    aesEncryptionRepository,
    rsaEncryptionRepository,
    keyManagementRepository
  }) {
    this.aesEncryptionRepository = aesEncryptionRepository
    this.rsaEncryptionRepository = rsaEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute (payload) {
    try {
      const symmetrickKey = this.aesEncryptionRepository.generateKey()
      const { publicKey } = this.keyManagementRepository.getKeyPair()

      const data = this.aesEncryptionRepository.encrypt({
        payload,
        keyBase64: symmetrickKey
      })

      const symmetrick = this.rsaEncryptionRepository.encrypt({ payload: symmetrickKey, publicKey })

      return {
        data,
        symmetrick
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = {
  AESRSAEncryptionUseCase
}