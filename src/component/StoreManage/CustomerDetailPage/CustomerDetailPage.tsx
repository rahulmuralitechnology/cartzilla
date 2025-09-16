"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Table, Input, Button, Space, Card, Avatar, Tag, Dropdown, Menu, Tabs, message } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  MoreOutlined,
  FilterOutlined,
  DownOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./CustomerDetailPage.scss";
import CustomerAddressShipping from "./CustomerAddress";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CustomerProfile } from "../../../services/interfaces/customerDetail";
import customerService from "../../../services/customerService";

const { TabPane } = Tabs;

const CustomersDetailPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerProfile>();
  const params = useParams() as { customerId: string };
  const navigate = useNavigate();

  const getCustomerInfo = async (id: string) => {
    setLoading(true);
    try {
      const result = await customerService.getCustomerInfoById(id);
      setCustomerInfo(result.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.customerId) {
      getCustomerInfo(params.customerId);
    }
  }, [params.customerId]);
  // Sample data
  return (
    <Card loading={loading} styles={{ body: { padding: 0 } }} className='customers-page'>
      <div className='page-header'>
        <h1>Customers Detail</h1>
        <Button type='text' icon={<ArrowLeft />} onClick={() => navigate(-1)} className='back-button'>
          Go Back
        </Button>
      </div>

      <Card className='profile-card'>
        <div className='profile-header'>
          <Avatar size={64} icon={<UserOutlined />} />
          <div className='profile-title'>
            <h2>{customerInfo?.profile.username}</h2>
            <Tag color={customerInfo?.profile?.isActive ? "success" : "error"}>
              {customerInfo?.profile?.isActive ? "Active" : "Inactive"}
            </Tag>
          </div>
        </div>

        <div className='profile-details'>
          <div className='detail-item'>
            <MailOutlined className='detail-icon' />
            <div>
              <div className='detail-value'>{customerInfo?.profile?.email}</div>
            </div>
          </div>

          <div className='detail-item'>
            <PhoneOutlined className='detail-icon' />
            <div>
              <div className='detail-value'>{customerInfo?.profile?.phone || "Not provided"}</div>
            </div>
          </div>

          <div className='detail-item'>
            <UserOutlined className='detail-icon' />
            <div>
              <div className='detail-value'>
                <Tag color='blue'>{customerInfo?.profile?.role}</Tag>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {customerInfo && (
        <CustomerAddressShipping
          address={customerInfo?.address || []}
          orderData={customerInfo?.lastOrders?.length > 0 ? customerInfo?.lastOrders : []}
        />
      )}
    </Card>
  );
};

export default CustomersDetailPage;
