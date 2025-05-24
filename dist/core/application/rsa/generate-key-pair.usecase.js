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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateKeyPairUseCase = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const constants_1 = __importDefault(require("../../../utils/constants")); // Changed to default import
const { environment } = constants_1.default; // Destructure environment if it's a property
class GenerateKeyPairUseCase {
    constructor({ rsaEncryptionRepository, keyManagementRepository }) {
        this.rsaEncryptionRepository = rsaEncryptionRepository;
        this.keyManagementRepository = keyManagementRepository;
    }
    excecute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyPath = node_path_1.default.resolve(node_path_1.default.join(__dirname, '../../../custom-keys'));
                const [publicKey, privateKey] = yield Promise.allSettled([
                    promises_1.default.readFile(node_path_1.default.join(keyPath, environment || 'development', 'public-key.pem')),
                    promises_1.default.readFile(node_path_1.default.join(keyPath, environment || 'development', 'private-key.pem'))
                ]);
                if (publicKey.status === 'rejected' || privateKey.status === 'rejected') {
                    console.log(`Private or public key not found in path: ${keyPath}/${environment || 'development'}/[public-key.pem|private-key.pem], generating key pairs...`);
                    const { publicKeyPem, privateKeyPem } = this.rsaEncryptionRepository.generateKey();
                    this.keyManagementRepository.saveKeyPair({
                        publicKey: publicKeyPem,
                        privateKey: privateKeyPem
                    });
                    const [firstDirectory, secondDirectory] = yield Promise.allSettled([
                        promises_1.default.access(node_path_1.default.resolve(node_path_1.default.join(__dirname, '../../../custom-keys'))),
                        promises_1.default.access(node_path_1.default.resolve(node_path_1.default.join(__dirname, `../../../custom-keys/${environment || 'development'}`)))
                    ]);
                    if (firstDirectory.status === 'rejected') {
                        yield promises_1.default.mkdir(node_path_1.default.resolve(node_path_1.default.join(__dirname, '../../../custom-keys')));
                    }
                    if (secondDirectory.status === 'rejected') {
                        yield promises_1.default.mkdir(node_path_1.default.resolve(node_path_1.default.join(__dirname, `../../../custom-keys/${environment || 'development'}`)));
                    }
                    yield Promise.allSettled([
                        promises_1.default.writeFile(node_path_1.default.join(keyPath, environment || 'development', 'public-key.pem'), publicKeyPem),
                        promises_1.default.writeFile(node_path_1.default.join(keyPath, environment || 'development', 'private-key.pem'), privateKeyPem)
                    ]);
                    return publicKeyPem;
                }
                // If files exist, publicKey and privateKey are FulfilledResults with Buffer values
                const publicKeyString = Buffer.from(publicKey.value).toString();
                const privateKeyString = Buffer.from(privateKey.value).toString();
                this.keyManagementRepository.saveKeyPair({
                    publicKey: publicKeyString,
                    privateKey: privateKeyString
                });
                return publicKeyString;
            }
            catch (error) {
                console.log('GenerateKeyPairUseCase.excecute error: ', error.message);
                throw new Error(error.message);
            }
        });
    }
}
exports.GenerateKeyPairUseCase = GenerateKeyPairUseCase;
