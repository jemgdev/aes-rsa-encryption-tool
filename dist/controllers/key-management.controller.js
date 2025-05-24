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
exports.loadKeyPairs = exports.getPublicKey = void 0;
const generate_key_pair_usecase_1 = require("../core/application/rsa/generate-key-pair.usecase");
const rsa_encryption_repository_1 = require("../core/infraestructure/rsa-encryption.repository");
const key_management_memory_repository_1 = require("../core/infraestructure/key-management-memory-repository");
const keyManagementRepository = new key_management_memory_repository_1.KeyManagementMemoryRepository();
const rsaEncryptionRepository = new rsa_encryption_repository_1.RSAEncryptionRepository();
const getPublicKey = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const generateKeyPairUseCase = new generate_key_pair_usecase_1.GenerateKeyPairUseCase({
            rsaEncryptionRepository,
            keyManagementRepository
        });
        const publicKey = yield generateKeyPairUseCase.excecute();
        response.status(200).json({
            code: 'OPERATION_SUCCESSFUL',
            message: 'Key pairs generated and saved',
            data: {
                publicKey
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPublicKey = getPublicKey;
const loadKeyPairs = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const generateKeyPairUseCase = new generate_key_pair_usecase_1.GenerateKeyPairUseCase({
            rsaEncryptionRepository,
            keyManagementRepository
        });
        yield generateKeyPairUseCase.excecute();
        response.status(200).json({
            code: 'OPERATION_SUCCESSFUL',
            message: 'Key pairs generated and saved in memory'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loadKeyPairs = loadKeyPairs;
