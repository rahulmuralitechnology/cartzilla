import React, { useState } from "react";
import "../../styles/StoreStepStyle.scss";
import AddStoreConfiguration from "../../component/StepStoreComponent/AddStoreConfiguration/AddStoreConfiguration";
import PublishForm from "../../component/PublishForm/PublishForm";
import { Form } from "antd";
import AddProduct from "../../component/StepStoreComponent/AddProduct/AddProduct";
import AddRestaurantMenu from "../../component/StepStoreComponent/AddRestaurantMenu/AddRestaurantMenu";

const StoreStepCompletion: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [publishForm] = Form.useForm();

  return (
    <div className='website-selection-container' style={{ maxWidth: step === 3 ? "100%" : "1280px", paddingTop: step === 3 ? 0 : 20 }}>
      {step === 0 && <AddStoreConfiguration onNext={(stp) => setStep(stp)} />}
      {step === 1 && <AddProduct onNext={(stp) => setStep(stp)} />}
      {step === 2 && <AddRestaurantMenu onNext={(stp) => setStep(stp)} />}
      {step === 3 && <PublishForm publishForm={publishForm} onNext={(stp) => setStep(stp)} />}
    </div>
  );
};

export default StoreStepCompletion;
