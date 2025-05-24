"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementMemoryRepository = exports.database = void 0;
const database = {
    symmetrickKey: '',
    publicKey: '',
    privateKey: ''
};
exports.database = database;
class KeyManagementMemoryRepository {
    saveSymmetrickKey(symmetrickKey) {
        database.symmetrickKey = symmetrickKey;
    }
    getSymmetrickKey() {
        return database.symmetrickKey;
    }
    saveKeyPair({ publicKey, privateKey }) {
        database.publicKey = publicKey;
        database.privateKey = privateKey;
    }
    getKeyPair() {
        return {
            publicKey: database.publicKey,
            privateKey: database.privateKey
        };
    }
}
exports.KeyManagementMemoryRepository = KeyManagementMemoryRepository;
