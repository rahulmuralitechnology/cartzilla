import React, { useEffect, useState } from "react";
import { message, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ActiveCart, CartItem, OrderItem, PendingPaymentOrder } from "../../services/interfaces/common";
import { useParams } from "react-router-dom";
import cartService from "../../services/cartService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const PendingPaymentCart: React.FC = () => {
  const [carts, setCarts] = useState<PendingPaymentOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const getActiveCarts = async (id: string) => {
    setLoading(true);
    try {
      const result = await cartService.getAllPendingPaymentCarts(id);
      setCarts(result.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getActiveCarts(selectedStore?.id);
    }
  }, [selectedStore?.id]);
  // Define columns for the table
  const columns: ColumnsType<PendingPaymentOrder> = [
    {
      title: "Email",
      key: "id",
      render: (_: string, row: PendingPaymentOrder) => row?.user?.email,
    },
    // {
    //   title: "User ID",
    //   dataIndex: "userId",
    //   key: "userId",
    // },
    // {
    //   title: "Store ID",
    //   dataIndex: "storeId",
    //   key: "storeId",
    // },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number | null) => (amount ? `$${amount}` : "N/A"),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => <Tag color={status === "PAYMENT PENDING" ? "orange" : "green"}>{status}</Tag>,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={status === "CONFIRMED" ? "blue" : "default"}>{status}</Tag>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Device Type",
      dataIndex: "deviceType",
      key: "deviceType",
    },
    // {
    //   title: "Order Items",
    //   dataIndex: "orderItems",
    //   key: "orderItems",
    //   render: (items: OrderItem[]) => (
    //     <ul>
    //       {items.map((item, i) => (
    //         <li key={i}>
    //           {item.productName} (Qty: {item.quantity}, Price: ${item.price})
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
  ];

  return <Table columns={columns} loading={loading} dataSource={carts} rowKey='id' pagination={{ pageSize: 5 }} />;
};

export default PendingPaymentCart;
