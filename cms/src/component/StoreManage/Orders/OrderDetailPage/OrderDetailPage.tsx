"use client";

import type React from "react";
import { useState } from "react";
import { Table, Tag, Input, Button, Space, Dropdown, DatePicker, Badge, Card, Tooltip } from "antd";

import "./OrderDetailPage.scss";
import OrderLineItems from "./OrderLineItem";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderDetailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='orders-page'>
      <div className='page-header'>
        <Space size={0}>
          <h1>Orders</h1>
        </Space>
        <Button type='text' icon={<ArrowLeft />} onClick={() => navigate(-1)} className='back-button'>
          Go Back
        </Button>
      </div>
      <OrderLineItems orderDiscount={10} orderShipping={33} orderSubtotal={100} orderTax={5} orderTotal={200} />
    </div>
  );
};

export default OrderDetailPage;
