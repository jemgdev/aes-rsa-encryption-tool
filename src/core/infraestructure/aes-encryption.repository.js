const CryptoJS = require('crypto-js')

class AESEncryptionRepository {
  generateKey () {
    const symmetrickKey = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(32))

    return symmetrickKey
  }

  encrypt ({ payload, keyBase64 }) {
    try {
      const key = CryptoJS.enc.Base64.parse(keyBase64);
    
      const iv = CryptoJS.lib.WordArray.random(16)
      
      const encrypted = CryptoJS.AES.encrypt(
        payload,
        key,
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      )
      
      const encryptedData = iv
        .concat(encrypted.ciphertext)
        .toString(CryptoJS.enc.Base64)

      return encryptedData
    } catch (error) {
      throw new Error('Invalid data')
    }
  }

  decrypt ({ payload, keyBase64 }) {
    try {
      const key = CryptoJS.enc.Base64.parse(keyBase64)
      const encryptedData = CryptoJS.enc.Base64.parse(payload)
      const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4))
      const ciphertext = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4));

      const decrypted = CryptoJS.AES.decrypt(
        {
          ciphertext
        },
        key,
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      )

      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8)

      return decryptedData
    } catch (error) {
      throw new Error('Invalid data')
    }
  }
}

module.exports = {
  AESEncryptionRepository
}