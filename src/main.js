require('dotenv').config()
const express = require('express')
const app = express()

const constants = require('./constants')
const { errorHandler } = require('./middlewares/error-handler')
const { notFound } = require('./middlewares/not-found')
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

app.set('PORT', constants.port)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/get-key', async (request, response, next) => {
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
})

app.get('/generate-keys', async (request, response, next) => {
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
})

app.post('/encrypt', async (request, response, next) => {
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
})

app.post('/decrypt', async (request, response, next) => {
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
})

app.use(errorHandler)
app.use(notFound)

app.listen(app.get('PORT'), () => {
  console.log(`Starting server on http://localhost:${app.get('PORT')}`)
})