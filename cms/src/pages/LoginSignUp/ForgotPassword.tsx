import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import UserService from "../../services/userService";

const { Title } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token") as string;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await UserService.forgotPassword({ token: token, newPassword: values.password });
      if (response.success) {
        message.success("Password reset successfully! You can now sign in with your new password.");
        form.resetFields();
        navigate("/account/sign-in");
      } else {
        message.error(response.message || "Failed to reset password");
      }
    } catch (error: any) {
      message.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ maxWidth: "100%", paddingTop: "120px" }}>
      <Card style={{ width: "600px", margin: "0 auto", boxShadow: "none" }} bordered={false}>
        <Title level={3}>Reset Password</Title>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item name='password' label='New Password' rules={[{ required: true, message: "Please enter your new password" }]}>
            <Input.Password placeholder='Enter new password' />
          </Form.Item>
          <Form.Item
            name='confirmPassword'
            label='Confirm Password'
            rules={[{ required: true, message: "Please confirm your new password" }]}>
            <Input.Password placeholder='Confirm new password' />
          </Form.Item>
          <Button type='primary' htmlType='submit' loading={loading} block>
            Reset Password
          </Button>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <a href='/account/sign-in'>Back to Sign In</a>
          </div>
        </Form>
      </Card>
    </section>
  );
};

export default ForgotPasswordPage;
