import React, { useEffect } from "react";
import { Form, Input, Button, Select, Modal, Switch, Row, Col, message } from "antd";
import { TemplateType } from "../../services/interfaces/common";
import templateService from "../../services/templateService";
import UploadInput from "../common/UploadInput";
import { Template } from "../../services/interfaces/template";

const { Option } = Select;

const TemplateForm: React.FC<{
  onRefresh: () => void;
  isOpen: boolean;
  onCloseModal: () => void;
  initialValues?: Template | null;
}> = ({ onRefresh, isOpen, onCloseModal, initialValues }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (initialValues) {
        const result = await templateService.updateTemplate({ ...values, id: initialValues.id });
        message.success(result.message);
      } else {
        const result = await templateService.createTemplate(values);
        message.success(result.message);
      }
      setLoading(false);
      onRefresh();
      form.resetFields();
      onCloseModal();
    } catch (error: any) {
      setLoading(false);
      console.error("Validation failed:", error);
      if (error?.errorFields?.length) {
        message.error("Fields are missing");
      } else {
        message.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  return (
    <Modal destroyOnClose centered width={600} title='Create Theme' open={isOpen} footer={null} onCancel={onCloseModal}>
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name='name' label='Theme Name' rules={[{ required: true, message: "Please enter the template name" }]}>
              <Input placeholder='Enter template name' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='repoDirName'
              label='Repository Directory Name'
              rules={[{ required: true, message: "Please enter the repository directory name" }]}>
              <Input placeholder='Enter repository directory name' />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name='templateType' label='Template Type' rules={[{ required: true, message: "Please select a template type" }]}>
          <Select placeholder='Select template type'>
            <Option value={TemplateType.webapp}>Webapp</Option>
            <Option value={TemplateType.website}>Website</Option>
          </Select>
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name='latestVersion' label='Latest Version' rules={[{ required: true, message: "Please enter the latest version" }]}>
              <Input placeholder='Enter latest version' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='currentVersion' label='Current Version'>
              <Input placeholder='Enter current version' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name='previewUrl' label='Preview  URL'>
          <Input placeholder='Enter preview image URL' />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Form.Item name='previewImage' label='Preview Image'>
              <UploadInput
                imageUrl={initialValues?.previewImage ? initialValues?.previewImage : ""}
                onUploadRes={(file) => {
                  form.setFieldValue("previewImage", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='isActive' label='Active' valuePropName='checked'>
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Button loading={loading} type='primary' htmlType='submit' block>
          {initialValues ? "Update Theme" : "Create Theme"}
        </Button>
      </Form>
    </Modal>
  );
};

export default TemplateForm;
