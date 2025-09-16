import React, { useEffect } from "react";
import { Typography, Tabs, Button } from "antd";
import type { TabsProps } from "antd";
import OrdersTable from "../../component/StoreManage/Orders/OrdersTable/OrdersTable";
import CustomersTable from "../../component/Customer/CustomerTable";
import "./ManageStore.scss";
import EmailNotification from "../../component/EmailNotificaton/EmailNotification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ArrowLeft } from "lucide-react";
import AddProductCategory from "../../component/Template/ProductCategory/ProductCategory";
import { getLocalStorage } from "../../services/utils";
import { setSelectedStoreId } from "../../store/reducers/storeSlice";
import { PullRequestOutlined } from "@ant-design/icons";
import TableReservation from "../../component/Template/Restaurant/Reservation";
import DiscountCouponList from "../../component/DiscountCoupon/DiscountCouponList";
import { Link, useParams } from "react-router-dom";
import CartView from "../../component/Cart/CartView";
import AddCustomDomain from "../../component/AddCustomDomain/AddCustomDomain";
import StoreAnalytics from "../../component/StoreAnalytics/StoreAnalytics";
import AddCustomScript from "../../component/AddCustomScript/AddCustomScript";
import { PaymentMethod } from "../../component/PaymentMethod/PaymentMehod";

const ManageStore: React.FC = () => {
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch();
  const items: TabsProps["items"] = [];
  const { storeId } = useParams() as { storeId: string };

  if (selectedStore?.siteType === "webapp") {
    items.push(
      ...[
        {
          key: "store-analytics",
          label: "Store Analytics",
          children: <StoreAnalytics />,
        },
        {
          key: "1",
          label: "Customer",
          children: <CustomersTable />,
        },
        {
          key: "2",
          label: "Orders",
          children: <OrdersTable />,
        },
        {
          key: "7",
          label: "Cart",
          children: <CartView />,
        },
        {
          key: "3",
          label: "Product Category",
          children: <AddProductCategory />,
        },
        {
          key: "4",
          label: "Discount Coupon",
          children: <DiscountCouponList />,
        },
        {
          key: "14",
          label: "Payment Method",
          children: <PaymentMethod />,
        },
      ]
    );
  }

  if (selectedStore?.siteType === "website") {
    items.push({
      key: "5",
      label: "Email Notification",
      children: <EmailNotification />,
    });
  }
  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "website_restaurant_template") {
    items.push({
      key: "6",
      label: "Reservation Request",
      children: <TableReservation />,
    });
  }
  items.push(
    ...[
      {
        key: "12",
        label: "Custom Script",
        children: <AddCustomScript />,
      },
      {
        key: "13",
        label: "Custom Domain",
        children: <AddCustomDomain />,
      },
    ]
  );

  return (
    <div style={{ padding: "10px 20px" }} className='manage_store_customer'>
      <Tabs
        defaultActiveKey='store-analytics'
        tabBarExtraContent={
          <Link to={`/store/${storeId}`}>
            <Button type='text'>
              <ArrowLeft /> Go Back
            </Button>
          </Link>
        }
        tabBarStyle={{ margin: "0 10px", borderRadius: "0" }}
        items={items}
      />
    </div>
  );
};

export default ManageStore;
