"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSAEncryptionRepository = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
class RSAEncryptionRepository {
    generateKey() {
        try {
            const keyPair = node_forge_1.default.pki.rsa.generateKeyPair({ bits: 2048 });
            const publicKeyPem = node_forge_1.default.pki.publicKeyToPem(keyPair.publicKey);
            const privateKeyPem = node_forge_1.default.pki.privateKeyToPem(keyPair.privateKey);
            return {
                publicKeyPem,
                privateKeyPem
            };
        }
        catch (error) {
            console.log('RSAEncryptionRepository.generateKey error: ', error.message);
            throw new Error(error.message);
        }
    }
    encrypt({ payload, publicKey }) {
        try {
            const hashes = {
                md: node_forge_1.default.md.sha256.create(),
                mgf1: node_forge_1.default.mgf.mgf1.create(node_forge_1.default.md.sha256.create()),
            };
            const key = node_forge_1.default.pki.publicKeyFromPem(publicKey);
            const encryptedData = key.encrypt(payload, 'RSA-OAEP', hashes);
            const encryptedDataBase64 = node_forge_1.default.util.encode64(encryptedData);
            return encryptedDataBase64;
        }
        catch (error) {
            console.log('RSAEncryptionRepository.encrypt error: ', error.message);
            throw new Error(error.message);
        }
    }
    decrypt({ payload, privateKey }) {
        try {
            const hashes = {
                md: node_forge_1.default.md.sha256.create(),
                mgf1: node_forge_1.default.mgf.mgf1.create(node_forge_1.default.md.sha256.create()),
            };
            const key = node_forge_1.default.pki.privateKeyFromPem(privateKey); // Changed from decryptRsaPrivateKey
            const payloadDecoded = node_forge_1.default.util.decode64(payload);
            const decryptedData = key.decrypt(payloadDecoded, 'RSA-OAEP', hashes);
            return decryptedData;
        }
        catch (error) {
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
                    const fallbackKey = node_forge_1.default.pki.privateKeyFromPem(privateKey); // Ensure this is what you intend
                    const hashesRetry = {
                        md: node_forge_1.default.md.sha256.create(),
                        mgf1: node_forge_1.default.mgf.mgf1.create(node_forge_1.default.md.sha256.create()),
                    };
                    const payloadDecodedRetry = node_forge_1.default.util.decode64(payload);
                    const decryptedDataRetry = fallbackKey.decrypt(payloadDecodedRetry, 'RSA-OAEP', hashesRetry);
                    return decryptedDataRetry;
                }
                catch (retryError) {
                    console.log('RSAEncryptionRepository.decrypt retry error: ', retryError.message);
                    throw new Error('Failed to decrypt after retry: ' + retryError.message);
                }
            }
            throw new Error(error.message);
        }
    }
}
exports.RSAEncryptionRepository = RSAEncryptionRepository;
