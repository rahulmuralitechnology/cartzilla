import React, { FC } from "react";
import { Button, Card, Col, Form, FormInstance, Input, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const Seo: FC<{ form: FormInstance }> = ({ form }) => {
  return (
    <>
      <Row gutter={[16, 16]}>
        {/* Hero Section */}
        <Col span={12}>
          <Form.Item name={["seo", "hero", "title", "highlight"]} label='Title Highlight' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["seo", "hero", "title", "subtitle"]} label='Title Subtitle' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={["seo", "hero", "description"]} label='Description' rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name={["seo", "hero", "cta", "text"]} label='CTA Text' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["seo", "hero", "cta", "url"]} label='CTA URL' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Differentiators Section */}
        <Col span={24}>
          <Card title='Differentiators'>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item name={["seo", "differentiators", "title", "start"]} label='Title Start' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["seo", "differentiators", "title", "highlight"]} label='Title Highlight' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["seo", "differentiators", "title", "end"]} label='Title End' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.List name={["seo", "differentiators", "items"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, "icon"]} rules={[{ required: true }]}>
                        <Input placeholder='Icon' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "title"]} rules={[{ required: true }]}>
                        <Input placeholder='Title' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "description"]} rules={[{ required: true }]}>
                        <Input placeholder='Description' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Differentiator
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* Services Section */}
        <Col span={24}>
          <Card title='Services'>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name={["seo", "services", "title", "start"]} label='Title Start' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["seo", "services", "title", "highlight"]} label='Title Highlight' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.List name={["seo", "services", "items"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, "icon"]} rules={[{ required: true }]}>
                        <Input placeholder='Icon' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "title"]} rules={[{ required: true }]}>
                        <Input placeholder='Title' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "description"]} rules={[{ required: true }]}>
                        <Input placeholder='Description' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Service
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* Results Section */}
        <Col span={24}>
          <Card title='Results'>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name={["seo", "results", "title", "start"]} label='Title Start' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["seo", "results", "title", "highlight"]} label='Title Highlight' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={["seo", "results", "subtitle"]} label='Subtitle' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.List name={["seo", "results", "items"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, "metric"]} rules={[{ required: true }]}>
                        <Input placeholder='Metric' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "uplift"]} rules={[{ required: true }]}>
                        <Input placeholder='Uplift' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Result
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item name={["seo", "results", "disclaimer"]} label='Disclaimer' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Card>
        </Col>

        {/* Additional Content Section */}
        <Col span={24}>
          <Card title='Additional Content'>
            <Form.Item name={["seo", "additionalContent", "title"]} label='Title' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.List name={["seo", "additionalContent", "paragraphs"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name]} rules={[{ required: true }]}>
                        <TextArea rows={3} placeholder='Paragraph Content' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Paragraph
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Seo;
