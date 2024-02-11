import React from "react";

// UserBilling component displays billing information
const EnterpriseBilling = () => {
  // Example data, subsequently replaced with data obtained from Firebase
  const billingInfo = {
    companyName: "Electrico Ltd.",
    mailingAddress: "123 Energy Street, Power City, PC 4567",
    orderNumber: "ORD123456789",
    orderDate: "2024-02-10",
    userId: "USR12345",
    userName: "John Doe",
    outlets: [
      { id: "OUTLET1", usage: 150, amount: 22.50 },
      { id: "OUTLET2", usage: 200, amount: 30.00 },
    ],
    contactInfo: "Contact Us: +123456789 | support@electrico.com",
  };

  // Calculate total electricity consumption and total bill amount
  const totals = billingInfo.outlets.reduce(
    (acc, curr) => {
      acc.totalUsage += curr.usage;
      acc.totalAmount += curr.amount;
      return acc;
    },
    { totalUsage: 0, totalAmount: 0 }
  );

  return (
    <div>
      <h2>Billing Statement</h2>
      <p><strong>Company Name:</strong> {billingInfo.companyName}</p>
      <p><strong>Mailing Address:</strong> {billingInfo.mailingAddress}</p>
      <p><strong>Order Number:</strong> {billingInfo.orderNumber}</p>
      <p><strong>Order Date:</strong> {billingInfo.orderDate}</p>
      <p><strong>User ID:</strong> {billingInfo.userId}</p>
      <p><strong>User Name:</strong> {billingInfo.userName}</p>

      <h3>Totals</h3>
      <p><strong>Total Usage:</strong> {totals.totalUsage} kWh</p>
      <p><strong>Total Amount:</strong> ${totals.totalAmount.toFixed(2)}</p>

      <p><strong>Contact Information:</strong> {billingInfo.contactInfo}</p>
    </div>
  );
};

export default EnterpriseBilling;
