import React, { useEffect, useState } from "react";
import { Form, Button, Space, Tag, message } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "./AddStoreConfiguration.scss";
import storeService, { IStore } from "../../../services/storeService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import SiteConfig from "../../../pages/SiteConfig/SiteConfig";
import { setSelectedStoreId } from "../../../store/reducers/storeSlice";
import { useNavigate, useParams } from "react-router-dom";
import { isUserSubscribed } from "../../../services/subscriptionValidation";
import { getAppType } from "../../../services/utils";
import { ISiteType } from "../../../services/restaurantService";

const AddStoreConfiguration: React.FC<{ onNext?: (stp: number) => void }> = ({ onNext = () => {} }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { storeId } = useParams() as { storeId: string };

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const params = useParams() as { storeId: string };
  const { selectedSiteType, selectedTemplate, selectedStore } = useSelector((state: RootState) => state.store);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const getStoreInfo = async (id: string) => {
    try {
      const storeInfo = await storeService.getStoreById(id as string);
      // if (!isUserSubscribed(storeInfo.data.store)) { //TODO: Remove this condition
      //   return navigate(`/pricing/${storeInfo.data.store.id}`);
      // }
      dispatch(setSelectedStoreId(storeInfo.data.store));
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.storeId) {
      getStoreInfo(params.storeId);
    }
  }, [params.storeId]);

  const onSaveStoreConfig = async () => {
    try {
      const validateField = await form.validateFields();
      form.submit();
      if (selectedStore?.siteType === "webapp") {
        onNext(1);
      } else {
        if (selectedStore?.storeCategory === "website_restaurant_template") {
          onNext(2);
        } else {
          onNext(3);
        }
      }
    } catch (error) {
      console.log("Validation Failed:", error);
      return message.error("Please fill in the required fields.");
    }
  };

  return (
    <div className='store-details-container'>
      <div className='store-details-content'>
        <div className='form-section'>
          <h1>
            Configure Your <span className='highlight'>{getAppType(selectedStore?.siteType as ISiteType)}</span>{" "}
            <Tag color='blue'>{selectedStore?.name.toUpperCase()}</Tag>
          </h1>
          <p className='subtitle'>Add basic store configuration</p>

          <SiteConfig form={form} loading={createLoading} setLoading={setCreateLoading} />
        </div>
        <div className='illustration-section'>
          <img src='/assets/configure-store.png' alt='Brand Setup Illustration' className='brand-illustration' />
          <div className='button-group'>
            <Space size='middle'>
              {/* <Button type='default' className='back-btn' onClick={() => navigate(`/store/${storeId}`)}>
                <ArrowLeftOutlined /> Back
              </Button> */}
              <Button type='primary' onClick={onSaveStoreConfig} loading={createLoading} className='custom-btn-gradient next-btn'>
                Next <ArrowRightOutlined />
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStoreConfiguration;
