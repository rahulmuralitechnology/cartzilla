import { PlusOutlined } from "@ant-design/icons";

import { FormInstance, Form, Input, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC } from "react";
import { useSelector } from "react-redux";
import UploadInput from "../../common/UploadInput";
import { RootState } from "../../../store";

const OurWorkForm: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "website_interiors_template") {
    return (
      <>
        <Form.List name={["portfolio", "projects"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "title"]} label='Project Title' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "image"]} label='Upload Image'>
                    <UploadInput
                      imageUrl={form.getFieldValue(["portfolio", "projects", name, "image"])}
                      onUploadRes={(file) => {
                        form.setFieldValue(
                          ["portfolio", "projects", name, "image"],
                          file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "description"]} label='Description'>
                    <TextArea rows={2} />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Project
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Project
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    );
  }
  else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.List name={["portfolio", "projects"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "title"]} label='Project Title' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "image"]} label='Upload Image'>
                    <UploadInput
                      imageUrl={form.getFieldValue(["portfolio", "projects", name, "image"])}
                      onUploadRes={(file) => {
                        form.setFieldValue(
                          ["portfolio", "projects", name, "image"],
                          file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "description"]} label='Description'>
                    <TextArea rows={2} />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Project
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Project
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

export default OurWorkForm;
