const { Router } = require('express')
const encryptRouter = Router()
const { encrypt } = require('../controllers/encrypt.controller')

encryptRouter.post('/encrypt', encrypt)

module.exports = {
  encryptRouter
}