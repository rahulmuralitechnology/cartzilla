import React, { useEffect, useState } from "react";
import { Drawer, message, Table } from "antd";
import orderService from "../../services/orderService";

export interface UPITransactionData {
  id: string;
  transactionId: string;
  orderId: string;
  storeId: string;
  email: string;
  createdAt: string;
}

interface TransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrderId: string;
  storeId: string;
}

const TransactionDrawer: React.FC<TransactionDrawerProps> = ({ isOpen, onClose, selectedOrderId, storeId }) => {
  const [transaction, setTransaction] = useState<UPITransactionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: any = [
    {
      key: "transactionId",
      dataIndex: "transactionId",

      title: "Transaction ID",
    },
    {
      key: "orderId",
      dataIndex: "orderId",
      title: "Order ID",
    },
    {
      key: "storeId",
      dataIndex: "storeId",
      title: "Store ID",
    },
    {
      key: "email",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Created At",
    },
  ];

  const getTransactionData = async (stId: string, orderId: string) => {
    try {
      setLoading(true);
      const result = await orderService.getOrderPayment(storeId, orderId);
      setTransaction(result.transactions);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOrderId && storeId) {
      getTransactionData(storeId, selectedOrderId);
    }
  }, [storeId, selectedOrderId]);

  return (
    <Drawer title='Transaction Details' placement='bottom' onClose={onClose} open={isOpen} width={600} className='transaction-drawer'>
      <Table loading={loading} columns={columns} dataSource={transaction} pagination={false} size='middle' />
    </Drawer>
  );
};

export default TransactionDrawer;
