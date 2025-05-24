import { Router } from 'express';
const keyManagementRouter: Router = Router();
import { getPublicKey, loadKeyPairs } from '../controllers/key-management.controller';

keyManagementRouter
  .get('/get-key', getPublicKey)
  .get('/load-keys', loadKeyPairs);

export {
  keyManagementRouter
}