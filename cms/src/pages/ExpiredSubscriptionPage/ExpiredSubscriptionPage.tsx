import { Button, Typography, Space, Result, Flex } from "antd";
import { WarningOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import "./ExpiredSubscriptionPage.scss";
import appConstant from "../../services/appConstant";
import AppLogo from "../../component/AppLogo/AppLogo";
import authService from "../../services/authService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect } from "react";
import moment from "moment";

const { Title, Paragraph, Text } = Typography;

export default function SubscriptionExpired() {
  return (
    <div className='subscription-expired-container'>
      <Flex>
        <AppLogo width={160} />
        <Button
          danger
          onClick={() => {
            authService.logout();
            window.location.href = "/account/sign-in";
          }}>
          Logout
        </Button>
      </Flex>
      <Result
        status='warning'
        icon={<WarningOutlined className='warning-icon' />}
        title={
          <Title level={2} className='expired-title'>
            Your Subscription Has Expired
          </Title>
        }
        subTitle={
          <Space direction='vertical' size='large' className='expired-content'>
            <Paragraph className='expired-message'>
              Your access to our services has been temporarily suspended because your subscription period has ended.
            </Paragraph>
            <Paragraph className='renewal-message'>
              To continue enjoying our services without interruption, please renew your subscription by contacting our support team.
            </Paragraph>

            <div className='contact-section'>
              <Title level={4}>Contact Us to Renew Your Subscription</Title>
              <Space direction='vertical' size='middle' className='contact-options'>
                <Button type='primary' icon={<PhoneOutlined />} size='large' block>
                  Call Support: (800) 123-4567
                </Button>
                <Button type='default' icon={<MailOutlined />} href={`mailto:${appConstant.businessEmail}`} size='large' block>
                  Email: {appConstant.businessEmail}
                </Button>
              </Space>
            </div>

            <div className='note-section'>
              <Text type='secondary'>
                Our team is available Monday through Friday, 9:00 AM - 5:00 PM EST to assist you with your renewal.
              </Text>
            </div>
          </Space>
        }
      />
    </div>
  );
}
