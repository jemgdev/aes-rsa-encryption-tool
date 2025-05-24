import { Request, Response, NextFunction } from 'express';
import { GenerateKeyPairUseCase } from "../core/application/rsa/generate-key-pair.usecase";
import { RSAEncryptionRepository } from '../core/infraestructure/rsa-encryption.repository';
import { KeyManagementMemoryRepository } from '../core/infraestructure/key-management-memory-repository';

const keyManagementRepository = new KeyManagementMemoryRepository()
const rsaEncryptionRepository = new RSAEncryptionRepository()

const getPublicKey = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const generateKeyPairUseCase = new GenerateKeyPairUseCase({
      rsaEncryptionRepository,
      keyManagementRepository
    })

    const publicKey: string = await generateKeyPairUseCase.excecute()

    response.status(200).json({
      code: 'OPERATION_SUCCESSFUL',
      message: 'Key pairs generated and saved',
      data: {
        publicKey
      }
    })
  } catch (error) {
    next(error);
  }
};

const loadKeyPairs = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const generateKeyPairUseCase = new GenerateKeyPairUseCase({
      rsaEncryptionRepository,
      keyManagementRepository
    })

    await generateKeyPairUseCase.excecute()

    response.status(200).json({
      code: 'OPERATION_SUCCESSFUL',
      message: 'Key pairs generated and saved in memory'
    });
  } catch (error) {
    next(error);
  }
};

export {
  getPublicKey,
  loadKeyPairs
}