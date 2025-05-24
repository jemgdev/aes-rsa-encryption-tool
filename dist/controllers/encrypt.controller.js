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
exports.encrypt = void 0;
const aes_encryption_repository_1 = require("../core/infraestructure/aes-encryption.repository");
const key_management_memory_repository_1 = require("../core/infraestructure/key-management-memory-repository");
const rsa_encryption_repository_1 = require("../core/infraestructure/rsa-encryption.repository");
const aes_encryption_usecase_1 = require("../core/application/aes/aes-encryption.usecase");
const rsa_encryption_usecase_1 = require("../core/application/rsa/rsa-encryption.usecase");
const aes_rsa_encryption_usecase_1 = require("../core/application/aes-rsa/aes-rsa-encryption.usecase");
const aesEncryptionRepository = new aes_encryption_repository_1.AESEncryptionRepository();
const keyManagementRepository = new key_management_memory_repository_1.KeyManagementMemoryRepository();
const rsaEncryptionRepository = new rsa_encryption_repository_1.RSAEncryptionRepository();
const aesRSAEncryptionUseCase = new aes_rsa_encryption_usecase_1.AESRSAEncryptionUseCase({
    aesEncryptionRepository,
    rsaEncryptionRepository,
    keyManagementRepository
});
const rsaEncryptionUseCase = new rsa_encryption_usecase_1.RSAEncryptionUseCase({
    rsaEncryptionRepository,
    keyManagementRepository
});
const aesEncryptionUseCase = new aes_encryption_usecase_1.AESEncryptionUseCase({
    aesEncryptionRepository,
    keyManagementRepository
});
const encrypt = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { method, data: dataToEncrypt } = request.body;
        const payload = typeof dataToEncrypt === 'string' ? dataToEncrypt : JSON.stringify(dataToEncrypt);
        if (method === 'aes') {
            const encryptedData = aesEncryptionUseCase.excecute(payload);
            response.status(200).json({
                code: 'OPERATION_SUCCESSFUL',
                message: 'Data encrypted successfuly',
                data: encryptedData
            });
            return;
        }
        if (method === 'rsa') {
            const encryptedData = rsaEncryptionUseCase.excecute(payload);
            response.status(200).json({
                code: 'OPERATION_SUCCESSFUL',
                message: 'Data encrypted successfuly',
                data: encryptedData
            });
            return;
        }
        if (method === 'aes-rsa') {
            const { data, symmetrick } = aesRSAEncryptionUseCase.excecute(payload);
            response.status(200).json({
                code: 'OPERATION_SUCCESSFUL',
                message: 'Data encrypted successfuly',
                data: {
                    data,
                    symmetrick
                }
            });
            // No return here, if method is not 'aes', 'rsa', or 'aes-rsa', it should fall through to the else.
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
exports.encrypt = encrypt;
