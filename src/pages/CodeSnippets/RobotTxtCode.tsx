import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  Switch,
  Form,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Alert,
  Modal,
  Table,
  Tag,
  Tooltip,
  message,
  Popconfirm,
  Flex,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../../styles/RobotTxt.scss";
import appService, { RobotsTxt } from "../../services/appService";
import moment from "moment";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface RobotsTxtManagerProps {
  storeId?: string;
}

const RobotsTxtManager: React.FC<RobotsTxtManagerProps> = ({ storeId }) => {
  const [form] = Form.useForm();
  const [robotsData, setRobotsData] = useState<RobotsTxt[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RobotsTxt | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  // Default robots.txt templates
  const templates = {
    permissive: `User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`,

    restrictive: `User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Allow: /api/public/

User-agent: Googlebot
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`,

    ecommerce: `User-agent: *
Allow: /
Disallow: /checkout/
Disallow: /cart/
Disallow: /account/
Disallow: /admin/
Disallow: /search?*
Disallow: /*?sort=*
Disallow: /*?filter=*

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Crawl-delay: 1

Sitemap: https://yourdomain.com/sitemap.xml
Sitemap: https://yourdomain.com/products-sitemap.xml`,
  };

  console.log("storeId", storeId);

  useEffect(() => {
    fetchRobotsData();
  }, [storeId]);

  const fetchRobotsData = async () => {
    setLoading(true);
    try {
      const data = await appService.getRobotTxtContent(String(storeId));
      setRobotsData(data.data);

      console.log("data", data);

      if (!data?.data) {
        applyTemplate("ecommerce");
      }
    } catch (error) {
      message.error("Failed to fetch robots.txt data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        storeId,
        id: editingRecord?.id,
      };

      await appService.saveRobotTxtContent(data);
      message.success(`Robots.txt ${editingRecord ? "updated" : "created"} successfully`);
      setIsModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
      fetchRobotsData();
    } catch (error) {
      message.error("Failed to save robots.txt");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //   const handleDelete = async (id: string) => {
  //     if (!onDelete) return;

  //     setLoading(true);
  //     try {
  //       await onDelete(id);
  //       message.success("Robots.txt deleted successfully");
  //       fetchRobotsData();
  //     } catch (error) {
  //       message.error("Failed to delete robots.txt");
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleEdit = (record: RobotsTxt) => {
    setEditingRecord(record);
    form.setFieldsValue({
      content: record.content,
      isActive: record.isActive,
    });
    setIsModalVisible(true);
  };

  const handlePreview = (content: string) => {
    setPreviewContent(content);
    setIsPreviewModalVisible(true);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success("Content copied to clipboard");
  };

  const handleDownload = (content: string, filename: string = "robots.txt") => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const applyTemplate = (templateKey: keyof typeof templates) => {
    form.setFieldsValue({ content: templates[templateKey] });
  };

  const validateRobotsContent = (content: string) => {
    const lines = content.split("\n");
    const warnings = [];

    let hasUserAgent = false;
    let hasSitemap = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().startsWith("user-agent:")) {
        hasUserAgent = true;
      }
      if (trimmedLine.toLowerCase().startsWith("sitemap:")) {
        hasSitemap = true;
      }
    }

    if (!hasUserAgent) warnings.push("Missing User-agent directive");
    if (!hasSitemap) warnings.push("Consider adding Sitemap directive");

    return warnings;
  };

  const columns = [
    {
      title: "Type",
      dataIndex: ["store", "name"],
      key: "storeName",
      render: (name: string, record: RobotsTxt) => (
        <div>
          <Text strong>{name || (record.id && typeof record.id === "string" ? "RobotTXT-" + record.id.split("-")[0] : "RobotTXT")}</Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"} icon={isActive ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    // {
    //   title: "Content Preview",
    //   dataIndex: "content",
    //   key: "content",
    //   render: (content: string) => (
    //     <div className='robots-content-preview'>
    //       <Text code className='robots-preview-text'>
    //         {content.length > 100 ? `${content.substring(0, 100)}...` : content}
    //       </Text>
    //     </div>
    //   ),
    // },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => (date ? moment(date).format("YYYY-MM-DD HH:mm a") : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: RobotsTxt) => (
        <Space>
          <Tooltip title='Preview'>
            <Button
              type='text'
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record.content)}
              className='robots-action-btn robots-preview-btn'
            />
          </Tooltip>
          <Tooltip title='Edit'>
            <Button type='text' icon={<EditOutlined />} onClick={() => handleEdit(record)} className='robots-action-btn robots-edit-btn' />
          </Tooltip>
          <Tooltip title='Copy'>
            <Button
              type='text'
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record.content)}
              className='robots-action-btn robots-copy-btn'
            />
          </Tooltip>
          <Tooltip title='Download'>
            <Button
              type='text'
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.content, `robots-${record.store?.domain || record.id}.txt`)}
              className='robots-action-btn robots-download-btn'
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className='robots-txt-manager'>
      <Card className='robots-header-card'>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={3} className='robots-title'>
              Robots.txt Manager
            </Title>
            <Paragraph type='secondary'>Manage robots.txt files for your stores to control web crawler access</Paragraph>
          </Col>

          <Col>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
              className='robots-add-btn'>
              Create Robots.txt
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className='robots-content-card'>
        <Table
          columns={columns}
          dataSource={robotsData?.length ? robotsData : []}
          rowKey='id'
          loading={loading}
          pagination={false}
          className='robots-table'
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? "Edit Robots.txt" : "Create Robots.txt"}
        open={isModalVisible}
        centered
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        className='robots-modal'>
        <Form form={form} layout='vertical' onFinish={handleSave} initialValues={{ isActive: true }}>
          <Alert
            message='Robots.txt Best Practices'
            description='Use User-agent, Allow, and Disallow directives. Include your sitemap URL. Test your robots.txt before deploying.'
            type='info'
            showIcon
            className='robots-info-alert'
          />

          <Divider />

          <Form.Item
            name='content'
            label='Robots.txt Content'
            rules={[
              { required: true, message: "Please enter robots.txt content" },
              {
                validator: (_, value) => {
                  if (value) {
                    const warnings = validateRobotsContent(value);
                    if (warnings.length > 0) {
                      return Promise.reject(new Error(`Warnings: ${warnings.join(", ")}`));
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            <TextArea rows={12} placeholder='Enter your robots.txt content here...' className='robots-textarea' />
          </Form.Item>
          <Flex justify='space-between' align='end'>
            <Form.Item name='isActive' label='Status' valuePropName='checked'>
              <Switch checkedChildren='Active' unCheckedChildren='Inactive' className='robots-status-switch' />
            </Form.Item>

            <Form.Item className='robots-modal-actions'>
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                <Button type='primary' htmlType='submit' loading={loading} className='robots-save-btn'>
                  {editingRecord ? "Update" : "Create"} Robots.txt
                </Button>
              </Space>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title='Robots.txt Preview'
        open={isPreviewModalVisible}
        onCancel={() => setIsPreviewModalVisible(false)}
        footer={[
          <Button key='copy' icon={<CopyOutlined />} onClick={() => handleCopy(previewContent)}>
            Copy
          </Button>,
          <Button key='download' icon={<DownloadOutlined />} onClick={() => handleDownload(previewContent)}>
            Download
          </Button>,
          <Button key='close' type='primary' onClick={() => setIsPreviewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
        className='robots-preview-modal'>
        <div className='robots-preview-content'>
          <pre>{previewContent}</pre>
        </div>
      </Modal>
    </div>
  );
};

export default RobotsTxtManager;
