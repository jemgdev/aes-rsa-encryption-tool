"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AESEncryptionRepository = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
class AESEncryptionRepository {
    generateKey() {
        const symmetrickKey = crypto_js_1.default.enc.Base64.stringify(crypto_js_1.default.lib.WordArray.random(32));
        return symmetrickKey;
    }
    encrypt({ payload, keyBase64 }) {
        try {
            const key = crypto_js_1.default.enc.Base64.parse(keyBase64);
            const iv = crypto_js_1.default.lib.WordArray.random(16);
            const encrypted = crypto_js_1.default.AES.encrypt(payload, key, {
                iv,
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7
            });
            const encryptedData = iv
                .concat(encrypted.ciphertext)
                .toString(crypto_js_1.default.enc.Base64);
            return encryptedData;
        }
        catch (error) {
            console.log('AESEncryptionRepository.encrypt error: ', error.message);
            throw new Error('Invalid data');
        }
    }
    decrypt({ payload, keyBase64 }) {
        try {
            const key = crypto_js_1.default.enc.Base64.parse(keyBase64);
            const encryptedDataWords = crypto_js_1.default.enc.Base64.parse(payload);
            const iv = crypto_js_1.default.lib.WordArray.create(encryptedDataWords.words.slice(0, 4));
            const ciphertext = crypto_js_1.default.lib.WordArray.create(encryptedDataWords.words.slice(4));
            const decrypted = crypto_js_1.default.AES.decrypt(
            // Pass the ciphertext WordArray directly, not an object wrapping it.
            // Alternatively, one could pass the full base64 payload string if the library handles parsing IV from it with specific config.
            // But since IV is manually extracted, passing the extracted ciphertext is more direct.
            crypto_js_1.default.lib.CipherParams.create({ ciphertext: ciphertext }), // Create a valid CipherParams object
            key, {
                iv,
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7
            });
            const decryptedData = decrypted.toString(crypto_js_1.default.enc.Utf8);
            return decryptedData;
        }
        catch (error) {
            console.log('AESEncryptionRepository.decrypt error: ', error.message);
            throw new Error('Invalid data');
        }
    }
}
exports.AESEncryptionRepository = AESEncryptionRepository;
