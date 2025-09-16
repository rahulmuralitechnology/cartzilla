import React, { useEffect, useState } from "react";
import { Steps, Radio, Input, Button, Form, Space, Alert, message, Segmented } from "antd";
import { Globe, AlertCircle } from "lucide-react";
import "./AddCustomDomain.scss";
import createSiteService from "../../services/createSiteService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import storeService, { IStore } from "../../services/storeService";
import { useParams } from "react-router-dom";
import useApiCaller from "../CustomHook/useAPICaller";
import DomainSetupSuccess from "./DomainSuccessView";
import { setSelectedStoreId } from "../../store/reducers/storeSlice";
import DNSTable from "./ViewRecordTable";
import { isValidDomain, setLocalStorage } from "../../services/utils";

const { Step } = Steps;

enum DomainOption {
  EXISTING = "existing",
  NEW = "new",
}

export enum DomainType {
  DOMAIN = "Domain",
  SUBDOMAIN = "Subdomain",
}

const AddCustomDomain: React.FC = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [domainOption, setDomainOption] = useState<DomainOption>(DomainOption.EXISTING);
  const [domainType, setDomainType] = useState<DomainType>(DomainType.DOMAIN);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const [loading, setLoading] = useState(false);
  const [isViewDomain, setIsViewDomain] = useState(false);
  const [domainValidated, setDomainValidated] = useState<boolean>(false);
  const [customeDomain, setCustomDomain] = useState("");
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const [refreh, setRefresh] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleOptionChange = (value: DomainOption) => {
    setDomainOption(value);
    if (value === DomainOption.NEW) {
      window.open("https://bloomi5.com", "_blank");
    }
  };

  const updateStore = async (domain: string) => {
    try {
      const sanitizedDomain = domain?.replace(/^https?:\/\//, ""); // Remove http or https if present
      const response = await storeService.updateStore({
        ...(selectedStore as IStore),
        publishUrl: sanitizedDomain,
        previewUrl: sanitizedDomain,
        domain: sanitizedDomain,
        isCustomDomain: true,
      });

      dispatch(setSelectedStoreId(response.data.store));
    } catch (error: any) {
      console.log("Failed to update store", error);
      message.error(error.message);
    }
  };

  const validateDomain = async (opration: string) => {
    try {
      setLoading(true);
      const res = await createSiteService.createSite({
        domain: customeDomain,
        storeId: selectedStore?.id as string,
        storeCategory: selectedStore?.storeCategory as string,
        operation: opration,
        siteType: selectedStore?.siteType as string,
        uniqueId: selectedStore?.uniqueId,
      });
      await updateStore(customeDomain);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setLoading(false);
    }
  };

  const validateCustomDomain = async () => {
    try {
      setLoading(true);
      const res = await createSiteService.validateCustomDomain(customeDomain, selectedStore?.ipAddress as string);
      setDomainValidated(true);
      message.success("Domain validated successfully");
      setLoading(false);
    } catch (error: any) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const handleDomainSubmit = () => {
    if (!customeDomain) return message.info("Please enter your domain name");
    if (!isValidDomain(customeDomain)) return message.info("Please enter a valid domain name");
    setCurrentStep(2);
  };

  const handleConfirmation = () => {
    if (!domainValidated) {
      validateCustomDomain();
    } else {
      validateDomain("add-domain");
    }
  };

  const getStoreInfo = async (id: string) => {
    try {
      const resultRes = await storeService.getStoreById(id as string);
      if (resultRes.data.store.isCustomDomain) {
        setCustomDomain(resultRes.data.store.domain as string);
        setIsViewDomain(true);
        setInputDisabled(true);
        setUpdateMode(false);
      }
      dispatch(setSelectedStoreId(resultRes.data.store));
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getStoreInfo(selectedStore?.id);
    }

    if (selectedStore?.isCustomDomain) {
      setIsViewDomain(true);
    }
  }, [selectedStore?.id, refreh]);

  const onManageDomainSetting = () => {
    setCurrentStep(2);
    setIsViewDomain(false);
  };

  const onclickUpdateDomain = () => {
    setCurrentStep(1);
    setDomainValidated(false);
    setCustomDomain("");
    setInputDisabled(false);
    setUpdateMode(true);
  };

  const reset = () => {
    setRefresh(!refreh);
    setUpdateMode(false);
  };

  const fromConfigGoback = () => {
    if (!updateMode && selectedStore?.isCustomDomain) {
      setIsViewDomain(true);
    } else {
      setCurrentStep(1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='custom-domain__form'>
            <Segmented
              options={[DomainType.DOMAIN, DomainType.SUBDOMAIN]}
              value={domainType}
              onChange={setDomainType}
              disabled={inputDisabled}
              block
              style={{ marginBottom: 20, height: 35 }}
            />
            <Form form={form} layout='vertical'>
              <Form.Item label='Enter your domain' required className='custom-domain__form-item'>
                <Input
                  placeholder='example.com'
                  disabled={inputDisabled}
                  value={customeDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  suffix={<Globe size={18} />}
                />
              </Form.Item>
              <Space>
                {selectedStore?.isCustomDomain && (
                  <Button
                    type='dashed'
                    onClick={() => {
                      reset();
                    }}>
                    Back
                  </Button>
                )}
                <Button type='primary' onClick={handleDomainSubmit}>
                  Next
                </Button>
              </Space>
            </Form>
          </div>
        );

      case 2:
        return (
          <div className='custom-domain__records'>
            <Alert
              message='DNS Records'
              description='Add these DNS records to your domain registrar'
              type='info'
              showIcon
              icon={<AlertCircle size={16} />}
              style={{ marginBottom: "1rem" }}
            />
            <div className='custom-domain__records-content'>
              <Form layout='vertical'>
                <DNSTable customeDomain={customeDomain} ipAddress={selectedStore?.ipAddress as string} domainType={domainType} />
                <div className='custom-domain__confirmation'>
                  <Space>
                    <Button onClick={fromConfigGoback}>Go back</Button>
                    {!updateMode && selectedStore?.isCustomDomain && <Button onClick={onclickUpdateDomain}>Update domain</Button>}

                    {(!selectedStore?.isCustomDomain || updateMode) && (
                      <Button type='primary' loading={loading} onClick={() => handleConfirmation()}>
                        {domainValidated ? "Add Domain" : "Validate"}
                      </Button>
                    )}
                  </Space>
                </div>
              </Form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {isViewDomain ? (
        <DomainSetupSuccess onManageDomain={onManageDomainSetting} />
      ) : (
        <div className='custom-domain'>
          <h1 className='custom-domain__title'>Custom Domain Setup</h1>
          <Steps current={currentStep} className='custom-domain__steps'>
            <Step title='Enter Domain' />
            <Step title='Configure DNS' />
          </Steps>
          <div className='custom-domain__step'>{renderStep()}</div>
        </div>
      )}
    </>
  );
};

export default AddCustomDomain;
