class RSADecryptionUseCase {
  constructor ({
    rsaEncryptionRepository,
    keyManagementRepository
  }) {
    this.rsaEncryptionRepository = rsaEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute (payload) {
    try {
      const { privateKey } = this.keyManagementRepository.getKeyPair()

      const decryptedData = this.rsaEncryptionRepository.decrypt({
        payload,
        privateKey
      })
  
      return decryptedData
    } catch (error) {
      console.log('RSADecryptionUseCase.excecute error: ', error.message)
      throw new Error(error.message)
    }
  }
}

module.exports = {
  RSADecryptionUseCase
}