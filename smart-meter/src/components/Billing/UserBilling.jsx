import React from "react";
import './UserBilling.css'; // 确保CSS文件路径正确

const UserBilling = () => {
  // 示例数据
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
    totalUsage: 350, // 总用电量
    totalAmount: 52.50, // 总金额
  };

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
