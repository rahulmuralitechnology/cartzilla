import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, Row, Col, Space, message, List, Typography } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleFilled } from "@ant-design/icons";
import "./AddStoreDetail/AddStoreDetail.scss";
import UploadInput from "../common/UploadInput";
import storeService from "../../services/storeService";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../store";
import subscriptionService from "../../services/subscriptionService";
import { onSetRefresh, setSelectedPlanId, setSelectedStoreId } from "../../store/reducers/storeSlice";
import { setLocalStorage } from "../../services/utils";
import CongratulationsModal from "../common/StarterCongratulation";
import { Link, useNavigate, useParams } from "react-router-dom";
import appConstant from "../../services/appConstant";
import { Modal } from "antd";
import SubscriptionCard from "../Pricing/PricingSelectedCard";
import { ChartNoAxesGantt } from "lucide-react";
const { Title, Paragraph } = Typography;

const { Dragger } = Upload;

const plan = {
  id: "starter",
  name: "For startups & small businesses looking to launch.",
  price: 0,
  featuresWebApp: ["Online Store with up to 25 products", "Order Tracking", "Free COD", "Discounts & Offers"],
  featuresBusinessSite: [
    "Static business website",
    "Mobile-responsive design",
    "Content management (CRM)",
    "Custom domain support",
    "Basic SEO optimization",
  ],
};

const couponApplicableFor: any = {
  starter: ["bloomi5100"],
  pro: [""],
};

const StorePayment: React.FC = ({}) => {
  const [form] = Form.useForm();
  const { user } = useSelector((state: RootState) => state.user);
  const { selectedPlanId } = useSelector((state: RootState) => state.store);
  const [allPlans, setAllPlans] = useState<any>([]);
  const [isAnnual, setIsAnnual] = useState("month");

  const {
    selectedSiteType,
    selectedTemplate,
    stores,
    refresh: storeRefresh,
    selectedStore,
  } = useSelector((state: RootState) => state.store);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [planPrice, setPlanPrice] = useState<number>(0);
  const [loading, setLoading] = useState({
    id: "",
    loading: true,
  });
  const params = useParams() as { storeId: string };

  const onApplyCouponCode = async () => {
    if (couponCode) {
      const isApplicable = couponApplicableFor[currentPlan?.key]?.includes(couponCode);
      if (!isApplicable) {
        message.error("Coupon is not applicable for this plan");
      } else {
        if (isAnnual === "annualy") {
          message.error("Coupon is not applicable for annual plans");
          return;
        }
        setCouponCode(couponCode);
        // If the current plan is "starter" and coupon is applied, set price to 20 for 2 months
        if (currentPlan?.key === "starter") {
          setPlanPrice(20);
        } else {
          setPlanPrice(currentPlan?.monthlyPrice || 0);
        }
        message.success("Coupon applied successfully");
      }
    }
  };

  const handleSubscription = async (planId: string) => {
    try {
      if (couponCode) {
        const isApplicable = couponApplicableFor[currentPlan?.key]?.includes(couponCode);
        if (!isApplicable) {
          message.error("Coupon is not applicable for this plan");
          return;
        }
      }

      let price = planPrice;
      setLoading({ id: planId, loading: true });

      const subscriptionResponse = await subscriptionService.activatePlan({
        userId: user?.id,
        storeId: params.storeId,
        planId,
        price,
        isAnnualSubscription: isAnnual === "month" ? false : true,
      });

      const subscriptionData = subscriptionResponse.data;

      if (subscriptionData.paymentStatus === "PENDING" && subscriptionData.razorpayOrderId) {
        if (!subscriptionData?.razorpayOrderId) {
          message.error(subscriptionData.message);
          return;
        }
        const options = {
          key: subscriptionData.razorpayKey,
          amount: subscriptionData.amount * 100,
          currency: subscriptionData.currency,
          name: "Your Store Subscription",
          description: "Subscription Plan",
          order_id: subscriptionData.razorpayOrderId,
          handler: async (response: any) => {
            const verifyResponse = await subscriptionService.activatePlan({
              userId: user?.id,
              storeId: params.storeId,
              planId,
              price,
              razorpayOrderId: response.razorpay_order_id || subscriptionData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            message.success("Subscription successful!");
            dispatch(setSelectedStoreId(null));
            navigate(`/store/configuration/${params.storeId}`);
          },
          prefill: {
            name: user?.username,
            email: user?.email,
            contact: user?.phone,
          },
          theme: {
            color: "#3f0082",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        message.success("Subscription successful!");
        dispatch(setSelectedStoreId(null));
        navigate(`/store/configuration/${params.storeId}`);
      }
      setLoading({ id: "", loading: false });
    } catch (error) {
      setLoading({ id: "", loading: false });
      console.error("Error in subscription process:", error);
      message.error("An error occurred. Please try again.");
    }
  };

  //   const onCreateStore = async () => {
  //     try {
  //       await form.validateFields();
  //       // if (!couponCode) return message.info("Please enter coupon code");
  //       setCreateLoading(true);
  //       const response = await storeService.createStore(
  //         {
  //           ...form.getFieldsValue(),
  //           storeCategory: selectedTemplate,
  //           siteType: selectedSiteType,
  //           userId: user?.id as string,
  //         },
  //         couponCode
  //       );

  //       setCouponModalVisible(false);

  //       if (response?.data?.store?.id) {
  //         navigate(`/pricing/${response.data.store.id}`);
  //       } else {
  //         await activateStater(user?.id, response?.data?.store?.id as string, selectedPlanId); //starter planId
  //         const createdStore = await storeService.getStoreById(response?.data?.store?.id as string);
  //         setLocalStorage(appConstant.SELECTED_STORE_ID, response?.data?.store?.id as string);
  //         dispatch(setSelectedStoreId(createdStore?.data?.store));
  //         setModalVisible(true);
  //         setTimeout(() => {
  //           if (createdStore?.data?.store?.storeCategory === "landing-page-bloomi5") {
  //             navigate(`/store/${storeId}/cms/page/homepage`);
  //           } else {
  //             navigate(`/store/configuration/${response?.data?.store?.id}`);
  //           }
  //         }, 2000);
  //       }
  //       setCreateLoading(false);
  //       setCouponCode("");
  //       setSubdomain("");

  //       message.success("Store created successfully");
  //     } catch (error: any) {
  //       setCreateLoading(false);
  //       console.log("Failed to add store", error);
  //       if (error?.errorFields?.length) {
  //         message.info("Field are missing");
  //       } else {
  //         message.error(error.message);
  //       }
  //     }
  //   };

  const fetchAllPlans = async () => {
    try {
      const response = await subscriptionService.getAllPlans();
      const firstPlan = response.data.find((p) => p.id === selectedPlanId) || response.data[0];
      dispatch(setSelectedPlanId(firstPlan.id));
      setCurrentPlan(firstPlan);
      setPlanPrice(firstPlan.monthlyPrice); // Set the initial plan price to the first plan's monthlyPrice
      setAllPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  React.useEffect(() => {
    fetchAllPlans();
  }, []);

  useEffect(() => {
    if (isAnnual === "annualy") {
      setPlanPrice(Math.round(currentPlan.annualPrice / 12) || 0);
    } else {
      setPlanPrice(currentPlan?.monthlyPrice || 0);
    }
  }, [isAnnual, currentPlan]);

  return (
    <div className='store-details-container' style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className='store-details-content' style={{ gridTemplateColumns: "1fr" }}>
        <div className='form-section'>
          <h1 style={{ marginTop: 20 }}>
            Select <span className='highlight'>{selectedSiteType === "webapp" ? "Store" : "Site"}</span> Plan
          </h1>
          <p className='subtitle' style={{ marginBottom: 0 }}>
            Choose a plan that suits your business needs.
          </p>

          <div className='modal-content congratulations-modal'>
            <div className='plan-details' style={{ marginBottom: 0 }}>
              <div className='plan-name-container'></div>
              <SubscriptionCard
                isAnnual={isAnnual}
                setIsAnnual={setIsAnnual}
                allPlans={allPlans}
                currentPlan={currentPlan}
                planPrice={planPrice}
                onChangeCurrentPlan={(v) => {
                  setCurrentPlan(v);
                  setPlanPrice(v.monthlyPrice);
                  setCouponCode(""); // Reset coupon code when changing plans
                }}
              />
              <div style={{ width: "550px", margin: "0 auto" }}>
                <Row gutter={[16, 16]}>
                  {currentPlan?.features &&
                    (selectedSiteType === "webapp" ? currentPlan?.features?.core : currentPlan?.features?.core).map(
                      (item: string, index: number) => (
                        <Col span={12} key={index}>
                          <List.Item className='feature-item'>
                            <CheckCircleFilled color='#52c41a' style={{ color: "#52c41a" }} className='feature-icon' />
                            {item}
                          </List.Item>
                        </Col>
                      )
                    )}
                  <Col span={12} key={"link"}>
                    <List.Item className='feature-item'>
                      <ChartNoAxesGantt color='#52c41a' style={{ color: "#52c41a" }} className='feature-icon' />
                      <Link style={{ color: "var(--primary-color-two)" }} to={"/pricing"}>
                        See details
                      </Link>
                    </List.Item>
                  </Col>
                </Row>
              </div>
              <Space direction='vertical' size={8} style={{ marginTop: "20px", width: "100%" }}>
                <h2 style={{ color: "#3f0082" }}>Apply Coupon</h2>
                <Row gutter={[16, 16]}>
                  <Col span={20}>
                    <Input
                      placeholder='Enter coupon code'
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{ height: "40px", border: "1px solid #3f0082", borderRadius: "8px", fontWeight: 600, fontSize: "1rem" }}
                    />
                  </Col>
                  <Col span={4}>
                    <Button
                      type='primary'
                      onClick={onApplyCouponCode}
                      style={{
                        height: "40px",
                        border: "1px solid #3f0082",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#fff",
                      }}>
                      Apply
                    </Button>
                  </Col>
                </Row>
              </Space>
            </div>
          </div>
        </div>
        <div className='illustration-section'>
          {/* <img src='/assets/configure-store.png' alt='Brand Setup Illustration' className='brand-illustration' /> */}
        </div>
      </div>
      <div className='button-group'>
        <Space size='middle'>
          <Button type='default' onClick={() => navigate("/store-list")} className='back-btn'>
            <ArrowLeftOutlined /> Back
          </Button>
          <Button
            type='primary'
            onClick={() => handleSubscription(selectedPlanId)}
            loading={createLoading}
            className='custom-btn-gradient next-btn'>
            Next <ArrowRightOutlined />
          </Button>
        </Space>
      </div>
      <Modal
        title='Apply Coupon Code'
        open={couponModalVisible}
        onCancel={() => setCouponModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setCouponModalVisible(false)}>
            Cancel
          </Button>,
          <Button key='apply' loading={createLoading} type='primary'>
            Apply
          </Button>,
        ]}>
        <Input placeholder='Enter coupon code' value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
      </Modal>

      <CongratulationsModal
        visible={modalVisible}
        onClose={() => {
          navigate(`/store/configuration/${selectedStore?.id}`);
          setModalVisible(false);
        }}
      />
    </div>
  );
};

export default StorePayment;
