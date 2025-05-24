import { Router } from 'express';
const decryptRouter: Router = Router();
import { decrypt } from '../controllers/decrypt.controller';

decryptRouter.post('/decrypt', decrypt);

export {
  decryptRouter
}