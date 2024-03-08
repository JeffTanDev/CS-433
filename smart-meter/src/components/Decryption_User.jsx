import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { ref, onValue } from "firebase/database";
import { rdb } from '../firebase'; 
import { decryptAES } from '../utils/cryptoUtils';
import '../styles/UserBilling.css'

// Assuming privateKeyString is the private key string obtained from localStorage
const privateKeyString = localStorage.getItem('UserPrivateKey');

// Convert Base64-encoded private key to ArrayBuffer
function base64ToArrayBuffer(base64) {
  //console.log(base64)
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Import private key for decryption
async function importPrivateKey(privateKeyString) {
  const privateKeyBuffer = base64ToArrayBuffer(privateKeyString);
  try {
    const cryptoKey = await window.crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: {name: 'SHA-256'}, // Make sure it matches the algorithm used for encryption
      },
      true, // Exportable
      ['decrypt'] // usage
    );
    return cryptoKey;
  } catch (error) {
    console.error('Error importing private key:', error);
  }
}

async function decryptWithPrivateKey(encryptedData, privateKey) {
  try {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedData
    );
    // Converts decrypted data (ArrayBuffer) to string
    const dec = new TextDecoder();
    return dec.decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
  }
}

function getCurrentPTDate() {
    // Get the UTC time of the current date
    const now = new Date();
            
    // Convert UTC to US Western Time (PT)
    // Note: This assumes Daylight Saving Time, UTC-7 hours; non-Daylight Saving Time would be UTC-8 hours.
    const ptOffset = now.getTimezoneOffset() + 420; // PT (Daylight Saving Time) or 480 (non-Daylight Saving Time)
    const ptDate = new Date(now.getTime() - ptOffset*60000);
    
    // Formatting the date as YYYY-MM-DD
    return ptDate.toISOString().split('T')[0];
  }

const Decryption_user = ({ userId }) => {
    const [usageDataList, setUsageDataList] = useState([]);
    const { user } = useAuth();
    //console.log(user)

    useEffect(() => {
      const processData = async () => {
        const dataRef = ref(rdb, `Data/Users/${user.uid}`);
        onValue(dataRef, async (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const { base64_encryptedAESKeyForUser, base64_aesEncryptedData} = data;
              const encryptedAESKeyArrayBuffer = base64ToArrayBuffer(base64_encryptedAESKeyForUser);
              const encryptedDataArrayBuffer = base64ToArrayBuffer(base64_aesEncryptedData);
              //console.log(encryptedDataArrayBuffer)

              if (privateKeyString) {
                  // First, import the private key
                  const privateKey = await importPrivateKey(privateKeyString);
                  if (privateKey) {
                      // Decryption using the converted private key
                      const decrypted = await decryptWithPrivateKey(encryptedAESKeyArrayBuffer, privateKey);
                      const aesKeyArrayBuffer = base64ToArrayBuffer(decrypted);
                      const decryptedAESData = await decryptAES(encryptedDataArrayBuffer, aesKeyArrayBuffer);
                      setUsageDataList(JSON.parse(decryptedAESData));
                      console.log(decryptedAESData)
                  }
              }
            }
        });
      };
      processData();
    }, [userId, user.uid]);
    const currentDate = getCurrentPTDate();
    const billingInfo = {
        companyName: "Electrico Ltd.",
        mailingAddress: "123 Energy Street, Power City, PC 4567",
        orderNumber: "ORD123456789",
        orderDate: `${currentDate}`,
        userId: `${user.uid}`,
        userName: `${user.displayName}`,
        contactInfo: "Contact Us: +123456789 | support@electrico.com",
      };
      const totalAmount = usageDataList.map((usageItem) => Number(usageItem.usage)).reduce((acc, usage) => {
        return acc + usage;
      }, 0);

  return (
<div className="user-billing">
      <div className="header">
        <div className="left">
          <h2>Billing Statement</h2>
          <p>Company Name: {billingInfo.companyName}</p>
          <p>Mailing Address: {billingInfo.mailingAddress}</p>
        </div>
        <div className="right">
          <p>Order Number: {billingInfo.orderNumber}</p>
          <p>Order Date: {billingInfo.orderDate}</p>
          <p>User ID: {billingInfo.userId}</p>
          <p>User Name: {billingInfo.userName}</p>
        </div>
      </div>
      <div className="body">
        <h3>Usage Details</h3>
        <div className="table">
            {usageDataList.map((usageItem, index) => (
                <p key={index}><strong>Outlet {index + 1}:</strong> {usageItem.usage} kWh</p>
            ))}
        </div>
      </div>
      <div className="footer">
        <h3>Totals</h3>
        <p>Total Usage: {totalAmount} kWh</p>
        <p>Total Amount: ${totalAmount}</p>
      </div>
    </div>
  
  );
};

export default Decryption_user;
