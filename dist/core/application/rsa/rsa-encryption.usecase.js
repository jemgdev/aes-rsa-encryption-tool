"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSAEncryptionUseCase = void 0;
class RSAEncryptionUseCase {
    constructor({ rsaEncryptionRepository, keyManagementRepository }) {
        this.rsaEncryptionRepository = rsaEncryptionRepository;
        this.keyManagementRepository = keyManagementRepository;
    }
    excecute(payload) {
        try {
            const { publicKey } = this.keyManagementRepository.getKeyPair();
            const encryptedData = this.rsaEncryptionRepository.encrypt({
                payload,
                publicKey
            });
            return encryptedData;
        }
        catch (error) {
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
exports.RSAEncryptionUseCase = RSAEncryptionUseCase;
