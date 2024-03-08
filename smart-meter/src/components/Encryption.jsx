import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import { ref, set } from "firebase/database";
import { rdb } from '../firebase'; 
import { encryptWithPublicKey, generateKeys, encryptAES } from '../utils/cryptoUtils';

function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary); // Converting binary strings to Base64 strings using window.btoa
}

async function exportAndStorePrivateKey_c(privateKey) {
  const exported_u = await window.crypto.subtle.exportKey(
      "pkcs8",
      privateKey
  );
  const exportedAsString_u = ab2str(exported_u); // ArrayBuffer to string
  const exportedAsBase64_u = window.btoa(exportedAsString_u); // to Base64
  localStorage.setItem("CompanyPrivateKey", exportedAsBase64_u); // store
}

async function exportAndStorePrivateKey_u(privateKey) {
  const exported_c = await window.crypto.subtle.exportKey(
      "pkcs8",
      privateKey
  );
  const exportedAsString_c = ab2str(exported_c); // ArrayBuffer to string
  const exportedAsBase64_c = window.btoa(exportedAsString_c); // to Base64
  localStorage.setItem("UserPrivateKey", exportedAsBase64_c); // store
}

// ArrayBuffer to string
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}


const Encryption = () => {
  const [usages, setUsages] = useState([{ usage: '' }]);
  const { user } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Calculate total electricity consumption
    const total = usages.reduce((acc, curr) => acc + Number(curr.usage), 0);
  
    // Generate key pairs
    const userKeys = await generateKeys();
    const companyKeys = await generateKeys();
    exportAndStorePrivateKey_c(companyKeys.privateKey);
    exportAndStorePrivateKey_u(userKeys.privateKey);
  
    const { key: aesKey, encryptedData: aesEncryptedData } = await encryptAES(JSON.stringify(usages)); // The encryptAES function is modified to return an object containing the key and encrypted data
  

    // 导出 AES Key 为 ArrayBuffer 格式
    const exportedAesKey = await crypto.subtle.exportKey("raw", aesKey);

    // 将导出的 ArrayBuffer 编码为 Base64 并缓存
    const base64_exportedAesKey = arrayBufferToBase64(exportedAesKey);

    const encryptedAESKeyForUser = await encryptWithPublicKey(base64_exportedAesKey, userKeys.publicKey);
    // const encryptedAESKeyForUser = await encryptWithPublicKey(JSON.stringify(aesKey), userKeys.publicKey); // Encrypting an AES key with the user's public key requires ensuring that encryptWithPublicKey can handle serialized objects like these
    
    const encryptedTotalUsageForCompany = await encryptWithPublicKey(total.toString(), companyKeys.publicKey); // Encrypt total electricity consumption with company public key
    
    // console.log(aesEncryptedData)
    // console.log(encryptedAESKeyForUser)
    // console.log(encryptedTotalUsageForCompany)
    // console.log(user)
    // console.log(user.uid)

    const base64_aesEncryptedData = arrayBufferToBase64(aesEncryptedData);
    const base64_encryptedAESKeyForUser = arrayBufferToBase64(encryptedAESKeyForUser);
    const base64_encryptedTotalUsageForCompany = arrayBufferToBase64(encryptedTotalUsageForCompany);
    // Uploading data to Firebase
    if (user && user.uid) {
      const dataRef = ref(rdb, `Data/Users/${user.uid}`);
      set(dataRef, {
        base64_aesEncryptedData,
        base64_encryptedAESKeyForUser,
        base64_encryptedTotalUsageForCompany,
      }).then(() => {
        console.log('Data saved successfully!');
      }).catch((error) => {
        console.error('Error saving data: ', error);
      });
    }
  };

  const handleAddUsage = () => {
    setUsages([...usages, { usage: '' }]);
  };

  const handleChangeUsage = (index, value) => {
    const newUsages = [...usages];
    newUsages[index].usage = value;
    setUsages(newUsages);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {usages.map((usage, index) => (
          <input
            key={index}
            type="number"
            placeholder="Enter usage"
            value={usage.usage}
            onChange={(e) => handleChangeUsage(index, e.target.value)}
          />
        ))}
        <button type="button" onClick={handleAddUsage}>Add Socket Usage</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Encryption;
