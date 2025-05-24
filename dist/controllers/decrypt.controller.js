"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = void 0;
const aes_decryption_usecase_1 = require("../core/application/aes/aes-decryption.usecase");
const rsa_decryption_usecase_1 = require("../core/application/rsa/rsa-decryption.usecase");
const aes_rsa_decryption_usecase_1 = require("../core/application/aes-rsa/aes-rsa-decryption.usecase");
const aes_encryption_repository_1 = require("../core/infraestructure/aes-encryption.repository");
const key_management_memory_repository_1 = require("../core/infraestructure/key-management-memory-repository");
const rsa_encryption_repository_1 = require("../core/infraestructure/rsa-encryption.repository");
const aesEncryptionRepository = new aes_encryption_repository_1.AESEncryptionRepository();
const keyManagementRepository = new key_management_memory_repository_1.KeyManagementMemoryRepository();
const rsaEncryptionRepository = new rsa_encryption_repository_1.RSAEncryptionRepository();
const aesDecryptionUseCase = new aes_decryption_usecase_1.AESDecryptionUseCase({
    aesEncryptionRepository,
    keyManagementRepository
});
const rsaDecryptionUseCase = new rsa_decryption_usecase_1.RSADecryptionUseCase({
    rsaEncryptionRepository,
    keyManagementRepository
});
const aesRSADecryptionUseCase = new aes_rsa_decryption_usecase_1.AESRSADecryptionUseCase({
    aesEncryptionRepository,
    rsaEncryptionRepository,
    keyManagementRepository
});
const decrypt = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { method, data: dataToDecrypt, symmetrick } = request.body;
        if (method === 'aes') {
            const decryptedData = aesDecryptionUseCase.excecute(dataToDecrypt);
            response.status(200).json({
                code: 'OPERATION_SUCCESSFUL',
                message: 'Data decrypted successfuly',
                data: JSON.parse(decryptedData)
            });
        }
        if (method === 'rsa') {
            const decryptedData = rsaDecryptionUseCase.excecute(dataToDecrypt);
            response.status(200).json({
                code: 'OPERATION_SUCCESSFUL',
                message: 'Data decrypted successfuly',
                data: JSON.parse(decryptedData)
            });
        }
        if (method === 'aes-rsa') {
            if (!symmetrick) {
                response.status(400).json({
                    code: 'BAD_REQUEST',
                    message: 'Symmetric key is required for aes-rsa decryption'
                });
                return;
            }
            const decryptedData = aesRSADecryptionUseCase.excecute({
                payload: JSON.stringify(dataToDecrypt),
                symmetrick
            });
            response.status(200).json({
                code: 'OPERATION_SUCCESSFUL',
                message: 'Data decrypted successfuly',
                data: JSON.parse(decryptedData)
            });
        }
        else { // Removed extra '}' before this 'else'
            response.status(400).json({
                code: 'BAD_REQUEST',
                message: 'Must specify a valid encryption method: aes, rsa or aes-rsa'
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.decrypt = decrypt;
