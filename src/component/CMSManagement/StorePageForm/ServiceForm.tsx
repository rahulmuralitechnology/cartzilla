import { FormInstance, Row, Col, Form, Input, Button, Flex, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import UploadInput from "../../common/UploadInput";

const ServiceForm: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "website_interiors_template") {
    return (
      <>
        <Form.List name={["services", "servicesList"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "icon"]} label='Icon'>
                    <UploadInput
                      imageUrl={form.getFieldValue(["services", "servicesList", name, "icon"])}
                      onUploadRes={(file) => {
                        form.setFieldValue(
                          ["services", "servicesList", name, "icon"],
                          file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "title"]} label='Service Title' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "description"]} label='Description'>
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.List name={[name, "features"]}>
                    {(featureFields, { add: addFeature, remove: removeFeature }) => (
                      <>
                        {featureFields.map(({ key: featureKey, name: featureName, ...restFeatureField }) => (
                          <Space key={featureKey} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                            <Form.Item {...restFeatureField} name={featureName} rules={[{ required: true }]}>
                              <Input placeholder='Feature' />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => removeFeature(featureName)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type='dashed' onClick={() => addFeature()} block icon={<PlusOutlined />}>
                            Add Feature
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Service
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Service
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    );
  }
  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.List name={["services", "servicesList"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "icon"]} label='Icon'>
                    <UploadInput
                      imageUrl={form.getFieldValue(["services", "servicesList", name, "icon"])}
                      onUploadRes={(file) => {
                        form.setFieldValue(
                          ["services", "servicesList", name, "icon"],
                          file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "title"]} label='Service Title' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "description"]} label='Description'>
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.List name={[name, "features"]}>
                    {(featureFields, { add: addFeature, remove: removeFeature }) => (
                      <>
                        {featureFields.map(({ key: featureKey, name: featureName, ...restFeatureField }) => (
                          <Space key={featureKey} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                            <Form.Item {...restFeatureField} name={featureName} rules={[{ required: true }]}>
                              <Input placeholder='Feature' />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => removeFeature(featureName)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type='dashed' onClick={() => addFeature()} block icon={<PlusOutlined />}>
                            Add Feature
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Service
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Service
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    );
  } else {
    return <></>;
  }
};

export default ServiceForm;
