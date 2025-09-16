import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, ColorPicker, Space, Typography } from "antd";
import type { Color } from "antd/es/color-picker";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface RequestCustomThemeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const templateCategories = ["E-commerce", "Portfolio", "Blog", "Business", "Landing Page", "Educational"];

const RequestCustomTheme: React.FC<RequestCustomThemeProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [primaryColor, setPrimaryColor] = useState<Color | string>("#1890ff");
  const [secondaryColor, setSecondaryColor] = useState<Color | string>("#52c41a");
  const { user } = useSelector((state: RootState) => state.user);
  const { selectedSiteType } = useSelector((state: RootState) => state.store);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        email: user?.email,
        storeCategory: selectedSiteType,
        // primaryColor: typeof primaryColor === "string" ? primaryColor : primaryColor.toHexString(),
        // secondaryColor: typeof secondaryColor === "string" ? secondaryColor : secondaryColor.toHexString(),
      };
      onSubmit(formData);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={<Title level={3}>Request Custom Theme</Title>}
      open={isOpen}
      onCancel={onClose}
      width={600}
      centered
      footer={[
        <Button key='cancel' onClick={onClose}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit}>
          Submit Request
        </Button>,
      ]}>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          templateCategory: "E-commerce",
        }}>
        {/* <Form.Item
          name='templateCategory'
          label='Template Category'
          rules={[{ required: true, message: "Please select a template category" }]}>
          <Select>
            {templateCategories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label='Brand Colors' required>
          <Space style={{ width: "100%" }} align='start'>
            <div>
              <span style={{ marginRight: "8px" }}>Primary Color:</span>
              <ColorPicker value={primaryColor} onChange={setPrimaryColor} showText />
            </div>
            <div>
              <span style={{ marginRight: "8px" }}>Secondary Color:</span>
              <ColorPicker value={secondaryColor} onChange={setSecondaryColor} showText />
            </div>
          </Space>
        </Form.Item> */}

        <Form.Item name='businessName' label='Business Name' rules={[{ required: true, message: "Please enter your business name" }]}>
          <Input placeholder='Enter your business name' />
        </Form.Item>

        <Form.Item
          name='additionalInfo'
          label='Additional Information'
          rules={[{ required: true, message: "Please provide additional information" }]}>
          <TextArea rows={4} placeholder='Please describe your requirements, preferences, and any specific features you need...' />
        </Form.Item>

        <Form.Item name='references' label='Reference Websites (Optional)'>
          <TextArea rows={2} placeholder='Add links to websites that inspire your desired design...' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestCustomTheme;
