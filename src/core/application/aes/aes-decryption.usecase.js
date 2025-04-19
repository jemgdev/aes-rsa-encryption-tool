class AESDecryptionUseCase {
  constructor ({
    aesEncryptionRepository,
    keyManagementRepository
  }) {
    this.aesEncryptionRepository = aesEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute (payload) {
    try {
      const decryptedData = this.aesEncryptionRepository.decrypt({
        payload,
        keyBase64: this.keyManagementRepository.getSymmetrickKey()
      })
  
      return decryptedData
    } catch (error) {
      console.log('AESDecryptionUseCase.excecute error: ', error.message)
      throw new Error(error.message)
    }
  }
}

module.exports = {
  AESDecryptionUseCase
}