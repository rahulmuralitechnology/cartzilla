import { Card, Avatar, Typography, Space } from "antd";
import { UserOutlined, BankOutlined, MailOutlined } from "@ant-design/icons";
import "./InviteAddClientUser.scss";

const { Text, Title } = Typography;

interface AdminInfoProps {
  organizationName: string;
  storeName: string;
}

export default function AdminInfo({ organizationName, storeName }: AdminInfoProps) {
  return (
    <Card className='admin-info-card'>
      <div className='admin-info-content'>
        <Avatar size={64} icon={<UserOutlined />} className='admin-avatar' />
        <div className='admin-details'>
          <Title level={4}>You've been invited by:</Title>
          <Space direction='vertical' size={1}>
            <div className='admin-detail-item'>
              <BankOutlined className='admin-icon' />
              <Text>{organizationName}</Text>
            </div>
            <Text>Site - {storeName}</Text>
          </Space>
        </div>
      </div>
    </Card>
  );
}
