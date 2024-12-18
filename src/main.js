const { AESEncryptionUseCase } = require("./core/application/aes-encryption.usecase") 
const { AESDecryptionUseCase } = require("./core/application/aes-decryption.usecase") 
const { GenerateKeyPairUseCase } = require("./core/application/generate-key-pair.usecase") 
const { AESEncryptionRepository } = require("./core/infraestructure/aes-encryption.repository") 
const { KeyManagementMemoryRepository, database } = require("./core/infraestructure/key-management-memory-repository") 
const { RSAEncryptionRepository } = require("./core/infraestructure/rsa-encryption.repository") 

const aesEncryptionRepository = new AESEncryptionRepository()
const keyManagementRepository = new KeyManagementMemoryRepository()
const rsaEncryptionRepository = new RSAEncryptionRepository()

const aesEncryptionUseCase = new AESEncryptionUseCase({
  aesEncryptionRepository,
  keyManagementRepository
})

const aesDecryptionUseCase = new AESDecryptionUseCase({
  aesEncryptionRepository,
  keyManagementRepository
})

const generateKeyPairUseCase = new GenerateKeyPairUseCase({
  rsaEncryptionRepository,
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

const encryptedMessageBase64 = aesEncryptionUseCase.excecute(payload)
const decryptedMessage = aesDecryptionUseCase.excecute(encryptedMessageBase64)

console.log('encryptedMessage: ', encryptedMessageBase64)
console.log('decryptedMessage: ', decryptedMessage)

generateKeyPairUseCase.excecute().then(() => {
  console.log(database)
})
