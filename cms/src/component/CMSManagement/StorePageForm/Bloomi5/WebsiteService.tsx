import { FC } from "react";
import { Button, Card, Col, Form, FormInstance, Input, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const WebsiteService: FC<{ form: FormInstance }> = ({ form }) => {
  return (
    <>
      <Row gutter={[16, 16]}>
        {/* Hero Badge Section */}
        <Col span={24}>
          <Form.Item name={["websiteServices", "hero", "badge", "text"]} label='Badge Text' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Hero Title Section */}
        <Col span={12}>
          <Form.Item name={["websiteServices", "hero", "title", "highlight"]} label='Title Highlight' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["websiteServices", "hero", "title", "subtitle"]} label='Title Subtitle' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Hero Description */}
        <Col span={24}>
          <Form.Item name={["websiteServices", "hero", "description"]} label='Description' rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Col>

        {/* CTA Section */}
        <Col span={12}>
          <Form.Item name={["websiteServices", "hero", "cta", "text"]} label='CTA Text' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["websiteServices", "hero", "cta", "url"]} label='CTA URL' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Stats Section */}
        <Col span={24}>
          <Form.List name={["websiteServices", "hero", "stats"]}>
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
            <Form.Item name={["websiteServices", "features", "title"]} label='Features Title' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.List name={["websiteServices", "features", "items"]}>
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
            <Form.Item name={["websiteServices", "results", "title"]} label='Results Title' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={["websiteServices", "results", "subtitle"]} label='Results Subtitle' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.List name={["websiteServices", "results", "items"]}>
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

        {/* Additional Content Section */}
        <Col span={24}>
          <Card title='Additional Content'>
            <Form.Item name={["websiteServices", "additionalContent", "title"]} label='Content Title' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.List name={["websiteServices", "additionalContent", "paragraphs"]}>
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

export default WebsiteService;
