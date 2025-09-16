import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import form, { FormInstance } from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
import UploadInput from "../../common/UploadInput";

const Testimonial: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "website_interiors_template") {
    return (
      <>
        <Form.List name={["testimonials", "testimonials"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "content"]} label='Content' rules={[{ required: true }]}>
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "author"]} label='Author Name' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "role"]} label='Role'>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "image"]} label='Author Profile' required>
                    <UploadInput
                      imageUrl={form.getFieldValue(["testimonials", "testimonials", name, "image"])}
                      onUploadRes={(file) => {
                        form.setFieldValue(
                          ["testimonials", "testimonials", name, "image"],
                          file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                        );
                      }}
                    />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Testimonial
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Testimonial
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    );
  } else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.List name={["testimonials", "testimonials"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "content"]} label='Content' rules={[{ required: true }]}>
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "author"]} label='Author Name' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "role"]} label='Role'>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "image"]} label='Author Profile' required>
                    <UploadInput
                      imageUrl={form.getFieldValue(["testimonials", "testimonials", name, "image"])}
                      onUploadRes={(file) => {
                        form.setFieldValue(
                          ["testimonials", "testimonials", name, "image"],
                          file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                        );
                      }}
                    />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Testimonial
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Testimonial
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

export default Testimonial;
