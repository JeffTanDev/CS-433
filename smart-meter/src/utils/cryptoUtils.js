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
  
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: window.crypto.getRandomValues(new Uint8Array(12)), // Initialization Vector
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

export { generateKeys, encryptAES, encryptWithPublicKey, decryptWithPrivateKey };

  
  