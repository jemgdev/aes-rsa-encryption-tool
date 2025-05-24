import CryptoJS from 'crypto-js';

interface EncryptDecryptParams {
  payload: string;
  keyBase64: string;
}

interface AESEncryptionRepositoryInterface {
  generateKey(): string;
  encrypt(params: EncryptDecryptParams): string;
  decrypt(params: EncryptDecryptParams): string;
}

class AESEncryptionRepository implements AESEncryptionRepositoryInterface {
  generateKey (): string {
    const symmetrickKey: string = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(32));
    return symmetrickKey;
  }

  encrypt ({ payload, keyBase64 }: EncryptDecryptParams): string {
    try {
      const key: CryptoJS.lib.WordArray = CryptoJS.enc.Base64.parse(keyBase64);
      const iv: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.random(16);
      
      const encrypted: CryptoJS.lib.CipherParams = CryptoJS.AES.encrypt(
        payload,
        key,
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      const encryptedData: string = iv
        .concat(encrypted.ciphertext)
        .toString(CryptoJS.enc.Base64);

      return encryptedData;
    } catch (error: any) {
      console.log('AESEncryptionRepository.encrypt error: ', error.message);
      throw new Error('Invalid data');
    }
  }

  decrypt ({ payload, keyBase64 }: EncryptDecryptParams): string {
    try {
      const key: CryptoJS.lib.WordArray = CryptoJS.enc.Base64.parse(keyBase64);
      const encryptedDataWords: CryptoJS.lib.WordArray = CryptoJS.enc.Base64.parse(payload);
      const iv: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(encryptedDataWords.words.slice(0, 4));
      const ciphertext: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(encryptedDataWords.words.slice(4));

      const decrypted: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(
        // Pass the ciphertext WordArray directly, not an object wrapping it.
        // Alternatively, one could pass the full base64 payload string if the library handles parsing IV from it with specific config.
        // But since IV is manually extracted, passing the extracted ciphertext is more direct.
        CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext }), // Create a valid CipherParams object
        key,
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      const decryptedData: string = decrypted.toString(CryptoJS.enc.Utf8);

      return decryptedData;
    } catch (error: any) {
      console.log('AESEncryptionRepository.decrypt error: ', error.message);
      throw new Error('Invalid data');
    }
  }
}

export {
  AESEncryptionRepository
}