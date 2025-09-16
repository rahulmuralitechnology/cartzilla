import React, { useState } from "react";
import "../../styles/StoreStepStyle.scss";
import SelectWebsite from "./SelectWebsite";
import SelectTemplate from "./SelectTemplate";
import AddStoreDetail from "./AddStoreDetail/AddStoreDetail";
import AddProduct from "../StepStoreComponent/AddProduct/AddProduct";

const GetStarted: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  return (
    <div className='website-selection-container' style={{ maxWidth: "1280px", paddingTop: 20 }}>
      {step === 0 && <SelectWebsite onNext={(stp) => setStep(stp)} />}
      {step === 1 && <SelectTemplate onNext={(stp) => setStep(stp)} />}
      {step === 2 && <AddStoreDetail onNext={(stp) => setStep(stp)} />}
    </div>
  );
};

export default GetStarted;
