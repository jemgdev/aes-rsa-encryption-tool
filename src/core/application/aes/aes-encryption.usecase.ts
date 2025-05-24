interface AESEncryptionRepository {
  generateKey(): string;
  encrypt(args: { payload: string; keyBase64: string }): string;
  // Add other methods if they exist and are used by this use case
}

interface KeyManagementRepository {
  saveSymmetrickKey(key: string): void;
  // Add other methods if they exist and are used by this use case
}

interface ConstructorParams {
  aesEncryptionRepository: AESEncryptionRepository;
  keyManagementRepository: KeyManagementRepository;
}

class AESEncryptionUseCase {
  private aesEncryptionRepository: AESEncryptionRepository;
  private keyManagementRepository: KeyManagementRepository;

  constructor ({
    aesEncryptionRepository,
    keyManagementRepository
  }: ConstructorParams) {
    this.aesEncryptionRepository = aesEncryptionRepository;
    this.keyManagementRepository = keyManagementRepository;
  }

  excecute (payload: string): string {
    try {
      const symmetrickKey: string = this.aesEncryptionRepository.generateKey();
      this.keyManagementRepository.saveSymmetrickKey(symmetrickKey);

      const encryptedData: string = this.aesEncryptionRepository.encrypt({
        payload,
        keyBase64: symmetrickKey
      });

      return encryptedData;
    } catch (error: any) {
      console.log('AESEncryptionUseCase.excecute error: ', error.message);
      throw new Error(error.message);
    }
  }
}

export {
  AESEncryptionUseCase
}