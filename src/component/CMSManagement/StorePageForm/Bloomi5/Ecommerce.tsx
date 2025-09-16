import React, { FC } from "react";
import { Button, Card, Col, Form, FormInstance, Input, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const Ecommerce: FC<{ form: FormInstance }> = ({ form }) => {
  return (
    <>
      <Row gutter={[16, 16]}>
        {/* Hero Badge Section */}
        <Col span={24}>
          <Form.Item name={["ecommerce", "hero", "badge", "text"]} label='Badge Text' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Hero Title Section */}
        <Col span={12}>
          <Form.Item name={["ecommerce", "hero", "title", "highlight"]} label='Title Highlight' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["ecommerce", "hero", "title", "subtitle"]} label='Title Subtitle' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Hero Description */}
        <Col span={24}>
          <Form.Item name={["ecommerce", "hero", "description"]} label='Description' rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Col>

        {/* CTA Section */}
        <Col span={12}>
          <Form.Item name={["ecommerce", "hero", "cta", "text"]} label='CTA Text' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["ecommerce", "hero", "cta", "url"]} label='CTA URL' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Stats Section */}
        <Col span={24}>
          <Form.List name={["ecommerce", "hero", "stats"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                    <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true }]}>
                      <Input placeholder='Value' />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "label"]} rules={[{ required: true }]}>
                      <Input placeholder='Label' />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Stat
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>

        {/* Features Section */}
        <Col span={24}>
          <Card title='Features'>
            <Form.Item name={["ecommerce", "features", "title"]} label='Features Title' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.List name={["ecommerce", "features", "items"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, "title"]} rules={[{ required: true }]}>
                        <Input placeholder='Feature Title' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "description"]} rules={[{ required: true }]}>
                        <Input placeholder='Feature Description' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Feature
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
            <Form.Item name={["ecommerce", "results", "title"]} label='Results Title' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={["ecommerce", "results", "subtitle"]} label='Results Subtitle' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.List name={["ecommerce", "results", "items"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, "metric"]} rules={[{ required: true }]}>
                        <Input placeholder='Metric' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true }]}>
                        <Input placeholder='Value' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "description"]} rules={[{ required: true }]}>
                        <Input placeholder='Description' />
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
          </Card>
        </Col>

        {/* Launch Process Section */}
        <Col span={24}>
          <Card title='Launch Process'>
            <Form.Item name={["ecommerce", "launchProcess", "title"]} label='Launch Process Title' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.List name={["ecommerce", "launchProcess", "steps"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, "step"]} rules={[{ required: true }]}>
                        <Input placeholder='Step Number' type='number' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "title"]} rules={[{ required: true }]}>
                        <Input placeholder='Step Title' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "description"]} rules={[{ required: true }]}>
                        <Input placeholder='Step Description' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Step
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* SEO Content Section */}
        <Col span={24}>
          <Card title='SEO Content'>
            <Form.Item name={["ecommerce", "seoContent", "title"]} label='SEO Title' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.List name={["ecommerce", "seoContent", "paragraphs"]}>
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

export default Ecommerce;
