import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import { FormInstance } from "antd/es/form";
import UploadInput from "../../common/UploadInput";

interface ReasonSectionProps {
  form: FormInstance<any>;
}

const ReasonsForm: FC<ReasonSectionProps> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.List name="reasons">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "title"]} label='Reason Title' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "icon"]} label='Reason Icon' rules={[{ required: true }]}>
                    <UploadInput
                      imageUrl={form.getFieldValue(["reasons", name, "icon"])}
                      onUploadRes={(file) => {
                        form.setFieldValue(
                          ["reasons", name, "icon"],
                          file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                        );
                      }}
                    />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Reason
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Reason
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

export default ReasonsForm;