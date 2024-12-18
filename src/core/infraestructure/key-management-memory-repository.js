const database = {
  symmetrickKey: '',
  publicKey: '',
  privateKey: ''
}

class KeyManagementMemoryRepository {
  saveSymmetrickKey (symmetrickKey) {
    database.symmetrickKey = symmetrickKey
  }

  getSymmetrickKey () {
    return database.symmetrickKey
  }

  saveKeyPair ({
    publicKey,
    privateKey
  }) {
    database.publicKey = publicKey
    database.privateKey = privateKey
  }

  getKeyPair () {
    return {
      publicKey: database.publicKey,
      privateKey: database.privateKey
    }
  }
}

module.exports = {
  database,
  KeyManagementMemoryRepository
}