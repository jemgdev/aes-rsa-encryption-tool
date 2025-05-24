import { Request, Response, NextFunction } from 'express';
import { AESEncryptionRepository } from "../core/infraestructure/aes-encryption.repository";
import { KeyManagementMemoryRepository } from "../core/infraestructure/key-management-memory-repository";
import { RSAEncryptionRepository } from "../core/infraestructure/rsa-encryption.repository";

import { AESEncryptionUseCase } from "../core/application/aes/aes-encryption.usecase";
import { RSAEncryptionUseCase } from "../core/application/rsa/rsa-encryption.usecase";
import { AESRSAEncryptionUseCase } from "../core/application/aes-rsa/aes-rsa-encryption.usecase";

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

interface EncryptRequestBody {
  method: 'aes' | 'rsa' | 'aes-rsa';
  data: any;
}

interface AESRSAEncryptionResult {
  data: string;
  symmetrick: string;
}

const encrypt = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { method, data: dataToEncrypt } = request.body as EncryptRequestBody;
    const payload: string = typeof dataToEncrypt === 'string' ? dataToEncrypt : JSON.stringify(dataToEncrypt);

    if (method === 'aes') {
      const encryptedData: string = aesEncryptionUseCase.excecute(payload);

      response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data encrypted successfuly',
        data: encryptedData
      });
      return;
    }

    if (method === 'rsa') {
      const encryptedData: string = rsaEncryptionUseCase.excecute(payload);

      response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data encrypted successfuly',
        data: encryptedData
      });
      return;
    }

    if (method === 'aes-rsa') {
      const { data, symmetrick }: AESRSAEncryptionResult = aesRSAEncryptionUseCase.excecute(payload);
      
      response.status(200).json({
        code: 'OPERATION_SUCCESSFUL',
        message: 'Data encrypted successfuly',
        data: {
          data,
          symmetrick
        }
      })
    }

    } else {
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
  encrypt
}