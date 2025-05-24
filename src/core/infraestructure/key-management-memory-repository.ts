interface Database {
  symmetrickKey: string;
  publicKey: string;
  privateKey: string;
}

const database: Database = {
  symmetrickKey: '',
  publicKey: '',
  privateKey: ''
};

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface KeyManagementRepositoryInterface {
  saveSymmetrickKey(symmetrickKey: string): void;
  getSymmetrickKey(): string;
  saveKeyPair(keyPair: KeyPair): void;
  getKeyPair(): KeyPair;
}

class KeyManagementMemoryRepository implements KeyManagementRepositoryInterface {
  saveSymmetrickKey (symmetrickKey: string): void {
    database.symmetrickKey = symmetrickKey;
  }

  getSymmetrickKey (): string {
    return database.symmetrickKey;
  }

  saveKeyPair ({
    publicKey,
    privateKey
  }: KeyPair): void {
    database.publicKey = publicKey;
    database.privateKey = privateKey;
  }

  getKeyPair (): KeyPair {
    return {
      publicKey: database.publicKey,
      privateKey: database.privateKey
    };
  }
}

export {
  database,
  KeyManagementMemoryRepository
}