import 'dotenv/config';
import express, { Application } from 'express';
const app: Application = express()

import constants from './utils/constants';
import { errorHandler } from './middlewares/error-handler';
import { notFound } from './middlewares/not-found';

import { keyManagementRouter } from './routes/key-management.routes';
import { encryptRouter } from './routes/encrypt.routes';
import { decryptRouter } from './routes/decrypt.routes';

app.set('PORT', constants.port)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/', keyManagementRouter)
app.use('/api/v1/', encryptRouter)
app.use('/api/v1/', decryptRouter)

app.use(errorHandler)
app.use(notFound)

app.listen(app.get('PORT'), (): void => {
  console.log(`aes-rsa-encryption on http://localhost:${app.get('PORT')}`)
})