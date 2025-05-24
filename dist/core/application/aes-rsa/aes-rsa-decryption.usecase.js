"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AESRSADecryptionUseCase = void 0;
class AESRSADecryptionUseCase {
    constructor({ aesEncryptionRepository, rsaEncryptionRepository, keyManagementRepository }) {
        this.aesEncryptionRepository = aesEncryptionRepository;
        this.rsaEncryptionRepository = rsaEncryptionRepository;
        this.keyManagementRepository = keyManagementRepository;
    }
    excecute({ payload, symmetrick }) {
        try {
            const { privateKey } = this.keyManagementRepository.getKeyPair();
            const symmetrickDecrypted = this.rsaEncryptionRepository.decrypt({
                payload: symmetrick,
                privateKey
            });
            const decryptedData = this.aesEncryptionRepository.decrypt({
                payload,
                keyBase64: symmetrickDecrypted
            });
            return decryptedData;
        }
        catch (error) {
            console.log('AESRSADecryptionUseCase.excecute error: ', error.message);
            throw new Error(error.message);
        }
    }
}
exports.AESRSADecryptionUseCase = AESRSADecryptionUseCase;
