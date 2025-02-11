const { Router } = require('express')
const decryptRouter = Router()
const { decrypt } = require('../controllers/decrypt.controller')

decryptRouter.post('/decrypt', decrypt)

module.exports = {
  decryptRouter
}