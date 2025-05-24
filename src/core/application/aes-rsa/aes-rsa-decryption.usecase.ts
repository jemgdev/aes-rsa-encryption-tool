interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface AESEncryptionRepository {
  decrypt(args: { payload: string; keyBase64: string }): string;
}

interface RSAEncryptionRepository {
  decrypt(args: { payload: string; privateKey: string }): string;
}

interface KeyManagementRepository {
  getKeyPair(): KeyPair;
}

interface ConstructorParams {
  aesEncryptionRepository: AESEncryptionRepository;
  rsaEncryptionRepository: RSAEncryptionRepository;
  keyManagementRepository: KeyManagementRepository;
}

interface ExecuteParams {
  payload: string;
  symmetrick: string;
}

class AESRSADecryptionUseCase {
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

  excecute ({
    payload,
    symmetrick
  }: ExecuteParams): string {
    try {
      const { privateKey }: KeyPair = this.keyManagementRepository.getKeyPair();

      const symmetrickDecrypted: string = this.rsaEncryptionRepository.decrypt({
        payload: symmetrick,
        privateKey
      });

      const decryptedData: string = this.aesEncryptionRepository.decrypt({
        payload,
        keyBase64: symmetrickDecrypted
      });

      return decryptedData;
    } catch (error: any) {
      console.log('AESRSADecryptionUseCase.excecute error: ', error.message);
      throw new Error(error.message);
    }
  }
}

export {
  AESRSADecryptionUseCase
}