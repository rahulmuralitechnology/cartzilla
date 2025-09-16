import { Flex, Tabs } from "antd";
import React, { FC, useState } from "react";
import { PaymentMethod } from "../../component/PaymentMethod/PaymentMehod";
import AddCustomDomain from "../../component/AddCustomDomain/AddCustomDomain";

const Settings: FC = () => {
  const [activeKey, setActiveKey] = useState("1");

  const TabItems = [
    {
      label: "Orders",
      key: "1",
      children: <>1</>,
    },
    {
      label: "Carts",
      key: "2",
      children: <>2</>,
    },
  ];
  return (
    <section className='bloomi5_page orders_page'>
      <Flex justify='space-between' align='middle' style={{ marginBottom: "15px" }}>
        <h2>Order Manage</h2>
      </Flex>

      <Tabs defaultActiveKey='1' tabBarStyle={{ marginBottom: 0 }} size={"middle"} type='card' items={TabItems} />
    </section>
  );
};

export default Settings;
