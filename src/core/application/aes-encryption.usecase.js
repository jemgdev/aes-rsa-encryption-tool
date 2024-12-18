class AESEncryptionUseCase {
  constructor ({
    aesEncryptionRepository,
    keyManagementRepository
  }) {
    this.aesEncryptionRepository = aesEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute (payload) {
    try {
      const symmetrickKey = this.aesEncryptionRepository.generateSymmetrickKey()
      this.keyManagementRepository.saveSymmetrickKey(symmetrickKey)

      const encryptedData = this.aesEncryptionRepository.encryptWithAES({
        payload,
        keyBase64: symmetrickKey
      })

      return encryptedData
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = {
  AESEncryptionUseCase
}