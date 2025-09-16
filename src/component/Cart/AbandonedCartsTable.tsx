import React, { useEffect, useState } from "react";
import { message, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AbandonedCart, CartItem } from "../../services/interfaces/common";
import cartService from "../../services/cartService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import appConstant from "../../services/appConstant";

const AbandonedCartsTable: React.FC = ({}) => {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const getAbondanedCarts = async (id: string) => {
    setLoading(true);
    try {
      const result = await cartService.getAllAbandonedCarts(id);
      setCarts(result.data.abandonedCarts);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      // message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getAbondanedCarts(selectedStore.id);
    }
  }, [selectedStore?.id]);

  // Define columns for the table
  const columns: ColumnsType<AbandonedCart> = [
    {
      title: "Email",
      key: "email",
      render: (_: string, row: AbandonedCart) => row?.user?.email,
    },
    // {
    //   title: "User ID",
    //   dataIndex: "userId",
    //   key: "userId",
    // },
    // {
    //   title: "Items",
    //   dataIndex: "items",
    //   key: "items",
    //   render: (items: CartItem[]) => (
    //     <ul>
    //       {items.map((item, index) => (
    //         <li key={index}>
    //           {item.name} (Qty: {item.quantity}, Price: ${item.price})
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `${appConstant.CURRENY_SYMBOL}${price}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  return <Table loading={loading} columns={columns} dataSource={carts} rowKey='id' pagination={{ pageSize: 5 }} />;
};

export default AbandonedCartsTable;
