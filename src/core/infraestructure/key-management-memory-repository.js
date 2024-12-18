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
}

module.exports = {
  database,
  KeyManagementMemoryRepository
}