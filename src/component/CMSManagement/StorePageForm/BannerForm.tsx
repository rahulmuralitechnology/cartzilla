import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FormInstance, Form, Switch, Card, Row, Col, Select, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC } from "react";

const BannerForm: FC<{ form: FormInstance }> = ({ form }) => {
  return (
    <section className='site_banner_form'>
      <>
        <Form.Item name={["banner", "enabled"]} initialValue={false} label='Enable Banner' valuePropName='checked'>
          <Switch />
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.banner?.enabled !== currentValues.banner?.enabled}>
          {({ getFieldValue }) =>
            getFieldValue(["banner", "enabled"]) && (
              <>
                <Form.List name={["banner", "banners"]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card key={key} className='mb-4'>
                          <MinusCircleOutlined className='float-right' onClick={() => remove(name)} />
                          <Row gutter={[16, 16]}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "text"]}
                                label='Banner Text'
                                rules={[{ required: true }, { max: 150, message: "Maximum 150 characters allowed" }]}>
                                <TextArea showCount maxLength={150} placeholder='Enter promotional text' />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "page"]}
                                label='Page'
                                rules={[{ required: true, message: "Please select a page" }]}>
                                <Select placeholder='Select a page'>
                                  <Select.Option value='home'>Home</Select.Option>
                                  <Select.Option value='products'>Products</Select.Option>
                                  <Select.Option value='order'>Order</Select.Option>
                                  <Select.Option value='checkout'>Checkout</Select.Option>
                                  <Select.Option value='all'>All</Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      ))}
                      <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Banner
                      </Button>
                    </>
                  )}
                </Form.List>
              </>
            )
          }
        </Form.Item>
      </>
    </section>
  );
};

export default BannerForm;
