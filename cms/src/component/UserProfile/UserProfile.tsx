"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select, Divider, Spin, Checkbox, Row, Col, Switch, Modal } from "antd";
import { UploadOutlined, UserOutlined, SaveOutlined, PhoneOutlined, MailOutlined, TeamOutlined, LockOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import "./UserProfile.scss";
import authService, { IUser, UserRole } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setUserRefresh } from "../../store/reducers/userReducer";
import roleConfig from "../../config/roleConfig";
import userService from "../../services/userService";

// Mock user data - replace with actual data fetching
const mockUser = {
  email: "user@example.com",
  username: "johndoe",
  organizationName: "Acme Inc",
  profileImage: "/placeholder.svg?height=200&width=200",
  phone: "+1234567890",
  role: "USER",
  verified: true,
};

export default function UserProfilePage() {
  const [form] = Form.useForm();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      form.setFieldsValue({
        email: user?.email,
        username: user?.username,
        organizationName: user?.organizationName,
        phone: user?.phone,
        whatsapp: user?.whatsapp,
        whatsappOptIn: user?.whatsappOptIn,
      });

      if (user?.profileImage) {
        setFileList([
          {
            uid: "-1",
            name: "profile-image.png",
            status: "done",
            url: user?.profileImage,
          },
        ]);
      }

      setLoading(false);
    }, 1000);
  }, [form, user]);

  const onFinish = async (values: any) => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      delete values.email;
      const response = await authService.updateClient({ ...values, userId: user.id });
      message.success("Profile successfully");
      setSubmitting(false);
      dispatch(setUserRefresh());
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("An error occurred while updating your profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setResettingPassword(true);
      // Call the API to send reset password email
      const response = await userService.forgotPasswordLink({ email: user.email });
      message.success("Password reset email sent successfully!");
      setResetPasswordModalVisible(false);
    } catch (error) {
      console.error("Error sending reset password email:", error);
      message.error("Failed to send reset password email. Please try again.");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  if (loading) {
    return (
      <div className={"profileLoading"}>
        <Spin size='large' />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={"profileContainer"}>
      <div className={"profileHeader"}>
        <h1>My Profile</h1>
        <p>Update your personal information and account settings</p>
      </div>

      <div className={"profileContent"}>
        <div className={"profileImageSection"}>
          <div className={"profileImageContainer"}>
            {user?.profileImage && <img src={user.profileImage || "/placeholder.svg"} alt='Profile' className={"profileImage"} />}
          </div>
          <Upload
            listType='picture'
            maxCount={1}
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Prevent auto upload
            className={"profileUpload"}>
            <Button icon={<UploadOutlined />}>Change Profile Picture</Button>
          </Upload>
          {user?.verified && (
            <div className={"verificationBadge"}>
              <span>✓ Verified Account</span>
            </div>
          )}
        </div>

        <div className={"profileFormSection"}>
          <Form form={form} layout='vertical' onFinish={onFinish} className={"profileForm"} requiredMark={false}>
            <Form.Item
              name='email'
              label='Email'
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}>
              <Input prefix={<MailOutlined />} disabled={user?.verified} />
            </Form.Item>

            <Form.Item name='username' label='Username' rules={[{ required: false }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item name='organizationName' label='Organization' rules={[{ required: false }]}>
              <Input prefix={<TeamOutlined />} disabled={user?.role === roleConfig.USER} />
            </Form.Item>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name='phone' label='Phone Number' rules={[{ required: false }]}>
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='whatsapp' label='WhatsApp Number' rules={[{ required: false }]}>
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name='whatsappOptIn' label='WhatsApp Opt-In Communication' valuePropName='checked' initialValue={false}>
              <Switch
                checkedChildren='Opt-in'
                unCheckedChildren='Opt-out'
                onChange={(checked) => {
                  if (checked) {
                    form.setFieldValue("whatsapp", form.getFieldValue("phone"));
                  } else {
                    form.setFieldValue("whatsapp", "");
                  }
                }}
              />
            </Form.Item>

            <Divider />

            <Form.Item label='Password'>
              <Button 
                type="default" 
                icon={<LockOutlined />}
                onClick={() => setResetPasswordModalVisible(true)}
              >
                Reset Password
              </Button>
            </Form.Item>

            <Form.Item className={"formActions"}>
              <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={submitting} className={"saveButton"}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <Modal
        title="Reset Password"
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setResetPasswordModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={resettingPassword}
            onClick={handleResetPassword}
          >
            Send Reset Link
          </Button>,
        ]}
      >
        <p>We will send a password reset link to your email address: <strong>{user?.email}</strong></p>
        <p>Check your inbox and follow the instructions to reset your password.</p>
      </Modal>
    </div>
  );
}
