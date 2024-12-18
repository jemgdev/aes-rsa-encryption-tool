require('dotenv').config()
const { AESEncryptionUseCase } = require("./core/application/aes/aes-encryption.usecase") 
const { AESDecryptionUseCase } = require("./core/application/aes/aes-decryption.usecase") 
const { GenerateKeyPairUseCase } = require("./core/application/rsa/generate-key-pair.usecase")
const { RSAEncryptionUseCase } = require("./core/application/rsa/rsa-encryption.usecase")
const { RSADecryptionUseCase } = require("./core/application/rsa/rsa-decryption.usecase")
const { AESRSAEncryptionUseCase } = require("./core/application/aes-rsa/aes-rsa-encryption.usecase")
const { AESRSADecryptionUseCase } = require("./core/application/aes-rsa/aes-rsa-decryption.usecase")
const { AESEncryptionRepository } = require("./core/infraestructure/aes-encryption.repository") 
const { KeyManagementMemoryRepository } = require("./core/infraestructure/key-management-memory-repository") 
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

const rsaEncryptionUseCase = new RSAEncryptionUseCase({
  rsaEncryptionRepository,
  keyManagementRepository
})

const rsaDecryptionUseCase = new RSADecryptionUseCase({
  rsaEncryptionRepository,
  keyManagementRepository
})

const aesRSAEncryptionUseCase = new AESRSAEncryptionUseCase({
  aesEncryptionRepository,
  rsaEncryptionRepository,
  keyManagementRepository
})

const aesRSADecryptionUseCase = new AESRSADecryptionUseCase({
  aesEncryptionRepository,
  rsaEncryptionRepository,
  keyManagementRepository
})