import React, { FC, useState } from "react";
import { Card, Select, Segmented, Button, Badge, Divider, Space, Tag } from "antd";
import "./PricingSelectedCard.scss";
import subscriptionService from "../../services/subscriptionService";
import { PlanIcon } from "./Pricingv2/Pricing2";
import { useDispatch } from "react-redux";
import { setSelectedPlanId } from "../../store/reducers/storeSlice";

const SubscriptionCard: FC<{
  allPlans: any[];
  currentPlan: any;
  onChangeCurrentPlan: (v: any) => void;
  planPrice: number;
  isAnnual: string;
  setIsAnnual: any;
}> = ({ allPlans, currentPlan, onChangeCurrentPlan, planPrice, isAnnual, setIsAnnual }) => {
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState<any>("starter");

  const [loading, setLoading] = useState(false);

  const onChangePlan = (value: any) => {
    const plan = allPlans.find((p: any) => p.key === value);
    dispatch(setSelectedPlanId(plan.id));
    setSelectedPlan(value);
    onChangeCurrentPlan(plan);
  };

  if (currentPlan === null) return null;

  return (
    <div className='subscription-container'>
      <Card className='subscription-card' loading={loading}>
        <div className='card-header'>
          <h2>Choose Your Plan</h2>
          <div className='selection-toggle'>
            <Button type={isAnnual === "month" ? "primary" : "default"} size='small' onClick={() => setIsAnnual("month")}>
              Monthly
            </Button>
            <Button type={isAnnual === "annualy" ? "primary" : "default"} size='small' onClick={() => setIsAnnual("annualy")}>
              Annual
            </Button>
          </div>
        </div>
        <div className='plan-selector'>
          <Segmented
            value={selectedPlan}
            onChange={onChangePlan}
            options={allPlans.map((p: any) => ({
              label: p.name,
              value: p.key,
              // icon: p.icon,
            }))}
            size='large'
            block
          />
        </div>

        <div className='plan-card-details'>
          <div className='plan-header'>
            <div className='plan-card-icon'>{PlanIcon[currentPlan?.key]}</div>
            <div className='plan-info'>
              <Space align='center' style={{ justifyContent: "flex-start" }}>
                <h3 className='plan-name'>{currentPlan.name}</h3>
                <span>
                  {currentPlan.popular && <Badge count='Most Popular' style={{ backgroundColor: "#ff4d4f", marginLeft: "8px" }} />}
                </span>
                {currentPlan.freeTrial && (
                  <Badge count={`${currentPlan.freeTrial} free trial`} style={{ backgroundColor: "#52c41a", marginTop: 4 }} />
                )}
              </Space>
              <div className='plan-pricing'>
                <span className='amount'>
                  {planPrice}
                  {/* {isAnnual === "annualy"
                    ? Math.round(currentPlan.annualPrice / 12).toLocaleString()
                    : currentPlan.monthlyPrice.toLocaleString()} */}
                </span>
                <span className='duration'>
                  /{isAnnual === "month" ? "month" : "Annualy"}
                  {isAnnual === "annualy" && (
                    <Tag color='green' style={{ marginLeft: "10px" }}>
                      save ₹{currentPlan.savings.toLocaleString()}
                    </Tag>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionCard;
