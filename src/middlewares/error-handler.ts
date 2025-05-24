import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  code?: string;
}

const errorHandler = (error: CustomError, request: Request, response: Response, next: NextFunction): void => {
  if (error.message === 'Invalid RSAES-OAEP padding.') {
    response.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Invalid RSAES-OAEP padding. 😥'
    });
    return;
  }

  response.status(500).json({
    code: error.code || 'UNCONTROLLER_ERROR',
    message: error.message || 'An unexpected error has occurred. 😥'
  });
};

export {
  errorHandler
}