import { Modal, Form, Input, Select, Radio, FormInstance, Row, Col, message } from "antd";
import React, { FC, useEffect } from "react";
import { CodeSnippets } from "../../services/interfaces/CodeSnippets";

const AddCodeSnippetsForm: FC<{
  isOpen: boolean;
  loading: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  formInstance: FormInstance;
  selectedScript: CodeSnippets | null;
}> = ({ isOpen, handleCancel, handleOk, formInstance, selectedScript, loading }) => {
  useEffect(() => {
    if (selectedScript) {
      formInstance.setFieldsValue(selectedScript);
    }
  }, [selectedScript]);
  return (
    <Modal
      centered
      destroyOnClose
      title={selectedScript?.name ? "Update Code Snippet" : "Add Code Snippet"}
      okText={selectedScript?.name ? "Update" : "Add"}
      okButtonProps={{ loading: loading }}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form form={formInstance} layout='vertical'>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label='Snippet Name' name='name' rules={[{ required: true, message: "Name is required" }]}>
              <Input placeholder='Enter snippet name' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Provider' name='snippetProvider' rules={[{ required: true, message: "Provider is required" }]}>
              <Select>
                <Select.Option value='google'>Google</Select.Option>
                <Select.Option value='facebook'>Facebook</Select.Option>
                <Select.Option value='Other'>Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Snippet Type' name='snippetType' rules={[{ required: true, message: "Type is required" }]}>
          <Select>
            <Select.Option value='Analytics'>Analytics</Select.Option>
            <Select.Option value='Marketing'>Marketing</Select.Option>
            <Select.Option value='Functionality'>Functionality</Select.Option>
            <Select.Option value='Custom'>Custom</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label='Code' name='content' rules={[{ required: true, message: "Code is required" }]}>
          <Input.TextArea rows={4} placeholder='Enter code snippet' />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={14}>
            <Form.Item label='Placement' name='injectLocation' rules={[{ required: true, message: "Placement is required" }]}>
              <Radio.Group buttonStyle='solid' block>
                <Radio.Button value='header'>Header</Radio.Button>
                <Radio.Button value='body'>Body</Radio.Button>
                <Radio.Button value='footer'>Footer</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label='Status' name='snippetStatus' rules={[{ required: true, message: "Status is required" }]}>
              <Radio.Group buttonStyle='solid' block>
                <Radio.Button value='active'>Active</Radio.Button>
                <Radio.Button value='inactive'>Inactive</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        {/* <Form.Item label='Apply to'>
              <Radio.Group>
                <Radio value='all'>All Pages</Radio>
                <Radio value='specific'>Specific Pages</Radio>
              </Radio.Group>
            </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default AddCodeSnippetsForm;
