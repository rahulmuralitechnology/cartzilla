import React, { useEffect, useState } from "react";
import { Checkbox, Card, Space, Typography, Button, Form, Input, Upload, message } from "antd";
import { CreditCard, Wallet, Building2, Upload as UploadIcon } from "lucide-react";
import type { UploadProps } from "antd";
import "./PaymentMethod.scss";
import UploadInput from "../common/UploadInput";
import storeService from "../../services/storeService";
import { useParams } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface PaymentConfig {
  id?: string;
  paymentMethods: string[];
  storeId?: string;
  upi?: {
    upiId: string;
    qrCode: string;
    merchantName: string;
  };
  pickup?: {
    instructions: string;
  };
  razorpay?: {
    merchantId: string;
  };
  cash?: {
    instructions: string;
    deliveryNote: string;
  };
}

export const PaymentMethod: React.FC = () => {
  const [selectedPayments, setSelectedPayments] = useState<string[]>(["cash"]);
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const [form] = Form.useForm();

  const handlePaymentChange = (checkedValues: string[]) => {
    setSelectedPayments(checkedValues);
  };

  const getSavedPaymentInfo = async (id: string) => {
    try {
      const result = await storeService.getPymentMethodInfo(id);
      setSelectedPayments(result.paymentMethods.paymentMethods);
      form.setFieldValue("paymentMethods", result.paymentMethods.paymentMethods);
      form.setFieldValue("cash", result.paymentMethods.cash);
      form.setFieldValue("upi", result.paymentMethods.upi);
      form.setFieldValue("cash", result.paymentMethods.cash);
      form.setFieldValue("pickup", result.paymentMethods.pickup);
      form.setFieldValue("razorpay", result.paymentMethods.razorpay);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const onFinish = async (values: PaymentConfig) => {
    try {
      const result = await storeService.savePaymentMethod({ ...values, storeId: selectedStore?.id });
      message.success("Payment configuration updated successfully");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getSavedPaymentInfo(selectedStore?.id);
    }
  }, [selectedStore?.id]);

  const renderUPIConfig = () => (
    <div className='method-config-section'>
      <Title level={4}>UPI Payment Configuration</Title>
      <Form.Item label='UPI ID' name={["upi", "upiId"]} rules={[{ required: true, message: "Please enter your UPI ID" }]}>
        <Input placeholder='yourname@bankname' />
      </Form.Item>

      <Form.Item label='Merchant Name' name={["upi", "merchantName"]} rules={[{ required: true, message: "Please enter merchant name" }]}>
        <Input placeholder='Business/Merchant Name' />
      </Form.Item>

      <Form.Item label='QR Code' name={["upi", "qrCode"]} rules={[{ required: true, message: "Please upload QR code" }]}>
        <UploadInput
          imageUrl={form.getFieldValue(["upi", "qrCode"])}
          onUploadRes={(file) => {
            form.setFieldValue(["upi", "qrCode"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
          }}
        />
      </Form.Item>
    </div>
  );

  const renderRazorPayConfig = () => (
    <div className='method-config-section'>
      <Title level={4}>Razorpay Configuration</Title>
      <Form.Item label='Key Id' name={["razorpay", "keyId"]} rules={[{ required: true, message: "Please enter Razorpay Key Id" }]}>
        <Input.Password placeholder='Key Id' />
      </Form.Item>
      <Form.Item
        label='Key Secret'
        name={["razorpay", "keySecret"]}
        rules={[{ required: true, message: "Please enter Razorpay Key Secret" }]}>
        <Input.Password placeholder='Key Secret' />
      </Form.Item>
    </div>
  );

  const renderCashConfig = () => (
    <div className='method-config-section'>
      <Title level={4}>Cash on Delivery Configuration</Title>
      <Form.Item
        label='Delivery Instructions'
        name={["cash", "instructions"]}
        rules={[{ required: true, message: "Please enter delivery instructions" }]}>
        <TextArea rows={4} placeholder='Enter specific instructions for cash on delivery orders...' />
      </Form.Item>

      <Form.Item
        label='Delivery Note'
        name={["cash", "deliveryNote"]}
        rules={[{ required: true, message: "Please enter a delivery note" }]}>
        <TextArea rows={2} placeholder='Additional notes for delivery personnel...' />
      </Form.Item>
    </div>
  );
  const renderPickUpConfig = () => (
    <div className='method-config-section'>
      <Title level={4}>Pickup Configuration</Title>
      <Form.Item
        label='Pickup Instructions'
        name={["pickup", "instructions"]}
        rules={[{ required: true, message: "Please enter pickup instructions" }]}>
        <TextArea rows={4} placeholder='Enter specific instructions for pikcup  orders...' />
      </Form.Item>
    </div>
  );

  return (
    <div className='payment-method-container'>
      <Card className='payment-card' bordered={false}>
        <Title level={3}>Payment Method Configuration</Title>
        <Text className='text-gray-600 block mb-6'>
          Configure multiple payment methods for your store. Select the payment methods you want to enable and enter their details.
        </Text>

        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            paymentMethods: selectedPayments,
          }}>
          <Form.Item name='paymentMethods' className='payment-options'>
            <Checkbox.Group onChange={(values) => handlePaymentChange(values as string[])} value={selectedPayments}>
              <Space className='w-full' style={{ width: "100%" }}>
                <Checkbox value='cash' className='payment-option'>
                  <Space>
                    <Wallet className='payment-icon' />
                    <span>Cash on Delivery</span>
                  </Space>
                </Checkbox>
                <Checkbox value='upi' className='payment-option'>
                  <Space>
                    <img
                      src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/200px-UPI-Logo-vector.svg.png'
                      alt='UPI'
                      className='payment-icon-img'
                    />
                    <span>UPI Payment</span>
                  </Space>
                </Checkbox>
                <Checkbox value='pickup' className='payment-option'>
                  <Space>
                    <EnvironmentOutlined className='payment-icon' />
                    <span>Pickup</span>
                  </Space>
                </Checkbox>
                <Checkbox value='razorpay' className='payment-option'>
                  <Space>
                    <CreditCard className='payment-icon' />
                    <span>Razorpay</span>
                  </Space>
                </Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <div className='configuration-form'>
            {selectedPayments?.includes("cash") && renderCashConfig()}
            {selectedPayments?.includes("upi") && renderUPIConfig()}
            {selectedPayments?.includes("pickup") && renderPickUpConfig()}
            {selectedPayments?.includes("razorpay") && renderRazorPayConfig()}
          </div>

          <Form.Item>
            <Button type='primary' htmlType='submit' size='large' className='mt-6'>
              Save Configuration
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
