import React, { useEffect, useState } from "react";
import { Button, List, message, Modal, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ActiveCart, CartItem, OrderItem } from "../../services/interfaces/common";
import { useParams } from "react-router-dom";
import cartService from "../../services/cartService";
import { Eye } from "lucide-react";
import appConstant from "../../services/appConstant";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const ActiveCartsTable: React.FC = () => {
  const [carts, setCarts] = useState<ActiveCart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<CartItem[]>([]);

  const getActiveCarts = async (id: string) => {
    setLoading(true);
    try {
      const result = await cartService.getAllActiveCarts(id);
      console.log("Active Carts", result.data.carts);
      setCarts(result.data.carts);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const handleViewDetails = (orderItems: CartItem[]) => {
    setSelectedOrderItems(orderItems);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrderItems([]);
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getActiveCarts(selectedStore?.id);
    }
  }, [selectedStore?.id]);
  // Define columns for the table
  const columns: ColumnsType<ActiveCart> = [
    {
      title: "Email",
      key: "email",
      render: (_: string, row: ActiveCart) => row?.user?.email,
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
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_: any, row: ActiveCart) => `₹ ${row.totalPrice}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={status === "Processed" ? "green" : "blue"}>{status}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, row: ActiveCart) => ` ${moment(row.createdAt).format("DD MM YYYY")}`,
    },
    // {
    //   title: "Processed At",
    //   dataIndex: "processedAt",
    //   key: "processedAt",
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ActiveCart) => (
        <Space size='middle'>
          <Button type='link' icon={<Eye size={16} />} onClick={() => handleViewDetails(record.items)}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table loading={loading} columns={columns} dataSource={carts} rowKey='id' />
      <Modal
        title='Ordered Items'
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key='close' onClick={handleCloseModal} style={{ backgroundColor: "#576fdb", color: "white" }}>
            Close
          </Button>,
        ]}
        className='order-details-modal'>
        <List
          dataSource={selectedOrderItems}
          renderItem={(item, index) => (
            <List.Item key={index} className='order-item'>
              <List.Item.Meta
                title={<Typography.Text strong>{item.name}</Typography.Text>}
                description={
                  <div className='space_between'>
                    <div className='order-item-text'>
                      <div>
                        <strong>Quantity:</strong> {item.quantity}
                        <br />
                        <strong>Price:</strong> {appConstant.CURRENY_SYMBOL}
                        {item.price?.toFixed(2)}
                      </div>
                    </div>
                    <div className='order-item-images'>
                      {Array.isArray(item.images) && item.images.length > 0 ? (
                        <img
                          src={item.images[0]} // Display the first image as the main image
                          alt='Main Product Image'
                          className='main-image'
                        />
                      ) : (
                        <p>No image</p>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default ActiveCartsTable;
