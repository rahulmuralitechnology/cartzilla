import React, { FC, useEffect, useState } from "react";
import { Check, Star, Crown, Rocket, Eye, EyeOff } from "lucide-react";
import "./Pricing2.scss";
import { Badge, message, Segmented, Tag } from "antd";
import subscriptionService from "../../../services/subscriptionService";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import appConstant from "../../../services/appConstant";
import { setSelectedStoreId } from "../../../store/reducers/storeSlice";
import storeService from "../../../services/storeService";

export const PlanIcon: any = {
  starter: <Star className='w-8 h-8' style={{ color: "var(--primary-color-two)" }} />,
  growth: <Rocket className='w-8 h-8' style={{ color: "var(--primary-color-two)" }} />,
  scale: <Crown className='w-8 h-8' style={{ color: "var(--primary-color-two)" }} />,
};

export default function ModernPricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [allPlans, setAllPlans] = useState<any>([]);
  const { user } = useSelector((state: RootState) => state.user);
  const params = useParams() as { storeId: string };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMoreFeatures, setShowMoreFeatures] = useState<any>({
    starter: false,
    growth: false,
    scale: false,
  });
  const [loading, setLoading] = useState({
    id: "",
    loading: true,
  });

  const toggleFeatures = (plan: any) => {
    setShowMoreFeatures((prev: any) => ({
      ...prev,
      [plan]: !prev[plan],
    }));
  };

  const addOnServices = [
    { service: "Additional Product Listings", price: "₹500 for 20 additional products" },
    { service: "Extra Social Media Platform", price: "₹750 per additional platform" },
    { service: "Custom Feature Development", price: "Starting at ₹5,000 (quote provided)" },
    { service: "Additional Training Hours", price: "₹1,000 per hour" },
    { service: "Dedicated SEO Campaign", price: "Starting at ₹7,500 per month" },
    { service: "Content Creation Package", price: "Starting at ₹5,000 per month" },
  ];

  const allPlansInclude = [
    "No hidden fees or charges",
    "No long-term contracts required (monthly plans)",
    "Free SSL security certificate",
    "Regular platform updates and improvements",
    "Data backup and security",
    "Indian payment gateway integration",
  ];

  const fetchAllPlans = async () => {
    try {
      const response = await subscriptionService.getAllPlans();
      setAllPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleSubscription = async (planId: string, price: number) => {
    try {
      setLoading({ id: planId, loading: true });

      const subscriptionResponse = await subscriptionService.activatePlan({
        userId: user?.id,
        storeId: params.storeId,
        planId,
        price,
      });

      const subscriptionData = subscriptionResponse.data;
      console.log("Subscription API Response:", subscriptionData);

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
            console.log("Razorpay response:", response);
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
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
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

  React.useEffect(() => {
    fetchAllPlans();
  }, []);

  const PlanCard: FC<{ plan: any }> = ({ plan }) => {
    const showMore = showMoreFeatures[plan.key];
    const currentFeatures = showMore ? [...plan.features.core, ...plan.features.additional] : plan.features.core;
    const params = useParams() as { storeId: string };
    const navigate = useNavigate();

    const fetchStoreInfo = async () => {
      try {
        const response = await storeService.getStoreById(params.storeId);
        const storeInfo = response.data;
        if (storeInfo.store.paymentStatus === "ACTIVE") {
          navigate(`/store/configuration/${params.storeId}`);
        }
      } catch (error) {
        console.error("Error fetching store info:", error);
      }
    };

    useEffect(() => {
      if (params.storeId) {
        fetchStoreInfo();
      }
    }, [params.storeId]);

    return (
      <div className={`pricing-card ${plan.className} ${plan.popular ? "popular" : ""}`}>
        {plan.popular && (
          <div className='popular-badge'>
            <span>Most Popular</span>
          </div>
        )}

        <div className='plan-header' style={{ background: plan.gradient }}>
          <div className='plan-icon'>{PlanIcon[plan.key]}</div>
          <h3 className='plan-name'>{plan.name}</h3>
          <p className='plan-description'>{plan.description}</p>
        </div>

        <div className='pricing-section'>
          <div className='price-main'>
            ₹{isAnnual ? Math.round(plan.annualPrice / 12).toLocaleString() : plan.monthlyPrice.toLocaleString()}
            <span>/{isAnnual ? "month" : "month"}</span>
          </div>
          {isAnnual && (
            <div className='price-annual'>
              Billed annually ₹{plan.annualPrice.toLocaleString()}
              <Tag color='green' style={{ marginLeft: "10px" }}>
                save ₹{plan.savings.toLocaleString()}
              </Tag>
            </div>
          )}
        </div>

        {/* <div className='divider'></div> */}

        <div className='features-section'>
          <h5>Core Features:</h5>
          <ul className='features-list'>
            {currentFeatures.map((feature: any, index: any) => (
              <li key={index} className={`feature-item ${index >= plan.features.core.length ? "additional-feature" : ""}`}>
                <Check className='check-icon' />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {plan.features.additional.length > 0 && (
            <button className='show-more-btn' onClick={() => toggleFeatures(plan.key)}>
              {showMore ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              <span>{showMore ? "Show Less" : `Show ${plan.features.additional.length} More Features`}</span>
            </button>
          )}
        </div>

        <div className='perfect-for'>
          <h5>Perfect for:</h5>
          <ul>
            {plan.perfectFor.map((item: any, index: any) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <button className={`cta-button ${plan.key}-button`} onClick={() => navigate(-1)} style={{ background: plan.gradient }}>
          {plan.buttonText}
        </button>
      </div>
    );
  };

  return (
    <div className='modern-pricing-page'>
      <div className='pricing-header'>
        <h1 className='price-main-title'>Bloomi5 Pricing Plans</h1>
        <p className='pricing-subtitle'>Choose the perfect plan to grow your business online</p>

        <div className='billing-toggle'>
          <div className='toggle-container'>
            <Segmented
              size={"large"}
              options={["Monthly", "Annual"]}
              onChange={(value) => {
                if (value === "Monthly") {
                  setIsAnnual(false);
                } else {
                  setIsAnnual(true);
                }
              }}
            />
            {isAnnual && (
              <span className={isAnnual ? "active" : ""}>
                <Tag color='green' style={{ marginLeft: "10px" }}>
                  Save up to 20%
                </Tag>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='pricing-plans'>
        {allPlans.map((plan: any) => (
          <div key={plan.key} className='plan-column'>
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      <div className='addon-section'>
        <h2 className='section-title'>Add-on Services</h2>
        <p className='section-subtitle'>Available with any plan</p>

        <div className='addon-grid'>
          {addOnServices.map((addon, index) => (
            <div key={index} className='addon-card'>
              <h4>{addon.service}</h4>
              <p className='addon-price'>{addon.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='all-plans-section'>
        <h2 className='section-title'>All Plans Include</h2>
        <div className='include-grid'>
          <div className='include-column'>
            {allPlansInclude.slice(0, 3).map((item, index) => (
              <div key={index} className='include-item'>
                <Check className='check-icon' />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className='include-column'>
            {allPlansInclude.slice(3).map((item, index) => (
              <div key={index} className='include-item'>
                <Check className='check-icon' />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='pricing-footer'>
        <p className='footer-note'>Prices are exclusive of GST. Annual plans offer significant savings compared to monthly billing.</p>
      </div>
    </div>
  );
}
