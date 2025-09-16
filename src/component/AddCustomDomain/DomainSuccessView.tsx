import { Result, Typography, Card, Steps, Button, Divider, Tag, Space } from "antd";
import { CheckCircleOutlined, LinkOutlined } from "@ant-design/icons";
import "./AddCustomDomain.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FC } from "react";
import { useParams } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const DomainSetupSuccess: FC<{ onManageDomain: () => void }> = ({ onManageDomain }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const { storeId } = useParams() as { storeId: string };
  return (
    <div className='domain-setup-container'>
      <Card className='domain-setup-card' bordered={false}>
        <Result
          status='success'
          style={{ padding: "20px 0" }}
          title='Domain Setup Successful!'
          subTitle='Your custom domain has been configured and is now live.'
          icon={<CheckCircleOutlined />}
        />

        <div className='domain-display'>
          <Text type='secondary'>Your setup domain is</Text>
          <div className='domain-name'>
            <a href={`https://${selectedStore?.domain}` as string} target='_blank'>
              <LinkOutlined />
            </a>
            <Title level={3}>{selectedStore?.domain}</Title>
          </div>
          <Tag color='success'>Active</Tag>
        </div>

        <Space className='action-buttons'>
          <Button type='primary' href={`/store/${storeId}`} size='large'>
            Go to Home
          </Button>
          <Button size='large' onClick={onManageDomain}>
            Manage Domain Settings
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default DomainSetupSuccess;
