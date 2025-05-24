interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface RSAEncryptionRepository {
  encrypt(args: { payload: string; publicKey: string }): string;
}

interface KeyManagementRepository {
  getKeyPair(): KeyPair;
}

interface ConstructorParams {
  rsaEncryptionRepository: RSAEncryptionRepository;
  keyManagementRepository: KeyManagementRepository;
}

class RSAEncryptionUseCase {
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
      const { publicKey }: KeyPair = this.keyManagementRepository.getKeyPair();

      const encryptedData: string = this.rsaEncryptionRepository.encrypt({
        payload,
        publicKey
      });

      return encryptedData;
    } catch (error: any) {
      console.log('RSAEncryptionUseCase.excecute error: ', error.message);

      if (error.message === 'RSAES-OAEP input message length is too long.') {
        throw new Error('Data to encrypt is too long');
      }

      if (error.message === 'Invalid PEM formatted message.') {
        throw new Error('Must generate key pairs');
      }

      throw new Error(error.message);
    }
  }
}

export {
  RSAEncryptionUseCase
}