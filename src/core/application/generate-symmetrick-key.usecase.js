export class GenerateKeysUseCase {
  constructor ({
    aesEncryptionRepository,
    keyManagementRepository
  }) {
    this.aesEncryptionRepository = aesEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute () {
    const symmetrickKey = this.aesEncryptionRepository.generateSymmetrickKey()

    this.keyManagementRepository.saveSymmetrickKey(symmetrickKey)

    return symmetrickKey
  }
}