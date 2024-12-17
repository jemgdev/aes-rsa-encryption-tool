export class AESDecryptionUseCase {
  constructor ({
    aesEncryptionRepository,
    keyManagementRepository
  }) {
    this.aesEncryptionRepository = aesEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute (payload) {
    const decryptedData = this.aesEncryptionRepository.decryptWithAES({
      payload,
      keyBase64: this.keyManagementRepository.getSymmetrickKey()
    })

    return decryptedData
  }
}