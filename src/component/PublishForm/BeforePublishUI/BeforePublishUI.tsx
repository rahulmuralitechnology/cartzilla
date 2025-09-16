"use client";

import type React from "react";
import { Button, Card, Space, Typography, Divider } from "antd";
import { HomeOutlined, RocketOutlined, CheckCircleOutlined } from "@ant-design/icons";
import "./BeforePublishUI.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const { Title, Text, Paragraph } = Typography;

const BeforePublishUI: React.FC = () => {
  const { selectedStore } = useSelector((state: RootState) => state.store);
  return (
    <div className='publish-store-container'>
      <Card className='publish-store-card' bordered={false}>
        <div className='publish-store-content'>
          {/* Icon Section */}
          <div className='icon-section'>
            <div className='icon-wrapper'>
              <HomeOutlined className='home-icon' />
            </div>
            <div className='icon-glow'></div>
          </div>

          {/* Title Section */}
          <div className='title-section'>
            <Title level={2} className='publish-main-title'>
              Ready to Publish Your {selectedStore?.siteType === "webapp" ? "Store" : "Site"}?
            </Title>
            <Paragraph className='subtitle'>
              Click the Publish button below to make your store live. You can always re-publish or delete your store later.
            </Paragraph>
          </div>

          <Divider className='custom-divider' />

          {/* Features Section */}
          <div className='features-section'>
            <Space direction='vertical' size='middle' className='features-list'>
              <div className='feature-item'>
                <CheckCircleOutlined className='feature-icon' />
                <Text className='feature-text'>Your store will be live and accessible to customers</Text>
              </div>
              <div className='feature-item'>
                <CheckCircleOutlined className='feature-icon' />
                <Text className='feature-text'>You can update or unpublish anytime</Text>
              </div>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BeforePublishUI;
