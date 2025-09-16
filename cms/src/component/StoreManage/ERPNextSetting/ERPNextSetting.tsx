import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Space, message, Divider, Alert, Spin, Modal } from "antd";
import { KeyOutlined, LinkOutlined, SaveOutlined, ReloadOutlined, SafetyCertificateOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import erpNextService, { IERPNextConfiguration } from "../../../services/erpNextService";
import "./ERPNextSetting.scss";

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function ERPNextSetting() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [erpConfig, setErpConfig] = useState<IERPNextConfiguration | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    status: "idle" | "success" | "error" | "testing";
    message: string;
    details?: string;
  }>({ status: "idle", message: "" });
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const handleSave = async (values: IERPNextConfiguration) => {
    // First test the connection
    const connectionValid = await testConnectionBeforeSave(values);
    
    if (!connectionValid) {
      // Show confirmation modal if connection test fails
      confirm({
        title: 'Connection Test Failed',
        icon: <ExclamationCircleOutlined />,
        content: 'The connection test failed. Do you still want to save these settings?',
        okText: 'Yes, Save Anyway',
        okType: 'danger',
        cancelText: 'No, Go Back',
        onOk() {
          // User confirmed to save despite failed connection
          saveConfiguration(values);
        },
        onCancel() {
          message.info('Save cancelled');
        },
      });
    } else {
      // Connection is valid, proceed with save
      saveConfiguration(values);
    }
  };

  const testConnectionBeforeSave = async (values: IERPNextConfiguration): Promise<boolean> => {
    if (!values.apiKey || !values.baseUrl || !values.apiSecret) {
      message.warning("Please fill in all required fields");
      return false;
    }

    setTesting(true);
    setConnectionStatus({ status: "testing", message: "Testing connection before save..." });
    
    try {
      const response = await erpNextService.testConnection(values);
      
      if (response.success && response.valid) {
        setConnectionStatus({ 
          status: "success", 
          message: "Connection successful! Saving configuration...",
          details: response.user ? `Connected as: ${response.user}` : undefined
        });
        return true;
      } else {
        setConnectionStatus({ 
          status: "error", 
          message: response.message || "Connection test failed.",
          details: response.error || "You can still save the configuration, but data sync may not work."
        });
        return false;
      }
    } catch (error: any) {
      setConnectionStatus({ 
        status: "error", 
        message: "Connection test failed",
        details: error.message || "You can still save the configuration, but data sync may not work."
      });
      return false;
    } finally {
      setTesting(false);
    }
  };

  const saveConfiguration = async (values: IERPNextConfiguration) => {
    setLoading(true);
    try {
      const id = erpConfig?.id || "";
      await erpNextService.saveERPConfig({ ...values, storeId: selectedStore?.id, id });
      message.success("Settings saved successfully!");
      
      // Update local state
      setErpConfig({ ...values, id: id || Date.now().toString(), storeId: selectedStore?.id });
    } catch (error) {
      message.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setConnectionStatus({ status: "idle", message: "" });
    message.info("Form reset");
  };

  const handleTestConnection = async () => {
    const values = form.getFieldsValue();
    
    if (!values.apiKey || !values.baseUrl || !values.apiSecret) {
      message.warning("Please fill in all required fields");
      return;
    }

    setTesting(true);
    setConnectionStatus({ status: "testing", message: "Testing connection..." });
    
    try {
      const response = await erpNextService.testConnection(values);
      
      if (response.success && response.valid) {
        setConnectionStatus({ 
          status: "success", 
          message: "Connection successful!",
          details: response.user ? `Connected to ERPNext as: ${response.user}` : undefined
        });
        message.success("Connection test successful!");
      } else {
        setConnectionStatus({ 
          status: "error", 
          message: response.message || "Connection failed",
          details: response.error || "Please check your URL and API credentials."
        });
        message.error("Connection test failed");
      }
    } catch (error: any) {
      setConnectionStatus({ 
        status: "error", 
        message: "Connection test failed",
        details: error.message || "Please check your backend service."
      });
      message.error("Connection test failed");
    } finally {
      setTesting(false);
    }
  };

  const getERPNextConfig = async () => {
    try {
      if (!selectedStore?.id) return;
      
      const response = await erpNextService.getERPConfig(selectedStore.id);
      if (response.success) {
        form.setFieldsValue({
          baseUrl: response.data.baseUrl,
          apiKey: response.data.apiKey,
          apiSecret: response.data.apiSecret,
        });
        setErpConfig(response.data);
      }
    } catch (error) {
      console.log("Error loading ERPNext configuration:", error);
    }
  };

  // Load saved settings on component mount or when selectedStore changes
  useEffect(() => {
    if (selectedStore?.id) {
      getERPNextConfig();
    }
  }, [selectedStore]);

  const onSyncData = async () => {
    try {
      if (!selectedStore?.id) {
        message.warning("Please select a store first");
        return;
      }
      
      // Test connection before syncing
      const values = form.getFieldsValue();
      if (!values.apiKey || !values.baseUrl || !values.apiSecret) {
        message.warning("Please configure ERPNext settings first");
        return;
      }

      setTesting(true);
      message.info("Testing connection before sync...");
      
      const response = await erpNextService.testConnection(values);
      
      if (!response.valid) {
        message.error("Cannot sync data: Connection test failed");
        setTesting(false);
        return;
      }

      // Connection is valid, proceed with sync
      const syncResponse = await erpNextService.erpSyncData({ 
        storeId: selectedStore.id, 
        tables: ["products", "categories", "customers"] 
      });
      
      if (syncResponse.success) {
        message.success("Data synced successfully!");
      } else {
        message.error("Failed to sync data");
      }
    } catch (error) {
      console.log("Failed to sync data", error);
      message.error("Failed to sync data");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className='settings-container'>
      <Card className='settings-card'>
        <div className='settings-header'>
          <Title level={2} className='settings-title'>
            ERPNext Configuration
          </Title>
          <Text type='secondary' className='settings-description'>
            Configure your ERPNext API connection settings
          </Text>
        </div>

        <Divider />

        <Form form={form} layout='vertical' onFinish={handleSave} className='settings-form' size='large'>
          <Form.Item
            label='Base URL'
            name='baseUrl'
            rules={[
              { required: true, message: "Please enter the ERPNext base URL" },
              { 
                type: "url", 
                message: "Please enter a valid URL (include http:// or https://)" 
              },
              {
                validator: (_, value) => {
                  if (value && !value.endsWith('/')) {
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
                message: "URL should not end with a trailing slash",
              },
            ]}
            className='form-item'
          >
            <Input
              prefix={<LinkOutlined className='input-icon' />}
              placeholder='https://your-erpnext-instance.com'
              className='settings-input'
              onChange={() => setConnectionStatus({ status: "idle", message: "" })}
            />
          </Form.Item>

          <Form.Item
            label='API Key'
            name='apiKey'
            rules={[
              { required: true, message: "Please enter your API key" },
              { min: 10, message: "API key must be at least 10 characters" },
            ]}
            className='form-item'
          >
            <Input.Password
              prefix={<KeyOutlined className='input-icon' />}
              placeholder='Enter your ERPNext API key'
              className='settings-input'
              onChange={() => setConnectionStatus({ status: "idle", message: "" })}
            />
          </Form.Item>

          <Form.Item
            label='API Secret'
            name='apiSecret'
            rules={[
              { required: true, message: "Please enter your API secret" },
              { min: 10, message: "API secret must be at least 10 characters" },
            ]}
            className='form-item'
          >
            <Input.Password
              prefix={<KeyOutlined className='input-icon' />}
              placeholder='Enter your ERPNext API secret'
              className='settings-input'
              onChange={() => setConnectionStatus({ status: "idle", message: "" })}
            />
          </Form.Item>

          {/* Connection Status Indicator */}
          {connectionStatus.status !== "idle" && (
            <Form.Item>
              {connectionStatus.status === "testing" ? (
                <Alert
                  message="Testing Connection"
                  description={
                    <Space>
                      <Spin size="small" />
                      {connectionStatus.message}
                    </Space>
                  }
                  type="info"
                  showIcon
                />
              ) : connectionStatus.status === "success" ? (
                <Alert
                  message="Connection Successful"
                  description={
                    <div>
                      <div>{connectionStatus.message}</div>
                      {connectionStatus.details && (
                        <div style={{ marginTop: '8px', fontSize: '12px' }}>
                          {connectionStatus.details}
                        </div>
                      )}
                    </div>
                  }
                  type="success"
                  showIcon
                  icon={<SafetyCertificateOutlined />}
                />
              ) : (
                <Alert
                  message="Connection Failed"
                  description={
                    <div>
                      <div>{connectionStatus.message}</div>
                      {connectionStatus.details && (
                        <div style={{ marginTop: '8px', fontSize: '12px' }}>
                          {connectionStatus.details}
                        </div>
                      )}
                    </div>
                  }
                  type="error"
                  showIcon
                />
              )}
            </Form.Item>
          )}

          <div className='form-actions'>
            <Space size='middle'>
              <Button 
                type='default' 
                onClick={onSyncData} 
                icon={<ReloadOutlined />} 
                disabled={!erpConfig?.apiKey || connectionStatus.status !== "success"} 
                loading={testing}
                className='sync-btn'
              >
                Sync Data
              </Button>
              <Button 
                type='default' 
                icon={<ReloadOutlined />} 
                onClick={handleReset} 
                className='reset-btn'
                disabled={testing || loading}
              >
                Reset
              </Button>

              <Button 
                type='default' 
                onClick={handleTestConnection} 
                loading={testing} 
                className='test-btn'
                disabled={testing || loading}
              >
                Test Connection
              </Button>

              <Button 
                type='primary' 
                htmlType='submit' 
                icon={<SaveOutlined />} 
                loading={loading} 
                className='save-btn'
                disabled={testing}
              >
                Save Settings
              </Button>
            </Space>
          </div>
        </Form>

        <Divider />

        <div className='settings-info'>
          <Title level={4}>How to get your API Key:</Title>
          <ol className='info-list'>
            <li>Log in to your ERPNext instance</li>
            <li>Go to Settings {">"} Integrations {">"} API Access</li>
            <li>Generate a new API key and secret</li>
            <li>Copy and paste them in the fields above</li>
            <li>Make sure the user associated with the API key has the necessary permissions</li>
          </ol>
          
          <Title level={4} style={{ marginTop: 20 }}>Connection Testing:</Title>
          <Text>
            Your connection will be automatically tested before saving. If the test fails, 
            you can choose to save the configuration anyway, but data synchronization may not work.
          </Text>
          
          <Title level={4} style={{ marginTop: 20 }}>CORS Information:</Title>
          <Text type="secondary">
            Note: Connection testing is done through your backend server to avoid CORS issues 
            when connecting to ERPNext instances that don't have CORS headers configured.
          </Text>
        </div>
      </Card>
    </div>
  );
}
