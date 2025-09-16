"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, Divider, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import AdminInfo from "./AdminInfo";
import "./InviteAddClientUser.scss";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import userService from "../../services/userService";

const { Title, Text } = Typography;

interface AdminData {
  name: string;
  organization: string;
  email: string;
}

export default function InviteAddClientUser() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token") as string;
  const organizationName = query.get("organizationName") as string;
  const storeName = query.get("storeName") as string;
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // useEffect(() => {
  //   // In a real application, you would fetch admin data using the token/id from the URL

  //   // Simulate API call to get admin data
  //   const fetchAdminData = async () => {
  //     try {
  //       // This is a mock - in a real app, you would fetch from your API
  //       // await fetch(`/api/admin/${adminId}`)
  //       setLoading(false);

  //       // Mock data - in production this would come from your API
  //       setAdminData({
  //         name: "John Doe",
  //         organization: "Acme Corporation",
  //         email: "john.doe@acme.com",
  //       });
  //     } catch (error) {
  //       setLoading(false);
  //       message.error("Failed to load admin information");
  //     }
  //   };

  //   if (token) {
  //     fetchAdminData();
  //   } else {
  //     setLoading(false);
  //     message.warning("No admin reference found in the invitation link");
  //   }
  // }, [searchParams]);

  const onFinish = async (values: any) => {
    try {
      const res = await userService.AddClientUser({ ...values, token: token });
      message.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/account/sign-in");
      }, 2000);
    } catch (error) {
      console.log("Error in registration:", error);
      message.error("Failed to register user. Please try again.");
    }
  };

  return (
    <div className='register-container'>
      <Card className='register-card'>
        <div className='register-header'>
          <Title level={2}>Create Your Account</Title>
          <Text type='secondary'>Complete the form below to register</Text>
        </div>

        {storeName && organizationName && <AdminInfo storeName={storeName} organizationName={organizationName} />}

        <Divider />

        <Form form={form} onFinish={onFinish} layout='vertical' requiredMark={false} className='register-form'>
          <Form.Item name='username' rules={[{ required: true, message: "Please input your full name!" }]}>
            <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Full Name' size='large' />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}>
            <Input.Password prefix={<LockOutlined className='site-form-item-icon' />} placeholder='Password' size='large' />
          </Form.Item>

          <Form.Item
            name='confirmPassword'
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match!"));
                },
              }),
            ]}>
            <Input.Password prefix={<LockOutlined className='site-form-item-icon' />} placeholder='Confirm Password' size='large' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' size='large' block className='register-button'>
              Register
            </Button>
          </Form.Item>

          <div className='login-link'>
            <Text type='secondary'>Already have an account?</Text>
            <Link to='/account/sign-in'>Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
