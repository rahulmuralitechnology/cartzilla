// Create SocialForm.tsx
import { FormInstance, Form, Input, Button, Select } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const SocialForm: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.List name="social">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "platform"]} label='Platform' rules={[{ required: true }]}>
                    <Select placeholder="Select platform">
                      <Select.Option value="Instagram">Instagram</Select.Option>
                      <Select.Option value="Facebook">Facebook</Select.Option>
                      <Select.Option value="X">X (Twitter)</Select.Option>
                      <Select.Option value="YouTube">YouTube</Select.Option>
                      <Select.Option value="LinkedIn">LinkedIn</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "url"]} label='URL' rules={[{ required: true }]}>
                    <Input placeholder="https://..." />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "icon"]} label='Icon Name'>
                    <Input placeholder="Instagram, Facebook, etc." />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Social Link
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Social Link
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

export default SocialForm;