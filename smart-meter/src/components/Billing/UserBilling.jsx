import React, { useState, useEffect } from 'react';
import { useAuth } from "../../hooks/useAuth"; 
import { ref, onValue } from "firebase/database";
import { rdb } from "../../firebase";
import './UserBilling.css'; 

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

const UserBilling = () => {
  const { user } = useAuth(); // Use the useAuth hook to get the current user
  const [billingInfo, setBillingInfo] = useState(null); // Initialize billing information status
  //console.log(user)
  // Getting Billing Information from Firebase
  useEffect(() => {
    if (user) {
      const billingRef = ref(rdb, 'Data/Users/' + user.uid);
      onValue(billingRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Get the current date in U.S. Western Time
          const currentDate = getCurrentPTDate();
          // Checks if the Outlets exist and are an object
          const outletsArray = data.Power && data.Power.Outlets ? Object.entries(data.Power.Outlets).map(([key, value]) => ({
            id: key,
            usage: value.usage,
            amount: value.amount,
          })) : [];
          
          setBillingInfo({
            companyName: "Electrico Ltd.",
            mailingAddress: "123 Energy Street, Power City, PC 4567",
            orderNumber: "ORD123456789",
            orderDate: currentDate,
            userId: user.uid,
            userName: user.displayName,
            outlets: outletsArray,
            totalUsage: data.Power.Total,
            totalAmount: data.Power.Total * 0.15, // Assuming a price of $0.15 per kWh
          });
        } else {
          console.log("No billing data available");
        }
      });
    }
  }, [user]);

  //If no billing information is available, display a loading status or alert message
  if (!billingInfo) {
    return <div>Loading billing information...</div>;
  }

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
          {billingInfo.outlets.map((outlet, index) => (
            <div className="row" key={index}>
              <p>Outlet ID: {outlet.id}</p>
              <p>Usage: {outlet.usage} kWh</p>
              <p>Amount: ${outlet.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <h3>Totals</h3>
        <p>Total Usage: {billingInfo.totalUsage} kWh</p>
        <p>Total Amount: ${billingInfo.totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default UserBilling;
