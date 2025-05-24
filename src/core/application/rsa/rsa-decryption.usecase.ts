interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface RSAEncryptionRepository {
  decrypt(args: { payload: string; privateKey: string }): string;
}

interface KeyManagementRepository {
  getKeyPair(): KeyPair;
}

interface ConstructorParams {
  rsaEncryptionRepository: RSAEncryptionRepository;
  keyManagementRepository: KeyManagementRepository;
}

class RSADecryptionUseCase {
  private rsaEncryptionRepository: RSAEncryptionRepository;
  private keyManagementRepository: KeyManagementRepository;

  constructor ({
    rsaEncryptionRepository,
    keyManagementRepository
  }: ConstructorParams) {
    this.rsaEncryptionRepository = rsaEncryptionRepository;
    this.keyManagementRepository = keyManagementRepository;
  }

  excecute (payload: string): string {
    try {
      const { privateKey }: KeyPair = this.keyManagementRepository.getKeyPair();

      const decryptedData: string = this.rsaEncryptionRepository.decrypt({
        payload,
        privateKey
      });
  
      return decryptedData;
    } catch (error: any) {
      console.log('RSADecryptionUseCase.excecute error: ', error.message);
      throw new Error(error.message);
    }
  }
}

export {
  RSADecryptionUseCase
}