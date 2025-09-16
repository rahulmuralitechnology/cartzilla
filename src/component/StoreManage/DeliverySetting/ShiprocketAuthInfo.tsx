import React, { useState } from "react";
import { Button, Input, Form, Typography, Row, Col, message } from "antd";
import storeService from "../../../services/storeService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
const { Title } = Typography;

const ShiprocketAuthInfo: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const result = await storeService.saveShiprocketAuthInfo({ email, password, storeId: selectedStore?.id as string });
      message.success("Payment configuration updated successfully");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <Title level={4}>Shiprocket API Auth Credential</Title>
      <Form layout='vertical' onSubmitCapture={handleSubmit} style={{ marginTop: 40 }}>
        <Row gutter={[16, 16]} align='middle'>
          <Col span={10}>
            <Form.Item label='Email' required>
              <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your Shiprocket email' />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label='Password' required>
              <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your Shiprocket password' />
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

export default ShiprocketAuthInfo;
