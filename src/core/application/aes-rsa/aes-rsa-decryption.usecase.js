class AESRSADecryptionUseCase {
  constructor ({
    aesEncryptionRepository,
    rsaEncryptionRepository,
    keyManagementRepository
  }) {
    this.aesEncryptionRepository = aesEncryptionRepository
    this.rsaEncryptionRepository = rsaEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute ({
    payload,
    symmetrick
  }) {
    try {
      const { privateKey } = this.keyManagementRepository.getKeyPair()

      const symmetrickDecrypted = this.rsaEncryptionRepository.decrypt({
        payload: symmetrick,
        privateKey
      })

      const decryptedData = this.aesEncryptionRepository.decrypt({
        payload,
        keyBase64: symmetrickDecrypted
      })

      return decryptedData
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = {
  AESRSADecryptionUseCase
}