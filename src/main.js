import { AESEncryptionUseCase } from "./core/application/aes-encryption.usecase.js"
import { AESDecryptionUseCase } from "./core/application/aes-decryption.usecase.js"
import { GenerateKeysUseCase } from "./core/application/generate-symmetrick-key.usecase.js"
import { AESEncryptionRepository } from "./core/infraestructure/aes-encryption.repository.js"
import { KeyManagementMemoryRepository } from "./core/infraestructure/key-management-memory-repository.js"

const aesEncryptionRepository = new AESEncryptionRepository()
const keyManagementRepository = new KeyManagementMemoryRepository()

const generateKeysUseCase = new GenerateKeysUseCase({
  aesEncryptionRepository,
  keyManagementRepository
})

const aesEncryptionUseCase = new AESEncryptionUseCase({
  aesEncryptionRepository,
  keyManagementRepository
})

const aesDecryptionUseCase = new AESDecryptionUseCase({
  aesEncryptionRepository,
  keyManagementRepository
})

const payload = JSON.stringify({
  name: 'Josue',
  age: 12,
  name: 'Josue',
  hola: 'as',
  eda: 0,
  sadias: 0,
  asdi0: '1',
  datps: 10,
  ale: '1',
  s: 1
})

generateKeysUseCase.excecute()
const encryptedMessageBase64 = aesEncryptionUseCase.excecute(payload)
const decryptedMessage = aesDecryptionUseCase.excecute(encryptedMessageBase64)

console.log('encryptedMessage: ', encryptedMessageBase64)
console.log('decryptedMessage: ', decryptedMessage)