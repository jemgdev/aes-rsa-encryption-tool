export class AESEncryptionUseCase {
  constructor ({
    aesEncryptionRepository,
    keyManagementRepository
  }) {
    this.aesEncryptionRepository = aesEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute (payload) {
    const symmetrickKey = this.aesEncryptionRepository.generateSymmetrickKey()
    this.keyManagementRepository.saveSymmetrickKey(symmetrickKey)

    const encryptedData = this.aesEncryptionRepository.encryptWithAES({
      payload,
      keyBase64: symmetrickKey
    })

    return encryptedData
  }
}