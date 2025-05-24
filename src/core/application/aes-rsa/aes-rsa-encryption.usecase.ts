interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface AESEncryptionRepository {
  generateKey(): string;
  encrypt(args: { payload: string; keyBase64: string }): string;
}

interface RSAEncryptionRepository {
  encrypt(args: { payload: string; publicKey: string }): string;
}

interface KeyManagementRepository {
  getKeyPair(): KeyPair;
}

interface ConstructorParams {
  aesEncryptionRepository: AESEncryptionRepository;
  rsaEncryptionRepository: RSAEncryptionRepository;
  keyManagementRepository: KeyManagementRepository;
}

interface ExecuteResult {
  data: string;
  symmetrick: string;
}

class AESRSAEncryptionUseCase {
  private aesEncryptionRepository: AESEncryptionRepository;
  private rsaEncryptionRepository: RSAEncryptionRepository;
  private keyManagementRepository: KeyManagementRepository;

  constructor ({
    aesEncryptionRepository,
    rsaEncryptionRepository,
    keyManagementRepository
  }: ConstructorParams) {
    this.aesEncryptionRepository = aesEncryptionRepository;
    this.rsaEncryptionRepository = rsaEncryptionRepository;
    this.keyManagementRepository = keyManagementRepository;
  }

  excecute (payload: string): ExecuteResult {
    try {
      const symmetrickKey: string = this.aesEncryptionRepository.generateKey();
      const { publicKey }: KeyPair = this.keyManagementRepository.getKeyPair();

      if (!publicKey) {
        throw new Error('Must generate key pairs');
      }

      if (!payload) {
        throw new Error('Must specify payload to encrypt');
      }

      const data: string = this.aesEncryptionRepository.encrypt({
        payload,
        keyBase64: symmetrickKey
      });

      const symmetrick: string = this.rsaEncryptionRepository.encrypt({ payload: symmetrickKey, publicKey });

      return {
        data,
        symmetrick
      };
    } catch (error: any) {
      console.log('AESRSAEncryptionUseCase.excecute error: ', error.message);
      throw new Error(error.message);
    }
  }
}

export {
  AESRSAEncryptionUseCase
}