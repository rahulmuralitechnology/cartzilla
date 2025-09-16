"use client";

import type React from "react";
import { useState } from "react";
import { Card, Tabs, Typography, Button, Form, Input, Select, Row, Col, Divider, Tag, List, Space, Table } from "antd";
import {
  HomeOutlined,
  ShopOutlined,
  EditOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./CustomerDetailPage.scss";
import { ColumnsType } from "antd/es/table";
import { Order } from "../../../services/orderService";
import appConstant from "../../../services/appConstant";
import moment from "moment";
import { Address } from "../../../services/interfaces/customerDetail";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface CustomerAddressShippingProps {
  orderData: Order[];
  address: Address[];
}

const CustomerAddressShipping: React.FC<CustomerAddressShippingProps> = ({ orderData, address }) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("2");

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const renderAddressCard = (address: Address) => (
    <Card key={address.id} className='address-card'>
      <div className='address-header'>
        <div className='address-title'>
          {address.addressType === "billing" ? <HomeOutlined /> : <ShopOutlined />}
          <Text strong className='address-type'>
            {address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)} Address
          </Text>
          {address.isDefault && <Tag color='blue'>Default</Tag>}
        </div>
        {/* <Button type='text' icon={<EditOutlined />} onClick={handleEditToggle} /> */}
      </div>

      <div className='address-content'>
        <Text strong>{address.name}</Text>
        <Text>{address.line1 || address.line2}</Text>
        <Text>
          {address.city}, {address.state} {address.zip}
        </Text>
        <Text>{address.country}</Text>
        <Text>{address.phone}</Text>
      </div>
    </Card>
  );

  const renderAddressForm = () => (
    <Form layout='vertical' className='address-form'>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label='Full Name' name='name' rules={[{ required: true }]}>
            <Input placeholder='Full Name' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label='Street Address' name='street' rules={[{ required: true }]}>
            <Input placeholder='Street Address' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label='City' name='city' rules={[{ required: true }]}>
            <Input placeholder='City' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='State/Province' name='state' rules={[{ required: true }]}>
            <Input placeholder='State/Province' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label='Postal Code' name='zipCode' rules={[{ required: true }]}>
            <Input placeholder='Postal Code' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='Country' name='country' rules={[{ required: true }]}>
            <Select placeholder='Select Country'>
              <Option value='US'>United States</Option>
              <Option value='CA'>Canada</Option>
              <Option value='UK'>United Kingdom</Option>
              <Option value='AU'>Australia</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label='Phone Number' name='phone'>
            <Input placeholder='Phone Number' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name='isDefault' valuePropName='checked'>
            <div className='default-checkbox'>
              <input type='checkbox' id='isDefault' />
              <label htmlFor='isDefault'>Set as default address</label>
            </div>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} className='form-actions'>
          <Button onClick={handleEditToggle}>Cancel</Button>
          <Button type='primary'>Save Address</Button>
        </Col>
      </Row>
    </Form>
  );

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      delivered: "green",
      "in-transit": "blue",
      processing: "orange",
      pending: "gold",
    };
    return statusColors[status] || "default";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircleOutlined />;
      case "in-transit":
        return <CarOutlined />;
      case "processing":
      case "pending":
        return <ClockCircleOutlined />;
      default:
        return <GlobalOutlined />;
    }
  };

  const orderColumns: ColumnsType<any> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      render: (totalAmount: number, order: Order) => `${order?.orderId || "--"}`,
      key: "orderId",
    },
    {
      title: "Quantity",
      render: (totalAmount: number, order: Order) => `${order?.orderItems?.length}`,
      key: "quantity",
    },
    {
      title: "Shipping Charges",
      dataIndex: "shippingCost",
      key: "shippingCost",
      render: (_: any, record: Order) => `${appConstant.CURRENY_SYMBOL}${record?.shippingCost?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (totalAmount: number, order: Order) => `${appConstant.CURRENY_SYMBOL}${order.totalAmount?.toFixed(2)}`,
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
      render: (status) => <Tag color={status === "PAYMENT_PENDING" ? "orange" : "green"}>{status}</Tag>,
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD MMM YY, hh:mm A"), // Format the date as needed her
      key: "createdAt",
    },
  ];

  return (
    <div className='customer-address-shipping'>
      <Card className='address-shipping-card' styles={{ body: { padding: "0px 10px" } }}>
        <Tabs activeKey={activeTab} onChange={handleTabChange} className='address-shipping-tabs'>
          <TabPane tab='Orders' key='2'>
            <Table columns={orderColumns} dataSource={orderData} rowKey='orderId' />
          </TabPane>
          <TabPane tab='Addresses' key='1'>
            <div className='addresses-container'>
              {editMode ? (
                renderAddressForm()
              ) : (
                <>
                  <div className='addresses-grid'>
                    {address.map((addres) => renderAddressCard(addres))}
                    {/* <Card className='address-card add-card'>
                      <Button icon={<PlusOutlined />} className='add-button'>
                        Add New Address
                      </Button>
                    </Card> */}
                  </div>
                </>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CustomerAddressShipping;
