const { Router } = require('express')
const keyManagementRouter = Router()
const { getPublicKey, loadKeyPairs } = require('../controllers/key-management.controller')

keyManagementRouter
  .get('/get-key', getPublicKey)
  .get('/load-keys', loadKeyPairs)

module.exports = {
  keyManagementRouter
}