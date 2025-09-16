import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Space, Typography, message, Row, Col, Segmented } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import siteConfigService from "../../services/siteConfigService";
import { ScriptItem } from "../../services/interfaces/common";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const { Title } = Typography;
const { TextArea } = Input;

const AddCustomScript: React.FC = () => {
  const [form] = Form.useForm();
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const handleSubmit = async () => {
    try {
      // await form.validateFields();
      setLoading(true);
      console.log("Submitted scripts:", scripts);
      await siteConfigService.saveCustomScript(selectedStore?.id as string, scripts);
      message.success("Scripts saved successfully");
    } catch (error: any) {
      if (error?.errorFields?.length) {
        message.error("Fields are missing");
      } else {
        message.error(error.message);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addScript = () => {
    setScripts([...scripts, { name: "", content: "", injectLocation: "" }]);
  };

  const removeScript = async (index: number) => {
    await handleSubmit();
    const newScripts = scripts.filter((_, i) => i !== index);
    setScripts(newScripts);
  };

  const updateScript = (index: number, field: keyof ScriptItem, value: string) => {
    const newScripts = [...scripts];
    newScripts[index][field] = value;
    setScripts(newScripts);
  };

  const getCustomScripts = async (id: string) => {
    try {
      const scripts = await siteConfigService.getCustomScript(id);
      setScripts(scripts.data.scripts);
    } catch (error: any) {
      console.log(error);
      //   message.error(error.message);
    }
  };

  console.log("Scripts:", scripts);

  useEffect(() => {
    if (selectedStore?.id) {
      getCustomScripts(selectedStore?.id);
    }
  }, [selectedStore?.id]);

  return (
    <Card>
      <Row justify='space-between' align='middle'>
        <Col>
          <Title level={3}>Custom Scripts Manager</Title>
        </Col>
        <Col>
          <Button type='primary' loading={loading} onClick={() => form.submit()}>
            Save All Scripts
          </Button>
        </Col>
      </Row>
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          {scripts?.length > 0 &&
            scripts?.map((script, index) => (
              <Col lg={12} md={24} key={index}>
                <Card
                  key={index}
                  size='small'
                  style={{ marginBottom: 16 }}
                  extra={scripts.length > 1 && <Button type='text' danger icon={<DeleteOutlined />} onClick={() => removeScript(index)} />}>
                  <Form.Item label='Script Name' rules={[{ required: true }]} tooltip='E.g., Google Analytics, Facebook Pixel'>
                    <Input
                      placeholder='Enter script name'
                      value={script.name}
                      onChange={(e) => updateScript(index, "name", e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label='Script Content' rules={[{ required: true }]} tooltip='Paste your script code here'>
                    <TextArea
                      rows={4}
                      placeholder='<script>...</script>'
                      value={script.content}
                      onChange={(e) => updateScript(index, "content", e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label='Inject Script In' rules={[{ required: true }]} tooltip='Choose where to inject this script'>
                    <Segmented
                      options={[
                        { label: "Header", value: "header" },
                        { label: "Body", value: "body" },
                      ]}
                      value={script.injectLocation}
                      onChange={(value) => updateScript(index, "injectLocation", value as string)}
                    />
                  </Form.Item>
                </Card>
              </Col>
            ))}
        </Row>

        <Space direction='vertical' style={{ width: "100%" }}>
          <Button type='dashed' onClick={addScript} block icon={<PlusOutlined />}>
            Add Another Script
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default AddCustomScript;
