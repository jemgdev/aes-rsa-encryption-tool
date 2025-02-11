const { GenerateKeyPairUseCase } = require("../core/application/rsa/generate-key-pair.usecase")
const { RSAEncryptionRepository } = require('../core/infraestructure/rsa-encryption.repository')
const { KeyManagementMemoryRepository } = require('../core/infraestructure/key-management-memory-repository')

const keyManagementRepository = new KeyManagementMemoryRepository()
const rsaEncryptionRepository = new RSAEncryptionRepository()

const getPublicKey = async (request, response, next) => {
  try {
    const generateKeyPairUseCase = new GenerateKeyPairUseCase({
      rsaEncryptionRepository,
      keyManagementRepository
    })

    const publicKey = await generateKeyPairUseCase.excecute()

    response.status(200).json({
      code: 'OPERATION_SUCCESSFUL',
      message: 'Key pairs generated and saved',
      data: {
        publicKey
      }
    })
  } catch (error) {
    next(error)
  }
}

const loadKeyPairs = async (request, response, next) => {
  try {
    const generateKeyPairUseCase = new GenerateKeyPairUseCase({
      rsaEncryptionRepository,
      keyManagementRepository
    })

    await generateKeyPairUseCase.excecute()

    response.status(200).json({
      code: 'OPERATION_SUCCESSFUL',
      message: 'Key pairs generated and saved in memory'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getPublicKey,
  loadKeyPairs
}