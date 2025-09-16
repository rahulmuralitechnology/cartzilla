import { useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Button, Card, Typography, Space, message, Spin, Row, Col } from "antd";
import { SaveOutlined, ClearOutlined, ReloadOutlined } from "@ant-design/icons";
import "./SectionBuilder.scss"; // Assuming you have a CSS file for styles
import sectionBuilderService from "../../services/sectionBuilderSection";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface FormSchema {
  title?: string;
  description?: string;
  type: string;
  properties: Record<string, any>;
  required?: string[];
}

interface DynamicFormRendererProps {
  schema: FormSchema;
  onClear: () => void;
}

export default function SectionBuilder({ schema, onClear }: DynamicFormRendererProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { selectedStore } = useSelector((root: RootState) => root.store);

  const renderFormField = (fieldName: string, fieldSchema: any) => {
    const { type, title, description, enum: enumValues, minimum, maximum, pattern, format } = fieldSchema;
    const isRequired = schema.required?.includes(fieldName);

    const commonProps = {
      placeholder: description || `Enter ${title || fieldName}`,
    };

    const rules = [];
    if (isRequired) {
      rules.push({ required: true, message: `${title || fieldName} is required` });
    }
    if (minimum !== undefined) {
      rules.push({ min: minimum, message: `Minimum value is ${minimum}` });
    }
    if (maximum !== undefined) {
      rules.push({ max: maximum, message: `Maximum value is ${maximum}` });
    }
    if (pattern) {
      rules.push({ pattern: new RegExp(pattern), message: `Invalid format for ${title || fieldName}` });
    }

    switch (type) {
      case "string":
        if (enumValues) {
          return (
            <Form.Item key={fieldName} name={fieldName} label={title || fieldName} rules={rules} tooltip={description}>
              <Select {...commonProps}>
                {enumValues.map((value: string) => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }

        if (format === "textarea" || (fieldSchema.maxLength && fieldSchema.maxLength > 100)) {
          return (
            <Form.Item key={fieldName} name={fieldName} label={title || fieldName} rules={rules} tooltip={description}>
              <TextArea {...commonProps} rows={4} maxLength={fieldSchema.maxLength} showCount={!!fieldSchema.maxLength} />
            </Form.Item>
          );
        }

        return (
          <Form.Item key={fieldName} name={fieldName} label={title || fieldName} rules={rules} tooltip={description}>
            <Input {...commonProps} maxLength={fieldSchema.maxLength} />
          </Form.Item>
        );

      case "number":
      case "integer":
        return (
          <Form.Item key={fieldName} name={fieldName} label={title || fieldName} rules={rules} tooltip={description}>
            <InputNumber
              {...commonProps}
              min={minimum}
              max={maximum}
              precision={type === "integer" ? 0 : undefined}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );

      case "boolean":
        return (
          <Form.Item key={fieldName} name={fieldName} label={title || fieldName} valuePropName='checked' tooltip={description}>
            <Switch />
          </Form.Item>
        );

      case "array":
        if (fieldSchema.items?.enum) {
          return (
            <Form.Item key={fieldName} name={fieldName} label={title || fieldName} rules={rules} tooltip={description}>
              <Select mode='multiple' {...commonProps}>
                {fieldSchema.items.enum.map((value: string) => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }
        break;

      default:
        return (
          <Form.Item key={fieldName} name={fieldName} label={title || fieldName} rules={rules} tooltip={description}>
            <Input {...commonProps} />
          </Form.Item>
        );
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await sectionBuilderService.createSection({
        schema,
        formData: values,
        storeId: String(selectedStore?.id),
        status: "published",
        name: schema.title || "New Section",
      });
      message.success("Form data saved successfully!");
      setFormData(values);
    } catch (error) {
      message.error(`Error saving form: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFormData({});
    message.info("Form reset successfully");
  };

  return (
    <Card
      title={
        <Space>
          <Title level={3} style={{ margin: 0 }}>
            {schema.title || "Generated Form"}
          </Title>
        </Space>
      }
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
          <Button type='default' icon={<ClearOutlined />} onClick={onClear}>
            Clear Schema
          </Button>
        </Space>
      }
      className='form-card'>
      {schema.description && (
        <div className='form-description'>
          <Text type='secondary'>{schema.description}</Text>
        </div>
      )}

      <Spin spinning={loading}>
        <Form form={form} layout='vertical' onFinish={handleSubmit} className='dynamic-form' size='large'>
          <Row gutter={[16, 0]}>
            {Object.entries(schema.properties).map(([fieldName, fieldSchema]) => (
              <Col
                key={fieldName}
                xs={24}
                sm={24}
                md={fieldSchema.type === "string" && fieldSchema.format === "textarea" ? 24 : 12}
                lg={fieldSchema.type === "string" && fieldSchema.format === "textarea" ? 24 : 12}>
                {renderFormField(fieldName, fieldSchema)}
              </Col>
            ))}
          </Row>

          <div className='form-actions'>
            <Space size='middle'>
              <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={loading} size='large'>
                Save Form Data
              </Button>
              <Button htmlType='button' onClick={handleReset} icon={<ReloadOutlined />} size='large'>
                Reset Form
              </Button>
            </Space>
          </div>
        </Form>
      </Spin>

      {Object.keys(formData).length > 0 && (
        <Card title='Last Saved Data' size='small' className='saved-data-preview' style={{ marginTop: 24 }}>
          <pre className='json-preview'>{JSON.stringify(formData, null, 2)}</pre>
        </Card>
      )}
    </Card>
  );
}
