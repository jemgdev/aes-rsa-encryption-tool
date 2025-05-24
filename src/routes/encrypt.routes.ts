import { Router } from 'express';
const encryptRouter: Router = Router();
import { encrypt } from '../controllers/encrypt.controller';

encryptRouter.post('/encrypt', encrypt);

export {
  encryptRouter
}