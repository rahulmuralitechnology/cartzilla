import React, { useState } from "react";
import { Button, Input, Form, Typography, Row, Col, message } from "antd";
import storeService, { IShippingInfo } from "../../../services/storeService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import appConstant from "../../../services/appConstant";
const { Title } = Typography;

const ShippingInfo: React.FC = () => {
  const [shippingCost, setShippingCost] = useState(0);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const [shippingInfo, setShippingInfo] = useState<IShippingInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await storeService.saveShippingInfo({ shippingCost, storeId: selectedStore?.id as string, id: shippingInfo?.id });
      message.success("Shipping information updated successfully");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getShippingInfo = async () => {
    try {
      const result = await storeService.getShippingInfo(selectedStore?.id as string);
      setShippingInfo(result.data.shippingInfo);
      if (result.data.shippingInfo) {
        setShippingCost(result.data.shippingInfo.shippingCost);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  React.useEffect(() => {
    if (selectedStore?.id) {
      getShippingInfo();
    }
  }, [selectedStore]);

  return (
    <div style={{ padding: "20px 0" }}>
      <Title level={4}>Shipping Info</Title>
      <Form layout='vertical' onSubmitCapture={handleSubmit} style={{ marginTop: 40 }}>
        <Row gutter={[16, 16]} align='middle'>
          <Col span={10}>
            <Form.Item label='Shipping Cost'>
              <Input
                prefix={appConstant.CURRENY_SYMBOL}
                type='number'
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                placeholder='Enter shipping cost'
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button style={{ marginTop: 28 }} type='primary' htmlType='submit' block>
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ShippingInfo;
