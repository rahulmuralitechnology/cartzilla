import React, { useState } from "react";
import { Form, Input, Upload, Button, Row, Col, Space, message, List, Typography } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleFilled } from "@ant-design/icons";
import "./AddStoreDetail.scss";
import UploadInput from "../../common/UploadInput";
import storeService from "../../../services/storeService";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../../store";
import subscriptionService from "../../../services/subscriptionService";
import { onSetRefresh, setSelectedStoreId } from "../../../store/reducers/storeSlice";
import { setLocalStorage } from "../../../services/utils";
import CongratulationsModal from "../../common/StarterCongratulation";
import { Link, useNavigate, useParams } from "react-router-dom";
import appConstant from "../../../services/appConstant";
import { Modal } from "antd";
import SubscriptionCard from "../../Pricing/PricingSelectedCard";
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

const AddStoreDetail: React.FC<{ onNext: (stp: number) => void }> = ({ onNext }) => {
  const [form] = Form.useForm();
  const [subdomain, setSubdomain] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.user);
  const { selectedPlanId } = useSelector((state: RootState) => state.store);
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
  const { storeId } = useParams() as { storeId: string };

  const handleApplyCoupon = async () => {
    try {
      await onApplyCouponCode();
      message.success("Coupon applied successfully");
      setCouponModalVisible(false);
    } catch (error: any) {
      message.error("Failed to apply coupon");
    }
  };

  const activateStater = async (userId: string, storeId: string, planId: string) => {
    try {
      const res = await subscriptionService.activatePlan({
        userId: userId,
        storeId: storeId,
        planId: planId,
        price: 0,
      });
    } catch (error: any) {
      throw Error(error?.message);
    }
  };

  const onApplyCouponCode = async () => {
    try {
      await form.validateFields();
      setCouponModalVisible(true);
    } catch (error: any) {
      if (error?.errorFields?.length) {
        message.info("Field are missing");
      } else {
        message.error(error.message);
      }
    }
  };

  const onCreateStore = async () => {
    try {
      await form.validateFields();
      // if (!couponCode) return message.info("Please enter coupon code");
      setCreateLoading(true);
      const response = await storeService.createStore(
        {
          ...form.getFieldsValue(),
          storeCategory: selectedTemplate,
          siteType: selectedSiteType,
          userId: user?.id as string,
        },
        couponCode
      );

      setCouponModalVisible(false);

      if (response?.data?.store?.id) {
        navigate(`/store/payment/${response.data.store.id}`);
      } else {
        await activateStater(user?.id, response?.data?.store?.id as string, selectedPlanId); //starter planId
        const createdStore = await storeService.getStoreById(response?.data?.store?.id as string);
        setLocalStorage(appConstant.SELECTED_STORE_ID, response?.data?.store?.id as string);
        dispatch(setSelectedStoreId(createdStore?.data?.store));
        setModalVisible(true);
        setTimeout(() => {
          if (createdStore?.data?.store?.storeCategory === "landing-page-bloomi5") {
            navigate(`/store/${storeId}/cms/page/homepage`);
          } else {
            navigate(`/store/configuration/${response?.data?.store?.id}`);
          }
        }, 2000);
      }
      setCreateLoading(false);
      setCouponCode("");
      setSubdomain("");

      message.success("Store created successfully");
    } catch (error: any) {
      setCreateLoading(false);
      console.log("Failed to add store", error);
      if (error?.errorFields?.length) {
        message.info("Field are missing");
      } else {
        message.error(error.message);
      }
    }
  };

  return (
    <div className='store-details-container'>
      <div className='store-details-content'>
        <div className='form-section'>
          <h1>
            Add <span className='highlight'>{selectedSiteType === "webapp" ? "Store" : "Site"}</span> Details
          </h1>
          <p className='subtitle'>Add basic brand details and get started</p>

          <Form form={form} layout='vertical' className='store-form'>
            <Form.Item name='name' label='Store Name' rules={[{ required: true, message: "Please enter store name" }]}>
              <Input placeholder='Fill text goes here' />
            </Form.Item>

            <Form.Item name='description' label='Store Description' rules={[{ required: true, message: "Please enter store description" }]}>
              <Input.TextArea placeholder='Message text goes here' rows={4} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name='logo' label='Store Logo' rules={[{ required: true, message: "Required store logo" }]}>
                  <UploadInput
                    imageUrl={form?.getFieldValue("logo") ?? ""}
                    onUploadRes={(file) => {
                      form.setFieldValue("logo", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='favicon' label='Store Icon'>
                  <UploadInput
                    imageUrl={form?.getFieldValue("favicon") ?? ""}
                    onUploadRes={(file) => {
                      form.setFieldValue("favicon", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* <Form.Item className='form-actions'>
              <Button type='primary' htmlType='submit' className='custom-btn-gradient'>
                Next →
              </Button>
            </Form.Item> */}
          </Form>
        </div>
        <div className='illustration-section'>
          <img src='/assets/store-detail.png' alt='Brand Setup Illustration' className='brand-illustration' />
        </div>
      </div>
      <div className='button-group'>
        <Space size='middle'>
          <Button type='default' onClick={() => onNext(1)} className='back-btn'>
            <ArrowLeftOutlined /> Back
          </Button>
          <Button type='primary' onClick={onCreateStore} loading={createLoading} className='custom-btn-gradient next-btn'>
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
          <Button key='apply' loading={createLoading} type='primary' onClick={onCreateStore}>
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

export default AddStoreDetail;
