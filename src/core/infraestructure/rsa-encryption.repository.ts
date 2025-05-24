import forge from 'node-forge';

// Define types for complex forge objects if not readily available from @types/node-forge
// For example:
// type ForgeKeyPair = forge.pki.rsa.KeyPair;
// type ForgePublicKey = forge.pki.PublicKey;
// type ForgePrivateKey = forge.pki.PrivateKey;
// type ForgeMessageDigest = forge.md.MessageDigest;
// type ForgeMGF = forge.mgf.MGF;

interface GenerateKeyResult {
  publicKeyPem: string;
  privateKeyPem: string;
}

interface EncryptParams {
  payload: string;
  publicKey: string;
}

interface DecryptParams {
  payload: string;
  privateKey: string;
}

interface RSAOAEPHashes {
  md: forge.md.MessageDigest;
  mgf1: typeof forge.mgf.mgf1; // Used typeof as suggested by compiler
}

interface RSAEncryptionRepositoryInterface {
  generateKey(): GenerateKeyResult;
  encrypt(params: EncryptParams): string;
  decrypt(params: DecryptParams): string;
}

class RSAEncryptionRepository implements RSAEncryptionRepositoryInterface {
  generateKey (): GenerateKeyResult {
    try {
      const keyPair: forge.pki.rsa.KeyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
      const publicKeyPem: string = forge.pki.publicKeyToPem(keyPair.publicKey);
      const privateKeyPem: string = forge.pki.privateKeyToPem(keyPair.privateKey);

      return {
        publicKeyPem,
        privateKeyPem
      };
    } catch (error: any) {
      console.log('RSAEncryptionRepository.generateKey error: ', error.message);
      throw new Error(error.message);
    }
  }

  encrypt ({ payload, publicKey }: EncryptParams): string {
    try {
      const hashes: RSAOAEPHashes = {
        md: forge.md.sha256.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha256.create()),
      };
  
      const key: forge.pki.PublicKey = forge.pki.publicKeyFromPem(publicKey);
      const encryptedData: string = key.encrypt(
        payload,
        'RSA-OAEP',
        hashes
      );
  
      const encryptedDataBase64: string = forge.util.encode64(encryptedData);
      return encryptedDataBase64;
    } catch (error: any) {
      console.log('RSAEncryptionRepository.encrypt error: ', error.message);
      throw new Error(error.message);
    }
  }

  decrypt ({ payload, privateKey }: DecryptParams): string {
    try {
      const hashes: RSAOAEPHashes = {
        md: forge.md.sha256.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha256.create()),
      };
  
      const key: forge.pki.PrivateKey = forge.pki.privateKeyFromPem(privateKey); // Changed from decryptRsaPrivateKey
      const payloadDecoded: string = forge.util.decode64(payload);
      const decryptedData: string = key.decrypt(
        payloadDecoded,
        'RSA-OAEP',
        hashes
      );
  
      return decryptedData;
    } catch (error: any) {
      console.log('RSAEncryptionRepository.decrypt error: ', error.message);

      // The retry logic for 'Cannot read private key...' might indicate an issue with the key format or parsing.
      // For now, ensure 'privateKeyFromPem' is used consistently.
      // If the error persists, the key generation or storage might need review.
      // The original code had a potential issue here by calling decryptRsaPrivateKey twice in some error paths.
      // Using privateKeyFromPem is generally safer for PEM-formatted keys.
      if (error.message === 'Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.' || 
          error.message === 'Unsupported key format.' || // Added another common error
          error.message.includes('Key parsing failed')) { // General parsing error
        // Attempting a robust parse or re-throw with more context
        try {
          const fallbackKey = forge.pki.privateKeyFromPem(privateKey); // Ensure this is what you intend
          const hashesRetry: RSAOAEPHashes = {
            md: forge.md.sha256.create(),
            mgf1: forge.mgf.mgf1.create(forge.md.sha256.create()),
          };
          const payloadDecodedRetry: string = forge.util.decode64(payload);
          const decryptedDataRetry: string = fallbackKey.decrypt(payloadDecodedRetry, 'RSA-OAEP', hashesRetry);
          return decryptedDataRetry;
        } catch (retryError: any) {
          console.log('RSAEncryptionRepository.decrypt retry error: ', retryError.message);
          throw new Error('Failed to decrypt after retry: ' + retryError.message);
        }
      }

      throw new Error(error.message);
    }
  }
}

export {
  RSAEncryptionRepository
}