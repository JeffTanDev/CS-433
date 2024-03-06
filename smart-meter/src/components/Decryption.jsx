import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { ref, onValue } from "firebase/database";
import { rdb } from '../firebase'; 

// Assuming privateKeyString is the private key string obtained from localStorage
const privateKeyString = localStorage.getItem('privateKey');

// Convert Base64-encoded private key to ArrayBuffer
function base64ToArrayBuffer(base64) {
  console.log(base64)
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

const Decryption = ({ userId }) => {
    const [decryptedData, setDecryptedData] = useState("");
    const { user } = useAuth();
    console.log(user)

    useEffect(() => {
      const processData = async () => {
        const dataRef = ref(rdb, `Data/Users/${user.uid}`);
        onValue(dataRef, async (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const { base64_encryptedTotalUsageForCompany } = data;
              //console.log(base64_encryptedTotalUsageForCompany)
              const encryptedDataArrayBuffer = base64ToArrayBuffer(base64_encryptedTotalUsageForCompany);

              if (privateKeyString) {
                  // First, import the private key
                  const privateKey = await importPrivateKey(privateKeyString);
                  if (privateKey) {
                      // Decryption using the converted private key
                      const decrypted = await decryptWithPrivateKey(encryptedDataArrayBuffer, privateKey);
                      setDecryptedData(decrypted);
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

  return (
    // <div>
    //   <h2>Decrypted Data</h2>
    //   <p>{decryptedData}</p>
    // </div>
    <div>
    <h2>Billing Statement</h2>
    <p><strong>Company Name:</strong> {billingInfo.companyName}</p>
    <p><strong>Mailing Address:</strong> {billingInfo.mailingAddress}</p>
    <p><strong>Order Number:</strong> {billingInfo.orderNumber}</p>
    <p><strong>Order Date:</strong> {billingInfo.orderDate}</p>
    <p><strong>User ID:</strong> {billingInfo.userId}</p>
    <p><strong>User Name:</strong> {billingInfo.userName}</p>

    <h3>Totals</h3>
    <p><strong>Total Usage:</strong> {decryptedData} kWh</p>
    <p><strong>Total Amount:</strong> ${decryptedData}</p>

    <p><strong>Contact Information:</strong> {billingInfo.contactInfo}</p>
  </div>
  );
};

export default Decryption;
