const { AESEncryptionRepository } = require("../core/infraestructure/aes-encryption.repository") 
const { KeyManagementMemoryRepository } = require("../core/infraestructure/key-management-memory-repository") 
const { RSAEncryptionRepository } = require("../core/infraestructure/rsa-encryption.repository") 

const { AESEncryptionUseCase } = require("../core/application/aes/aes-encryption.usecase") 
const { RSAEncryptionUseCase } = require("../core/application/rsa/rsa-encryption.usecase")
const { AESRSAEncryptionUseCase } = require("../core/application/aes-rsa/aes-rsa-encryption.usecase")

const aesEncryptionRepository = new AESEncryptionRepository()
const keyManagementRepository = new KeyManagementMemoryRepository()
const rsaEncryptionRepository = new RSAEncryptionRepository()

const aesRSAEncryptionUseCase = new AESRSAEncryptionUseCase({
  aesEncryptionRepository,
  rsaEncryptionRepository,
  keyManagementRepository
})

const rsaEncryptionUseCase = new RSAEncryptionUseCase({
  rsaEncryptionRepository,
  keyManagementRepository
})

const aesEncryptionUseCase = new AESEncryptionUseCase({
  aesEncryptionRepository,
  keyManagementRepository
})

const encrypt = async (request, response, next) => {
  try {
    const { method, data: dataToEncrypt } = request.body

    if (method === 'aes') {
      const encryptedData = aesEncryptionUseCase.excecute(dataToEncrypt)

      return response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data encrypted successfuly',
        data: encryptedData
      })
    }

    if (method === 'rsa') {
      const encryptedData = rsaEncryptionUseCase.excecute(dataToEncrypt)

      return response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data encrypted successfuly',
        data: encryptedData
      })
    }

    if (method === 'aes-rsa') {
      const { data, symmetrick } = aesRSAEncryptionUseCase.excecute(JSON.stringify(dataToEncrypt))
      
      return response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data encrypted successfuly',
        data: {
          data,
          symmetrick
        }
      })
    }

    response.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Must specify a valid encryption method: aes, rsa or aes-rsa'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  encrypt
}