import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Modal, message, List, Typography, Select, Dropdown, Flex } from "antd";
import {
  DashOutlined,
  DeliveredProcedureOutlined,
  DownloadOutlined,
  EditOutlined,
  MoneyCollectFilled,
  PrinterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { setLoading, setOrders } from "../../../../store/reducers/orderSlice";
import orderService, { Order } from "../../../../services/orderService";
import { Link, useNavigate, useParams } from "react-router-dom";
import appConstant from "../../../../services/appConstant";
import TransactionDrawer from "../../../OrderUPIPayment/OrderUPIPayment";
import "../../../../styles/OrderManage.scss";
import OrderTrackingModal from "../OrderTracking/OrderTracking";
import { set } from "lodash";
import moment from "moment";

const { Search } = Input;

const OrdersTable: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const { storeId } = useParams() as { storeId: string };
  const [searchText, setSearchText] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState({
    isOpen: false,
    id: "",
  });
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [openTrackModal, setOpenTrackModal] = useState(false);
  const [trackOrder, setTrackOrder] = useState<Order | null>(null);
  const [transDrawer, setTransDrawer] = useState(false);
  const [resfreh, setRefresh] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<Order["orderItems"]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [downloadLoading, setDownloading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const statusColors: any = {
    PROCESSING: "gold",
    SHIPPED: "blue",
    DELIVERED: "green",
    CANCELLED: "red",
    RETURNED: "red",
  };
  const paymentStatus: any = {
    PAYMENT_PENDING: "gold",
    REFUNDED: "blue",
    PAID: "green",
    FAILED: "red",
  };

  const handleViewDetails = (orderItems: Order["orderItems"]) => {
    setSelectedOrderItems(orderItems);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrderItems([]);
  };
  const handleCloseStatusModal = () => {
    setIsStatusModal(false);
    setSelectedOrder(null);
    setOrderStatus("");
  };

  const closeTransDrawer = () => {
    setTransDrawer(false);
    setSelectedOrder(null);
  };

  const onDownloadShippingLabel = async (orderId: string, print: boolean) => {
    try {
      messageApi.open({
        key,
        type: "loading",
        content: "Please wait...",
      });
      await orderService.getShippingPrintLabel(selectedStore?.id as string, orderId, print);
      messageApi.open({
        key,
        type: "success",
        content: "Complated!",
        duration: 2,
      });
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const onDownalodOrderInvoice = async (orderId: string, print: boolean) => {
    try {
      messageApi.open({
        key,
        type: "loading",
        content: "Please wait...",
      });
      await orderService.getOrderInvoice(selectedStore?.id as string, orderId, print);
      messageApi.open({
        key,
        type: "success",
        content: "Complated!",
        duration: 2,
      });
    } catch (error: any) {
      console.log("invoice label", error);
      message.error(error.message);
    }
  };

  const columns: any = [
    {
      title: "Order Id",
      dataIndex: "oderId",
      key: "oderId",
      render: (_: any, record: Order) => record?.orderId || "--",
    },
    {
      title: "Customer",
      dataIndex: "username",
      key: "username",
      render: (_: any, record: Order) => <Link to={`/store/${storeId}/order/${record.id}`}>{record.username}</Link>,
    },
    {
      title: "Order Items",
      dataIndex: "orderItems",
      key: "orderItems",
      align: "right",
      render: (_: any, record: Order) => record?.orderItems?.length,
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_: any, record: Order) => moment(record.orderDate).format("DD MMM YY, hh:mm A"),
      sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status: Order["status"]) => (
        <Tag color={statusColors[status]} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Processing", value: "processing" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value: string | number | boolean, record: Order) => record.status === value,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: Order["paymentStatus"]) => (
        <Tag color={paymentStatus[status]} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Processing", value: "processing" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value: string | number | boolean, record: Order) => record.status === value,
    },
    {
      title: "Shipping Charges",
      dataIndex: "shippingCost",
      key: "shippingCost",
      render: (_: any, record: Order) => `${appConstant.CURRENY_SYMBOL}${record?.shippingCost?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_: any, record: Order) => `${appConstant.CURRENY_SYMBOL}${record?.totalAmount?.toFixed(2)}`,
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
    },

    {
      title: "Payment Method",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Action",
      align: "center",
      key: "actions",
      render: (_: any, record: Order) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                label: "Update Status",
                onClick: () => {
                  setIsStatusModal(true);
                  setSelectedOrder(record);
                  setPayStatus(record.paymentStatus);
                  setOrderStatus(record.status);
                },
                icon: <EditOutlined />,
                key: "1",
              },
              // {
              //   label: "Shipping Label",
              //   onClick: () => {
              //     onDownloadShippingLabel(record.id, false);
              //   },
              //   icon: <DownloadOutlined />,
              //   key: "2",
              // },
              // {
              //   label: "Download Invoice",
              //   onClick: () => {
              //     onDownalodOrderInvoice(record.id, false);
              //   },
              //   icon: <DownloadOutlined />,
              //   key: "3",
              // },
              {
                label: "Print Shipping Label",
                onClick: () => {
                  onDownloadShippingLabel(record.id, true);
                },
                icon: <PrinterFilled />,
                key: "4",
              },
              {
                label: "Print Invoice",
                onClick: () => {
                  onDownalodOrderInvoice(record.id, true);
                },
                icon: <PrinterFilled />,
                key: "5",
              },
              // {
              //   label: "Ship Order",
              //   onClick: () => {
              //     navigate(`/store/${storeId}/order/${record.id}/ship`);
              //   },
              //   icon: <DeliveredProcedureOutlined />,
              //   key: "6",
              // },
              // {
              //   label: "Track Order",
              //   onClick: () => {
              //     setOpenTrackModal(true);
              //     setTrackOrder(record);
              //   },
              //   icon: <DeliveredProcedureOutlined />,
              //   key: "7",
              // },
              // {
              //   label: "UPI Payment",
              //   disabled: record.paymentMode !== "upi",
              //   onClick: () => {
              //     setTransDrawer(true);
              //     setSelectedOrder(record);
              //   },
              //   icon: <MoneyCollectFilled />,
              //   key: "2",
              // },
            ],
          }}>
          <DashOutlined style={{ fontSize: "1.2rem" }} />
        </Dropdown>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    const filtered = orders.filter(
      (order: Order) =>
        order.id.toLowerCase().includes(value.toLowerCase()) ||
        order?.orderId?.toLowerCase().includes(value.toLowerCase()) ||
        order.status.toLowerCase().includes(value.toLowerCase()) ||
        order.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
    setSearchText(value);
  };

  const getAllOrders = async (storeId: string) => {
    dispatch(setLoading(true));
    try {
      const response = await orderService.getAllStoreOrders(storeId);
      dispatch(setOrders(response.data));
      setFilteredOrders(response?.data);
    } catch (error) {
      console.log("Failed to fetch products", error);
    }
    dispatch(setLoading(false));
  };

  const handleUpdateStatus = async () => {
    try {
      setStatusLoading(true);
      const result = await orderService.updateOrderStatus(selectedOrder?.id as string, orderStatus, payStatus, trackingNo, deliveryPartner);
      message.success("Order status updated successfully");
      handleCloseStatusModal();
      setRefresh(!resfreh);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getAllOrders(selectedStore?.id);
    }
  }, [selectedStore?.id, resfreh]);

  return (
    <section className='bloomi5_page orders_page'>
      {contextHolder}
      <Flex justify='space-between' align='center' style={{ marginBottom: 15 }}>
        <h2>Orders </h2>
        <Search
          placeholder='Search orders by ID or customer name'
          allowClear
          enterButton={<SearchOutlined />}
          size='large'
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredOrders?.length > 0 ? filteredOrders : []}
        loading={loading}
        rowKey='id'
        pagination={{
          total: filteredOrders?.length,
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total) => `Total ${total} orders`,
        }}
      />

      <Modal
        title='Update Order Status'
        open={isStatusModal}
        centered
        destroyOnClose
        onCancel={handleCloseStatusModal}
        footer={[
          <Button key='close' onClick={handleCloseStatusModal}>
            Close
          </Button>,
          <Button key='update' loading={statusLoading} type='primary' onClick={() => handleUpdateStatus()}>
            Update
          </Button>,
        ]}
        className='update-status-modal'>
        <Space direction='vertical' size={20} style={{ width: "100%" }}>
          <h4>Order Status</h4>
          <Select value={orderStatus} placeholder='Order Status' style={{ width: "100%" }} onChange={(value) => setOrderStatus(value)}>
            <Select.Option value='CONFIRMED'>CONFIRMED</Select.Option>
            <Select.Option value='PACKED'>PACKED</Select.Option>
            <Select.Option value='SHIPPED'>SHIPPED</Select.Option>
            <Select.Option value='DELIVERED'>DELIVERED</Select.Option>
            <Select.Option value='CANCELLED'>CANCELLED</Select.Option>
          </Select>

          <h4>Tracking Details (Optional)</h4>
          <Input
            placeholder='Enter tracking number'
            value={selectedOrder?.trackingNo || ""}
            onChange={(e) => setTrackingNo(e.target.value)}
          />
          <Input
            placeholder='Enter delivery partner name'
            value={selectedOrder?.deliveryPartner || ""}
            onChange={(e) => setDeliveryPartner(e.target.value)}
          />

          <h4>Payment Status</h4>
          <Select value={payStatus} placeholder='Payment Status' style={{ width: "100%" }} onChange={(value) => setPayStatus(value)}>
            <Select.Option value='PAYMENT_PENDING'>PAYMENT_PENDING</Select.Option>
            <Select.Option value='PAID'>PAID</Select.Option>
            <Select.Option value='REFUNDED'>REFUNDED</Select.Option>
            <Select.Option value='FAILED'>FAILED</Select.Option>
          </Select>
        </Space>
      </Modal>
      {trackOrder && (
        <OrderTrackingModal
          order={trackOrder}
          onClose={() => {
            setOpenTrackModal(false);
            setTrackOrder(null);
          }}
        />
      )}
      {/* <TransactionDrawer
        isOpen={transDrawer}
        onClose={closeTransDrawer}
        selectedOrderId={selectedOrder?.id as string}
        storeId={selectedStore?.id as string}
      /> */}
    </section>
  );
};

export default OrdersTable;
