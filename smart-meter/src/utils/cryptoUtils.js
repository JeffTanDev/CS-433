// 生成密钥对
async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // 可以是 1024、2048 或 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {name: "SHA-256"},
      },
      true, // 是否可导出
      ["encrypt", "decrypt"] // 使用密钥的用途
    );
  
    return keyPair;
}
  
// AES加密
async function encryptAES(data) {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true, // 是否可导出
      ["encrypt", "decrypt"] // 使用密钥的用途
    );
  
    const encoded = new TextEncoder().encode(data);
  
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: window.crypto.getRandomValues(new Uint8Array(12)), // 初始化向量
      },
      key,
      encoded
    );
  
    return {
      encryptedData,
      key, // 注意：实际应用中应该安全地处理和存储密钥
    };
}
  
// 使用公钥加密
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
  
// 使用AES密钥加密数据，返回加密的数据和密钥（示例中直接返回，实践中应加以安全处理）
async function encryptWithAESKey(data, aesKey) {
    const encoded = new TextEncoder().encode(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 初始化向量
  
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      encoded
    );
  
    return {
      encryptedData,
      iv, // 初始化向量也需要随数据一起保存，以便解密
    };
}
  
export { generateKeys, encryptAES, encryptWithPublicKey, encryptWithAESKey };
  