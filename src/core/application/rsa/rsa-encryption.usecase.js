class RSAEncryptionUseCase {
  constructor ({
    rsaEncryptionRepository,
    keyManagementRepository
  }) {
    this.rsaEncryptionRepository = rsaEncryptionRepository
    this.keyManagementRepository = keyManagementRepository
  }

  excecute (payload) {
    try {
      const { publicKey } = this.keyManagementRepository.getKeyPair()

      const encryptedData = this.rsaEncryptionRepository.encrypt({
        payload,
        publicKey
      })

      return encryptedData
    } catch (error) {
      if (error.message === 'RSAES-OAEP input message length is too long.') {
        throw new Error('Data to encrypt is too long')
      }

      throw new Error(error.message)
    }
  }
}

module.exports = {
  RSAEncryptionUseCase
}