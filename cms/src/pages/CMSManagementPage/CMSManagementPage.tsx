import { Flex, Tabs, TabsProps } from "antd";
import { FC, useState } from "react";
import "../../styles/CMSManagement.scss";
import ProductDashboard from "../products/ProductDashboard";
import PageCards from "../../component/CMSManagement/PagesCards";
import ProductCategoryForm from "../../component/products/ProductCategory/ProductCategory";
import AddProductCategory from "../../component/Template/ProductCategory/ProductCategory";
import DiscountCouponList from "../../component/DiscountCoupon/DiscountCouponList";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import EmailNotification from "../../component/EmailNotificaton/EmailNotification";

const CMSManagementPage: FC = () => {
  const [activeKey, setActiveKey] = useState("1");
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const TabItems = [
    {
      label: "Pages",
      key: "1",
      children: <PageCards />,
    },
    {
      label: "Email Notification",
      key: "emailNotification",
      children: <EmailNotification />,
    },
  ];

  if (selectedStore?.siteType === "webapp") {
    TabItems.push(
      ...[
        {
          label: "Products",
          key: "3",
          children: <ProductDashboard />,
        },
        {
          label: "Product Categories",
          key: "7",
          children: <AddProductCategory />,
        },
        {
          label: "Discounts",
          key: "8",
          children: <DiscountCouponList />,
        },
      ]
    );
  }

  if (selectedStore?.siteType === "website") {
    TabItems.push(...[]);
  }
  return (
    <section className='bloomi5_page cms_management_page'>
      <Flex justify='space-between' align='middle' style={{ marginBottom: "15px" }}>
        <h2>CMS Management</h2>
      </Flex>

      <Tabs defaultActiveKey='1' tabBarStyle={{ marginBottom: 0 }} size={"middle"} type='card' items={TabItems} />
    </section>
  );
};

export default CMSManagementPage;
