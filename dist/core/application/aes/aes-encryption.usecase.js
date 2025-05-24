"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AESEncryptionUseCase = void 0;
class AESEncryptionUseCase {
    constructor({ aesEncryptionRepository, keyManagementRepository }) {
        this.aesEncryptionRepository = aesEncryptionRepository;
        this.keyManagementRepository = keyManagementRepository;
    }
    excecute(payload) {
        try {
            const symmetrickKey = this.aesEncryptionRepository.generateKey();
            this.keyManagementRepository.saveSymmetrickKey(symmetrickKey);
            const encryptedData = this.aesEncryptionRepository.encrypt({
                payload,
                keyBase64: symmetrickKey
            });
            return encryptedData;
        }
        catch (error) {
            console.log('AESEncryptionUseCase.excecute error: ', error.message);
            throw new Error(error.message);
        }
    }
}
exports.AESEncryptionUseCase = AESEncryptionUseCase;
