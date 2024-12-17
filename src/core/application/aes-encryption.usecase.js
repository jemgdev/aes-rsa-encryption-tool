export class AESEncryptionUseCase {
  constructor ({
    aesEncryptionRepository,
    keyManagementRepository
  }) {
    this.aesEncryptionRepository = aesEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute (payload) {
    const encryptedData = this.aesEncryptionRepository.encryptWithAES({
      payload,
      keyBase64: this.keyManagementRepository.getSymmetrickKey()
    })

    return encryptedData
  }
}