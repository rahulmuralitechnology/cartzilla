import { Flex, Tabs } from "antd";
import React, { FC, useState } from "react";
import { PaymentMethod } from "../../component/PaymentMethod/PaymentMehod";
import AddCustomDomain from "../../component/AddCustomDomain/AddCustomDomain";
import StoreInfo from "../../component/StoreManage/StoreInfo/StoreInfo";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ShiprocketAuthInfo from "../../component/StoreManage/DeliverySetting/ShiprocketAuthInfo";
import ShippingInfo from "../../component/StoreManage/ShippingInfo/ShippingInfo";
import ERPNextSetting from "../../component/StoreManage/ERPNextSetting/ERPNextSetting";

const Settings: FC = () => {
  const [activeKey, setActiveKey] = useState("1");
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const TabItems = [
    {
      label: "Store",
      key: "1",
      children: <StoreInfo />,
    },

    {
      label: "Custom Domain",
      key: "3",
      children: <AddCustomDomain />,
    },
  ];

  if (selectedStore?.siteType === "webapp") {
    TabItems.push({
      label: "Payment Methods",
      key: "2",
      children: <PaymentMethod />,
    });
    TabItems.push({
      label: "Delivery",
      key: "4",
      children: <ShiprocketAuthInfo />,
    });
    TabItems.push({
      label: "Shipping Info",
      key: "shipping",
      children: <ShippingInfo />,
    });
    TabItems.push({
      label: "ERPNext Settings",
      key: "erpnext",
      children: <ERPNextSetting />,
    });
  }
  return (
    <section className='bloomi5_page setting_page'>
      <Flex justify='space-between' align='middle' style={{ marginBottom: "15px" }}>
        <h2>Settings</h2>
      </Flex>

      <Tabs defaultActiveKey='1' tabBarStyle={{ marginBottom: 0 }} size={"middle"} type='card' items={TabItems} />
    </section>
  );
};

export default Settings;
