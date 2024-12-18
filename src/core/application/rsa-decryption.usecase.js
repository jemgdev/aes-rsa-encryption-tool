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

      const decryptedData = this.rsaEncryptionRepository.decryptWithRSA({
        payload,
        privateKey
      })
  
      return decryptedData
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = {
  RSADecryptionUseCase
}