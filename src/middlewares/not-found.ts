import { Request, Response } from 'express';

const notFound = (request: Request, response: Response): void => {
  response.status(404).json({
    code: 'NOT_FOUND',
    message: 'Reource not found'
  });
};

export {
  notFound
}