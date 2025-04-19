require('dotenv').config()
const express = require('express')
const app = express()

const constants = require('./utils/constants')
const { errorHandler } = require('./middlewares/error-handler')
const { notFound } = require('./middlewares/not-found')

const { keyManagementRouter } = require('./routes/key-management.routes')
const { encryptRouter } = require('./routes/encrypt.routes')
const { decryptRouter } = require('./routes/decrypt.routes')

app.set('PORT', constants.port)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/', keyManagementRouter)
app.use('/api/v1/', encryptRouter)
app.use('/api/v1/', decryptRouter)

app.use(errorHandler)
app.use(notFound)

app.listen(app.get('PORT'), () => {
  console.log(`aes-rsa-encryption on http://localhost:${app.get('PORT')}`)
})