import fs from 'node:fs/promises';
import path from 'node:path';
import { environment } from '../../../utils/constants';

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface RSAEncryptionRepository {
  generateKey(): { publicKeyPem: string; privateKeyPem: string };
}

interface KeyManagementRepository {
  saveKeyPair(keyPair: KeyPair): void;
}

interface ConstructorParams {
  rsaEncryptionRepository: RSAEncryptionRepository;
  keyManagementRepository: KeyManagementRepository;
}

class GenerateKeyPairUseCase {
  private rsaEncryptionRepository: RSAEncryptionRepository;
  private keyManagementRepository: KeyManagementRepository;

  constructor ({
    rsaEncryptionRepository,
    keyManagementRepository
  }: ConstructorParams) {
    this.rsaEncryptionRepository = rsaEncryptionRepository;
    this.keyManagementRepository = keyManagementRepository;
  }

  async excecute (): Promise<string> {
    try {
      const keyPath: string = path.resolve(path.join(__dirname, '../../../custom-keys'));

      const [
        publicKey,
        privateKey
      ]: [PromiseSettledResult<Buffer>, PromiseSettledResult<Buffer>] = await Promise.allSettled([
        fs.readFile(path.join(keyPath, environment || 'development', 'public-key.pem')),
        fs.readFile(path.join(keyPath, environment || 'development', 'private-key.pem'))
      ]);

      if (publicKey.status === 'rejected' || privateKey.status === 'rejected') {
        console.log(`Private or public key not found in path: ${keyPath}/${environment || 'development'}/[public-key.pem|private-key.pem], generating key pairs...`);

        const { publicKeyPem, privateKeyPem }: { publicKeyPem: string; privateKeyPem: string } = this.rsaEncryptionRepository.generateKey();

        this.keyManagementRepository.saveKeyPair({
          publicKey: publicKeyPem,
          privateKey: privateKeyPem
        });

        const [
          firstDirectory,
          secondDirectory
        ]: [PromiseSettledResult<void>, PromiseSettledResult<void>] = await Promise.allSettled([
          fs.access(path.resolve(path.join(__dirname, '../../../custom-keys'))),
          fs.access(path.resolve(path.join(__dirname, `../../../custom-keys/${environment || 'development'}`)))
        ]);

        if (firstDirectory.status === 'rejected') {
          await fs.mkdir(path.resolve(path.join(__dirname, '../../../custom-keys')));
        }

        if (secondDirectory.status === 'rejected') {
          await fs.mkdir(path.resolve(path.join(__dirname, `../../../custom-keys/${environment || 'development'}`)));
        }

        await Promise.allSettled([
          fs.writeFile(path.join(keyPath, environment || 'development', 'public-key.pem'), publicKeyPem),
          fs.writeFile(path.join(keyPath, environment || 'development', 'private-key.pem'), privateKeyPem)
        ]);

        return publicKeyPem;
      }

      // If files exist, publicKey and privateKey are FulfilledResults with Buffer values
      const publicKeyString = Buffer.from((publicKey as PromiseFulfilledResult<Buffer>).value).toString();
      const privateKeyString = Buffer.from((privateKey as PromiseFulfilledResult<Buffer>).value).toString();

      this.keyManagementRepository.saveKeyPair({
        publicKey: publicKeyString,
        privateKey: privateKeyString
      });

      return publicKeyString;
    } catch (error: any) {
      console.log('GenerateKeyPairUseCase.excecute error: ', error.message);
      throw new Error(error.message);
    }
  }
}

export {
  GenerateKeyPairUseCase
}