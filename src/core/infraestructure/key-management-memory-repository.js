export const database = {
  symmetrickKey: '',
  publickKey: '',
  privateKey: ''
}

export class KeyManagementMemoryRepository {
  saveSymmetrickKey (symmetrickKey) {
    database.symmetrickKey = symmetrickKey
  }

  getSymmetrickKey () {
    return database.symmetrickKey
  }
}