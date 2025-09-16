"use client";

import { useState } from "react";
import { Upload, Card, Typography, Space, Divider } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import SectionBuilder from "../../../component/SectionBuilder/SectionBuilder";

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface FormSchema {
  title?: string;
  description?: string;
  type: string;
  properties: Record<string, any>;
  required?: string[];
}

export default function CustomSection() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [uploadError, setUploadError] = useState<string>("");

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".json",
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target?.result as string);

          if (!jsonContent.type || !jsonContent.properties) {
            throw new Error("Invalid schema: missing required fields (type, properties)");
          }

          setSchema(jsonContent);
          setUploadError("");
        } catch (error) {
          setUploadError(`Error parsing JSON: ${error instanceof Error ? error.message : "Unknown error"}`);
          setSchema(null);
        }
      };
      reader.readAsText(file);
      return false; // Prevent upload
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleClearSchema = () => {
    setSchema(null);
    setUploadError("");
  };

  return (
    <div>
      <div className='header'>
        {/* <Title level={1}>Dynamic Form Generator</Title>
        <Text type='secondary'>Upload a JSON schema to dynamically generate and edit forms</Text> */}
      </div>

      <Space direction='vertical' size='large' style={{ width: "100%" }}>
        <Card title='Upload JSON Schema' className='upload-card' styles={{ body: { padding: "0 20px" } }}>
          <Dragger {...uploadProps} className='schema-uploader'>
            <Space>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <div>
                <p className='ant-upload-text'>Click or drag JSON schema file to this area to upload</p>
                <p className='ant-upload-hint'>
                  Support for single JSON file upload. The schema should define form structure with properties and validation rules.
                </p>
              </div>
            </Space>
          </Dragger>

          {uploadError && (
            <div className='error-message'>
              <Text type='danger'>{uploadError}</Text>
            </div>
          )}
        </Card>

        {schema && (
          <>
            <SectionBuilder schema={schema} onClear={handleClearSchema} />
            <Divider />
          </>
        )}
      </Space>
    </div>
  );
}
