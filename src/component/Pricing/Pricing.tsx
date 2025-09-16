import { FC, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}
import { Row, Col, Typography, Button, Card, Space, Segmented, message } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import Razorpay from "razorpay";

// import "./Pricing.scss";
import subscriptionService from "../../services/subscriptionService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import appConstant from "../../services/appConstant";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedStoreId } from "../../store/reducers/storeSlice";

const { Title, Paragraph } = Typography;

const Pricing: FC = () => {
  const dispatch = useDispatch();
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Yearly">("Monthly");
  const { user } = useSelector((state: RootState) => state.user);
  const params = useParams() as { storeId: string };
  const [loading, setLoading] = useState({
    id: "",
    loading: true,
  });
  const navigate = useNavigate();

  const plans: any = [
    {
      id: "67becf1ed5e24b6eadd7fab9",
      name: "Basic",
      price: { monthly: "2999", yearly: "1999" },
      description: "For startups & small businesses looking to launch.",
      features: ["Online Store (100 SKU)", "Order Tracking", " Free COD & Payment Integration", "Inventory Management"],
      popular: false,
      cta: "Choose plan",
    },
    {
      id: "67bed064d5e24b6eadd7faba",
      name: "Business",
      price: { monthly: "5999", yearly: "4999" },
      description: "For growing businesses that need advanced features & marketing tools.",
      features: [
        "Online Store (250 SKU)",
        "Order Tracking",
        "Free COD & Payment Integration",
        "Discounts & Offers",
        "Advanced Analytics Dashboard",
      ],
      popular: true,
      cta: "Choose plan",
    },
    {
      id: "67bed16fd5e24b6eadd7fabb",
      name: "Growth Plan",
      price: { monthly: "9999", yearly: "8999" },
      description: "For scaling businesses looking for automation & insights.",
      features: ["Online Store (600 SKU)", "Order Tracking", "Free COD & Payment Integration", "Advanced Analytics"],
      popular: false,
      cta: "Choose plan",
    },
  ];

  const handleSubscription = async (planId: string) => {
    try {
      setLoading({ id: planId, loading: true });
      const subscriptionResponse = await subscriptionService.activatePlan({
        userId: user?.id,
        storeId: params.storeId,
        planId,
        price: 100,
      });

      const subscriptionData = subscriptionResponse.data;
      console.log("Subscription API Response:", subscriptionData);
      setLoading({ id: "", loading: false });

      if (!subscriptionData?.razorpayOrderId) {
        message.error(subscriptionData.message);
        return;
      }
      const options = {
        key: "rzp_test_2bOkYzIRJAYoYZ",
        amount: subscriptionData.amount * 100,
        currency: subscriptionData.currency,
        name: "Your Store Subscription",
        description: "Subscription Plan",
        order_id: subscriptionData.razorpayOrderId,
        handler: async (response: any) => {
          const verifyResponse = await fetch(`${appConstant.BACKEND_API_URL}/subscription/store/update-plan`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user?.id,
              storeId: params.storeId,
              planId,
              razorpayOrderId: response.razorpay_order.id || subscriptionData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success === "SUCCESS") {
            message.success("Subscription successful!");
            dispatch(setSelectedStoreId(null));
            navigate(`/store/configuration/${params.storeId}`);
          } else {
            message.error("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: user?.username,
          email: user?.email,
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setLoading({ id: "", loading: false });
      console.error("Error in subscription process:", error);
      message.error("An error occurred. Please try again.");
    }
  };

  return (
    <div id='pricing' className='pricing-section'>
      <div className='pricing-container'>
        <div className='pricing-header'>
          <Title level={2}>
            Simple, <span className='gradient-text'>transparent</span> pricing
          </Title>
          <Paragraph>No contracts. No surprise fees.</Paragraph>

          <div className='billing-toggle'>
            <Segmented
              options={["Monthly", "Yearly"]}
              value={billingCycle}
              onChange={setBillingCycle}
              block
              style={{ marginBottom: 20, height: 35 }}
            />
          </div>
        </div>

        <Row gutter={[12, 24]} className='pricing-cards'>
          {plans.map((plan: any, index: number) => (
            <Col key={index} xs={24} md={8}>
              <Card
                bordered={false}
                className={`pricing-card ${plan.popular ? "recommended" : "normal"}`}
                title={plan.name}
                extra={plan.popular && <span className='popular-tag'>MOST POPULAR</span>}>
                <div className='price'>
                  <span className='amount'>&#8377;{plan.price[billingCycle.toLowerCase()]}</span>
                  <span className='period'>/{billingCycle === "Monthly" ? "month" : "year"}</span>
                </div>
                <p className='description'>{plan.description}</p>
                <Space direction='vertical' className='features'>
                  {plan.features.map((feature: any, featureIndex: any) => (
                    <div key={featureIndex} className='feature'>
                      <CheckCircleFilled />
                      <span>{feature}</span>
                    </div>
                  ))}
                </Space>
                <Button
                  type='primary'
                  loading={loading.id === plan.id && loading.loading}
                  onClick={() => handleSubscription(plan.id)}
                  style={{ boxShadow: "none", marginTop: 30 }}
                  block>
                  {plan.cta}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Pricing;
