import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import form, { FormInstance } from "antd/es/form";
import UploadInput from "../../common/UploadInput";

const Gallery: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);
  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "website_interiors_template") {
    return (
      <>
        <Form.List name={["gallery", "categories"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label='Category Name'
                    rules={[{ required: true, message: "Please input category name!" }]}>
                    <Input placeholder='e.g., Living Room, Kitchen, etc.' />
                  </Form.Item>

                  <Form.Item label='Images'>
                    <Form.List name={[name, "images"]}>
                      {(imageFields, { add: addImage, remove: removeImage }) => (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: "16px",
                          }}>
                          {imageFields.map(({ key: imageKey, name: imageName, ...restImageField }) => (
                            <div
                              key={imageKey}
                              style={{
                                border: "1px dashed #d9d9d9",
                                padding: "16px",
                                borderRadius: "8px",
                              }}>
                              <Form.Item
                                {...restImageField}
                                name={[imageName, "url"]}
                                rules={[{ required: true, message: "Please upload an image!" }]}>
                                <UploadInput
                                  imageUrl={form.getFieldValue(["gallery", "categories", name, "images", imageName, "url"])}
                                  onUploadRes={(file) => {
                                    form.setFieldValue(
                                      ["gallery", "categories", name, "images", imageName, "url"],
                                      file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                                    );
                                  }}
                                />
                              </Form.Item>
                              <Form.Item {...restImageField} name={[imageName, "caption"]}>
                                <Input placeholder='Image Caption' />
                              </Form.Item>
                              <Form.Item {...restImageField} name={[imageName, "alt"]}>
                                <Input placeholder='Alt Text' />
                              </Form.Item>
                              <Button type='text' danger icon={<DeleteFilled />} onClick={() => removeImage(imageName)} block>
                                Remove Image
                              </Button>
                            </div>
                          ))}
                          <Button type='dashed' onClick={() => addImage()} style={{ height: "100%", minHeight: "200px" }}>
                            <PlusOutlined />
                            <span>Add Image</span>
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>

                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Category
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Gallery Category
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
        <Form.List name={["gallery", "categories"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label='Category Name'
                    rules={[{ required: true, message: "Please input category name!" }]}>
                    <Input placeholder='e.g., Living Room, Kitchen, etc.' />
                  </Form.Item>

                  <Form.Item label='Images'>
                    <Form.List name={[name, "images"]}>
                      {(imageFields, { add: addImage, remove: removeImage }) => (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: "16px",
                          }}>
                          {imageFields.map(({ key: imageKey, name: imageName, ...restImageField }) => (
                            <div
                              key={imageKey}
                              style={{
                                border: "1px dashed #d9d9d9",
                                padding: "16px",
                                borderRadius: "8px",
                              }}>
                              <Form.Item
                                {...restImageField}
                                name={[imageName, "url"]}
                                rules={[{ required: true, message: "Please upload an image!" }]}>
                                <UploadInput
                                  imageUrl={form.getFieldValue(["gallery", "categories", name, "images", imageName, "url"])}
                                  onUploadRes={(file) => {
                                    form.setFieldValue(
                                      ["gallery", "categories", name, "images", imageName, "url"],
                                      file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                                    );
                                  }}
                                />
                              </Form.Item>
                              <Form.Item {...restImageField} name={[imageName, "caption"]}>
                                <Input placeholder='Image Caption' />
                              </Form.Item>
                              <Form.Item {...restImageField} name={[imageName, "alt"]}>
                                <Input placeholder='Alt Text' />
                              </Form.Item>
                              <Button type='text' danger icon={<DeleteFilled />} onClick={() => removeImage(imageName)} block>
                                Remove Image
                              </Button>
                            </div>
                          ))}
                          <Button type='dashed' onClick={() => addImage()} style={{ height: "100%", minHeight: "200px" }}>
                            <PlusOutlined />
                            <span>Add Image</span>
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>

                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Category
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Gallery Category
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    );
  } else {
    <></>;
  }
};

export default Gallery;
