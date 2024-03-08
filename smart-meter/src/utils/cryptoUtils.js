// Generate key pairs
async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // Can be 1024, 2048 or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {name: "SHA-256"},
      },
      true, // Exportable
      ["encrypt", "decrypt"] // Purpose of the usage key
    );
  
    return keyPair;
}
  
// AES encryption
async function encryptAES(data) {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true, // Exportable
      ["encrypt", "decrypt"] // Purpose of the usage key
    );
  
    const encoded = new TextEncoder().encode(data);
    const iv = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        // iv: window.crypto.getRandomValues(new Uint8Array(12)), // Initialization Vector
        iv: iv,
      },
      key,
      encoded
    );
  
    return {
      encryptedData,
      key,
    };
}
  
// Use of public key encryption
async function encryptWithPublicKey(data, publicKey) {
    const encoded = new TextEncoder().encode(data);
  
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encoded
    );
  
    return encryptedData;
}

// Decryption with private key
async function decryptWithPrivateKey(encryptedData, privateKey) {
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedData
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedData);
}

// 解密AES加密的数据
async function decryptAES(encryptedData, aesKeyArrayBuffer) {
  try {
      // 首先，导入AES密钥
      const key = await window.crypto.subtle.importKey(
          "raw", // 密钥的格式
          aesKeyArrayBuffer, // 密钥的ArrayBuffer形式
          {   // 这是加密算法及其细节
              name: "AES-GCM",
              length: 256 // 例如，AES密钥长度可以是128, 192, 或256位
          },
          false, // 是否可导出
          ["decrypt"] // 用途：仅解密
      );
      const iv = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      // 然后，使用导入的密钥进行解密
      const decryptedData = await window.crypto.subtle.decrypt(
          {
              name: "AES-GCM",
              // 注意：这里需要提供与加密时相同的初始向量(iv)
              iv: iv // 示例中使用了一个空的12字节长的初始向量，实际使用时应与加密时相同
          },
          key, // 导入的密钥
          encryptedData // 需要解密的数据
      );
      
      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedData);

      return decryptedText;
  } catch (e) {
      console.error("解密失败", e);
      throw e; // 抛出异常，可在调用此函数的地方进行处理
  }
}


export { generateKeys, encryptAES, encryptWithPublicKey, decryptWithPrivateKey ,decryptAES};

  
  