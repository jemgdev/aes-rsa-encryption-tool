interface AESEncryptionRepository {
  decrypt(args: { payload: string; keyBase64: string }): string;
  // Add other methods if they exist and are used by this use case
}

interface KeyManagementRepository {
  getSymmetrickKey(): string;
  // Add other methods if they exist and are used by this use case
}

interface ConstructorParams {
  aesEncryptionRepository: AESEncryptionRepository;
  keyManagementRepository: KeyManagementRepository;
}

class AESDecryptionUseCase {
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
      const decryptedData: string = this.aesEncryptionRepository.decrypt({
        payload,
        keyBase64: this.keyManagementRepository.getSymmetrickKey()
      });
  
      return decryptedData;
    } catch (error: any) {
      console.log('AESDecryptionUseCase.excecute error: ', error.message);
      throw new Error(error.message);
    }
  }
}

export {
  AESDecryptionUseCase
}