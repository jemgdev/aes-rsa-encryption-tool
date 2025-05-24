import { Request, Response, NextFunction } from 'express';
import { AESDecryptionUseCase } from "../core/application/aes/aes-decryption.usecase";
import { RSADecryptionUseCase } from "../core/application/rsa/rsa-decryption.usecase";

import { AESRSADecryptionUseCase } from "../core/application/aes-rsa/aes-rsa-decryption.usecase";
import { AESEncryptionRepository } from "../core/infraestructure/aes-encryption.repository";
import { KeyManagementMemoryRepository } from "../core/infraestructure/key-management-memory-repository";
import { RSAEncryptionRepository } from "../core/infraestructure/rsa-encryption.repository";

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

interface DecryptRequestBody {
  method: 'aes' | 'rsa' | 'aes-rsa';
  data: any;
  symmetrick?: string;
}

const decrypt = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { method, data: dataToDecrypt, symmetrick } = request.body as DecryptRequestBody;

    if (method === 'aes') {
      const decryptedData: string = aesDecryptionUseCase.excecute(dataToDecrypt);

      response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data decrypted successfuly',
        data: JSON.parse(decryptedData)
      })
    }

    if (method === 'rsa') {
      const decryptedData: string = rsaDecryptionUseCase.excecute(dataToDecrypt);

      response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data decrypted successfuly',
        data: JSON.parse(decryptedData)
      })
    }

    if (method === 'aes-rsa') {
      if (!symmetrick) {
        response.status(400).json({
          code: 'BAD_REQUEST',
          message: 'Symmetric key is required for aes-rsa decryption'
        });
        return;
      }
      const decryptedData: string = aesRSADecryptionUseCase.excecute({
        payload: JSON.stringify(dataToDecrypt),
        symmetrick
      });
      
      response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data decrypted successfuly',
        data: JSON.parse(decryptedData)
      });
    } else { // Removed extra '}' before this 'else'
      response.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Must specify a valid encryption method: aes, rsa or aes-rsa'
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  decrypt
}