import type React from "react";
import { useState } from "react";
import { Modal, Card, Radio, Button, Typography, Space, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { DEFAULT_THEME } from "../../theme/defaultTheme";
import Pricing from "../Pricing/Pricing";

const { Title, Paragraph } = Typography;

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Starter",
    price: 0.0,
    features: ["Online Store with 5 free products", "Order Tracking", "Free COD", "Discounts & Offers"],
  },
  {
    name: "Basic",
    price: 1499.0,
    features: [
      "Includes all Basic Plan features",
      "Up to 5 Stores",
      "Unlimited Publishing",
      "Advanced Templates",
      "Analytics Dashboard",
      "Email Support",
    ],
  },
  {
    name: "Enterprise",
    price: 899.99,
    features: [
      "Includes all Pro Plan features",
      "Unlimited Stores",
      "White Label Branding",
      "Priority Support (24/7)",
      "Dedicated Account Manager",
      "API Access",
    ],
  },
];

const SubscriptionModal: React.FC<{ isOpen: boolean; setIsModalVisible: (v: boolean) => void }> = ({ isOpen, setIsModalVisible }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>("Pro");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPlan(null);
  };

  const handlePlanChange = (e: any) => {
    setSelectedPlan(e.target.value);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      message.error("Please select a plan before proceeding.");
      return;
    }

    // Here you would typically make an API call to your backend to create an order
    // and get the Razorpay order ID. For this example, we'll just simulate it.
    const simulateApiCall = () => {
      return new Promise<string>((resolve) => {
        setTimeout(() => resolve("simulated_order_id"), 1000);
      });
    };

    simulateApiCall().then((orderId) => {
      // In a real application, you would use the actual Razorpay checkout here
      // For this example, we'll just show a message
      message.success(`Redirecting to Razorpay for ${selectedPlan} plan payment...`);
      console.log(`Order ID: ${orderId}`);
      // Normally, you would open the Razorpay checkout here
      setIsModalVisible(false);
      setSelectedPlan(null);
    });
  };

  return (
    <>
      <Modal
        title={<h2 style={{ textAlign: "center" }}>Choose Your Subscription Plan</h2>}
        open={isOpen}
        centered
        destroyOnClose
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key='subscribe' type='primary' onClick={handleSubscribe} disabled={!selectedPlan}>
            Subscribe Now
          </Button>,
        ]}
        width={1020}>
        <div style={{ height: 530, padding: "0 20px" }}>
          <Pricing />
          {/* <Radio.Group defaultValue={"Pro"} onChange={handlePlanChange} style={{ width: "100%", marginTop: 80 }} value={selectedPlan}>
            <Space size='middle' style={{ width: "100%", justifyContent: "space-between" }}>
              {subscriptionPlans.map((plan, i) => (
                <Space direction='vertical' key={i}>
                  <Card
                    key={plan.name}
                    hoverable
                    className='subscription_plan_card'
                    style={{
                      transform: plan.name === "Pro" ? "scale(1.2)" : "scale(1)",
                      width: "280px",
                      background: selectedPlan === plan.name ? DEFAULT_THEME.brand.brandColor : "#fff",
                      color: selectedPlan === plan.name ? "#fff" : DEFAULT_THEME.brand.brandColor,
                    }}>
                    <Radio value={plan.name}>
                      <Space direction='vertical' size={5}>
                        <Title
                          style={{
                            color: selectedPlan === plan.name ? "#fff" : DEFAULT_THEME.brand.brandColor,
                          }}
                          level={4}>
                          {plan.name}
                        </Title>
                        <Paragraph
                          style={{
                            color: selectedPlan === plan.name ? "#fff" : DEFAULT_THEME.brand.brandColor,
                          }}
                          strong>
                          ${plan.price}/month
                        </Paragraph>
                        {plan.features.map((feature, index) => (
                          <Paragraph
                            key={index}
                            style={{
                              color: selectedPlan === plan.name ? "#fff" : DEFAULT_THEME.brand.brandColor,
                            }}>
                            <CheckOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                            {feature}
                          </Paragraph>
                        ))}
                      </Space>
                    </Radio>
                  </Card>
                  {plan.name === "Pro" && <p>Recommended Plan</p>}
                </Space>
              ))}
            </Space>
          </Radio.Group> */}
        </div>
      </Modal>
    </>
  );
};

export default SubscriptionModal;
