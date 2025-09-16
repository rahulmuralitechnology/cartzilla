import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Form, Input, Upload, Button, Space, Row, Col } from "antd";
import { FormInstance } from "antd/es/form";
import { PlusOutlined, DeleteFilled } from "@ant-design/icons";
import UploadInput from "../../common/UploadInput";

interface ProfileSectionProps {
  form: FormInstance<any>;
}

const ProfileForm: FC<ProfileSectionProps> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        {/* Profile Images Array */}
        <Form.List name={["profile", "images"]}>
          {(fields, { add, remove }) => (
            <>
              <Row gutter={[16, 16]}>
                {fields.map(({ key, name, ...restField }) => (
                  <Col span={8} key={key}>
                    <div style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16, borderRadius: 8 }}>
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{ required: true, message: "Please upload an image!" }]}
                      >
                        <UploadInput
                          imageUrl={form.getFieldValue(["profile", "images", name])}
                          onUploadRes={(file) => {
                            form.setFieldValue(
                              ["profile", "images", name],
                              file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                            );
                          }}
                        />
                      </Form.Item>
                      <Button
                        type="link"
                        danger
                        icon={<DeleteFilled />}
                        onClick={() => remove(name)}
                        block
                      >
                        Remove Image
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16 }}
                >
                  Add Profile Image
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Single Profile Image */}
        <Form.Item name={["profile", "images2"]} label="Secondary Profile Image">
          <UploadInput
            imageUrl={form.getFieldValue(["profile", "images2"])}
            onUploadRes={(file) => {
              form.setFieldValue(
                ["profile", "images2"],
                file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
              );
            }}
          />
        </Form.Item>

        {/* Followers Count */}
        <Form.Item name={["profile", "followers"]} label="Followers Count">
          <Input placeholder="e.g., 33 followers" />
        </Form.Item>

        {/* Posts Count */}
        <Form.Item name={["profile", "posts"]} label="Posts Count">
          <Input placeholder="e.g., 23 posts" />
        </Form.Item>
      </>
    );
  } else {
    return <></>;
  }
};

export default ProfileForm;
