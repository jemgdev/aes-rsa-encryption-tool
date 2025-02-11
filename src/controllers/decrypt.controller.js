const { AESDecryptionUseCase } = require("../core/application/aes/aes-decryption.usecase") 
const { RSADecryptionUseCase } = require("../core/application/rsa/rsa-decryption.usecase")

const { AESRSADecryptionUseCase } = require("../core/application/aes-rsa/aes-rsa-decryption.usecase")
const { AESEncryptionRepository } = require("../core/infraestructure/aes-encryption.repository") 
const { KeyManagementMemoryRepository } = require("../core/infraestructure/key-management-memory-repository") 
const { RSAEncryptionRepository } = require("../core/infraestructure/rsa-encryption.repository") 

const aesEncryptionRepository = new AESEncryptionRepository()
const keyManagementRepository = new KeyManagementMemoryRepository()
const rsaEncryptionRepository = new RSAEncryptionRepository()

const aesDecryptionUseCase = new AESDecryptionUseCase({
  aesEncryptionRepository,
  keyManagementRepository
})

const rsaDecryptionUseCase = new RSADecryptionUseCase({
  rsaEncryptionRepository,
  keyManagementRepository
})

const aesRSADecryptionUseCase = new AESRSADecryptionUseCase({
  aesEncryptionRepository,
  rsaEncryptionRepository,
  keyManagementRepository
})

const decrypt = async (request, response, next) => {
  try {
    const { method, data: dataToDecrypt } = request.body

    if (method === 'aes') {
      const decryptedData = aesDecryptionUseCase.excecute(dataToDecrypt)

      return response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data decrypted successfuly',
        data: JSON.parse(decryptedData)
      })
    }

    if (method === 'rsa') {
      const decryptedData = rsaDecryptionUseCase.excecute(dataToDecrypt)

      return response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data decrypted successfuly',
        data: JSON.parse(decryptedData)
      })
    }

    if (method === 'aes-rsa') {
      const { symmetrick } = request.body

      const decryptedData = aesRSADecryptionUseCase.excecute({
        payload: JSON.stringify(dataToDecrypt),
        symmetrick
      })
      
      return response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data decrypted successfuly',
        data: JSON.parse(decryptedData)
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
  decrypt
}