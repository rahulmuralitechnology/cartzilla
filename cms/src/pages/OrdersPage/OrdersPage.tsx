import React from "react";
import { Typography } from "antd";
import OrdersTable from "../../component/StoreManage/Orders/OrdersTable/OrdersTable";

const { Title } = Typography;

const Orders: React.FC = () => {
  return (
    <div style={{ padding: "24px" }}>
      {/* <Title level={2}>Orders</Title> */}
      <OrdersTable />
    </div>
  );
};

export default Orders;
