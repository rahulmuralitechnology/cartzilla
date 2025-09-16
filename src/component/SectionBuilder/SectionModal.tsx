import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Space, Typography, Descriptions, Tag, Card, Row, Col, Statistic, Tabs } from "antd";
import { FormOutlined, UserOutlined, CalendarOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Section {
  id: string;
  title: string;
  description?: string;
  schema: any;
  formData: any;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

interface SectionModalProps {
  visible: boolean;
  section: Section | null;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (section: Section) => void;
}

export default function SectionModal({ visible, section, mode, onClose, onSave }: SectionModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (section && visible) {
      form.setFieldsValue({
        title: section.title,
        description: section.description,
        status: section.status,
      });
    }
  }, [section, visible, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (section) {
        const updatedSection: Section = {
          ...section,
          ...values,
          updatedAt: new Date().toISOString(),
        };
        onSave(updatedSection);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Section["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  if (!section) return null;

  return (
    <Modal
      title={
        <Space>
          <FormOutlined />
          {mode === "edit" ? "Edit Section" : "Section Details"}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={
        mode === "edit" ? (
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='primary' loading={loading} onClick={handleSave}>
              Save Changes
            </Button>
          </Space>
        ) : (
          <Button type='primary' onClick={onClose}>
            Close
          </Button>
        )
      }
      className='section-modal'>
      <Tabs defaultActiveKey='details' className='modal-tabs'>
        <TabPane tab='Details' key='details'>
          {mode === "view" ? (
            <div className='section-view'>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card className='info-card'>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label='Title' span={2}>
                        <Title level={4} style={{ margin: 0 }}>
                          {section.title}
                        </Title>
                      </Descriptions.Item>
                      <Descriptions.Item label='Description' span={2}>
                        {section.description || "No description provided"}
                      </Descriptions.Item>
                      <Descriptions.Item label='Status'>
                        <Tag color={getStatusColor(section.status)}>{section.status.toUpperCase()}</Tag>
                      </Descriptions.Item>

                      <Descriptions.Item label='Created'>
                        <Space>
                          <CalendarOutlined />
                          {new Date(section.createdAt).toLocaleString()}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label='Last Updated'>
                        <Space>
                          <EditOutlined />
                          {new Date(section.updatedAt).toLocaleString()}
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            <Form form={form} layout='vertical' className='edit-form'>
              <Form.Item name='title' label='Section Title' rules={[{ required: true, message: "Please enter section title" }]}>
                <Input placeholder='Enter section title' size='large' />
              </Form.Item>

              <Form.Item name='description' label='Description'>
                <TextArea placeholder='Enter section description' rows={3} maxLength={500} showCount />
              </Form.Item>

              <Form.Item name='status' label='Status' rules={[{ required: true, message: "Please select status" }]}>
                <Select placeholder='Select status' size='large'>
                  <Option value='active'>Active</Option>
                  <Option value='draft'>Draft</Option>
                  <Option value='archived'>Archived</Option>
                </Select>
              </Form.Item>
            </Form>
          )}
        </TabPane>

        <TabPane tab='Schema' key='schema'>
          <Card title='JSON Schema' className='schema-card'>
            <pre className='json-preview'>{JSON.stringify(section.schema, null, 2)}</pre>
          </Card>
        </TabPane>

        <TabPane tab='Sample Data' key='data'>
          <Card title='Latest Form Data' className='data-card'>
            {Object.keys(section.formData).length > 0 ? (
              <pre className='json-preview'>{JSON.stringify(section.formData, null, 2)}</pre>
            ) : (
              <div className='no-data'>
                <Text type='secondary'>No form data available</Text>
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </Modal>
  );
}
