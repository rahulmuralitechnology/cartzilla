import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FormInstance, Form, Switch, Card, Space, Input, Button } from "antd";
import { FC } from "react";
import UploadInput from "../../common/UploadInput";

const AdvertisementForm: FC<{ form: FormInstance }> = ({ form }) => {
  return (
    <>
      <Form.Item name={["slider", "enabled"]} label='Enable Slider' valuePropName='checked'>
        <Switch />
      </Form.Item>

      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.slider?.enabled !== currentValues.slider?.enabled}>
        {({ getFieldValue }) =>
          getFieldValue(["slider", "enabled"]) && (
            <>
              <Form.List name={["slider", "slides"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card key={key} className='mb-4'>
                        <MinusCircleOutlined className='float-right' onClick={() => remove(name)} />
                        <Space direction='vertical' className='w-full'>
                          <Form.Item
                            {...restField}
                            name={[name, "imageUrl"]}
                            label='Upload Image'
                            rules={[{ required: true }, { type: "url" }]}
                            extra='Recommended size: 1920x1080px. Max file size: 2MB'>
                            <UploadInput
                              imageUrl={form.getFieldValue(["slider", "slides", name, "imageUrl"])}
                              onUploadRes={(file) => {
                                form.setFieldValue(
                                  ["slider", "slides", name, "imageUrl"],
                                  file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                                );
                              }}
                            />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, "altText"]} label='Seo Image Title' rules={[{ required: true }]}>
                            <Input placeholder='Descriptive text for accessibility' />
                          </Form.Item>
                        </Space>
                      </Card>
                    ))}
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Slide
                    </Button>
                  </>
                )}
              </Form.List>
            </>
          )
        }
      </Form.Item>
    </>
  );
};

export default AdvertisementForm;
