import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Collapse,
  Space,
  Typography,
  InputNumber,
  FormInstance,
  message,
  UploadFile,
  UploadProps,
  Upload,
  Row,
  Col,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, DeleteColumnOutlined, DeleteFilled } from "@ant-design/icons";
import type { LandingSiteConfig } from "../../services/interfaces/SiteForm";
import siteConfigService from "../../services/siteConfigService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { onSetRefresh } from "../../store/reducers/storeSlice";
import appConstant from "../../services/appConstant";
import UploadInput from "../../component/common/UploadInput";
import { ISiteType } from "../interfaces/common";

const { Panel } = Collapse;
const { TextArea } = Input;
const { Title } = Typography;

const FormTwo: React.FC<{ form: FormInstance; loading: boolean; setLoading: (v: boolean) => void }> = ({ form, loading, setLoading }) => {
  const { selectedStore, refresh } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch();

  const onFinish = async (values: LandingSiteConfig) => {
    setLoading(true);
    try {
      const response = await siteConfigService.saveSiteConfig({
        ...values,
        siteType: selectedStore?.siteType as ISiteType,
        storeId: selectedStore?.id,
        userId: selectedStore?.userId,
        subdomain: selectedStore?.domain,
      });
      dispatch(onSetRefresh(!refresh));
      message.success("Configuration saved successfully!");
    } catch (error: any) {
      console.error(error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Collapse defaultActiveKey={["siteInfo"]}>
          {/* Hero Section */}
          <Panel header='Hero Section' key='hero'>
            <Form.Item label='Heading'>
              <Form.Item name={["hero", "heading", "line1"]}>
                <Input placeholder='Line 1' />
              </Form.Item>
              <Form.Item name={["hero", "heading", "line2"]}>
                <Input placeholder='Line 2' />
              </Form.Item>
            </Form.Item>

            <Form.Item name={["hero", "description"]} label='Description'>
              <TextArea rows={4} />
            </Form.Item>

            <Form.List name={["hero", "metrics"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField}>
                        <Input placeholder='Value' />
                      </Form.Item>
                      <Form.Item {...restField}>
                        <Input placeholder='Label' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Metric
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item name={["hero", "backgroundImage"]} label='Background Image'>
              <UploadInput
                imageUrl={form.getFieldValue(["hero", "backgroundImage"])}
                onUploadRes={(file) => {
                  form.setFieldValue(
                    ["hero", "backgroundImage"],
                    file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                  );
                }}
              />
            </Form.Item>
          </Panel>

          {/* Portfolio Section */}
          <Panel header='Our Works' key='portfolio'>
            <Form.Item name={["portfolio", "description"]} label='Description'>
              <TextArea rows={4} />
            </Form.Item>

            <Form.List name={["portfolio", "projects"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                      <Form.Item {...restField} name={[name, "title"]} label='Project Title' rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "category"]} label='Category'>
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
                      <Form.Item label='Stats'>
                        <Form.Item name={[name, "stats", "area"]} label='Area'>
                          <Input />
                        </Form.Item>
                        <Form.Item name={[name, "stats", "duration"]} label='Duration'>
                          <Input />
                        </Form.Item>
                        <Form.Item name={[name, "stats", "year"]} label='Year'>
                          <Input />
                        </Form.Item>
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
          </Panel>

          {/* About Section */}
          <Panel header='About' key='about'>
            <Form.Item name={["about", "title"]} label='Title'>
              <Input />
            </Form.Item>
            <Form.Item name={["about", "mainDescription"]} label='Main Description'>
              <TextArea rows={4} />
            </Form.Item>

            <Form.List name={["about", "achievements"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField}>
                        <Input placeholder='Number' />
                      </Form.Item>
                      <Form.Item {...restField}>
                        <Input placeholder='Label' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Achievement
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.List name={["about", "values"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={name} rules={[{ required: true }]}>
                        <Input placeholder='Value' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Value
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item name={["about", "image"]} label='Upload Image'>
              <UploadInput
                imageUrl={form.getFieldValue(["about", "image"])}
                onUploadRes={(file) => {
                  form.setFieldValue(["about", "image"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>

            <Form.Item label='Vision'>
              <Form.Item name={["about", "vision", "title"]} label='Title'>
                <Input />
              </Form.Item>
              <Form.Item name={["about", "vision", "description1"]} label='Description 1'>
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item name={["about", "vision", "description2"]} label='Description 2'>
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item name={["about", "vision", "ctaButton", "text"]} label='CTA Button Text'>
                <Input />
              </Form.Item>
            </Form.Item>

            {/* <Form.Item label='Process'>
              <Form.Item name={["about", "process", "title"]} label='Title'>
                <Input />
              </Form.Item>
              <Form.List name={["about", "process", "steps"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                        <Form.Item {...restField} name={[name, "title"]} label='Step Title' rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, "description"]} label='Step Description'>
                          <TextArea rows={2} />
                        </Form.Item>
                        <Button type='link' danger onClick={() => remove(name)}>
                          Remove Step
                        </Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Process Step
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item> */}
          </Panel>

          {/* Services Section */}
          <Panel header='Services' key='services'>
            <Form.Item name={["services", "pageTitle"]} label='Page Title'>
              <Input />
            </Form.Item>
            <Form.Item name={["services", "subtitle"]} label='Subtitle'>
              <Input />
            </Form.Item>
            <Form.Item name={["services", "description"]} label='Description'>
              <TextArea rows={4} />
            </Form.Item>

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
          </Panel>

          {/* Contact Section */}
          <Panel header='Contact' key='contact'>
            <Form.Item label='Contact Details'>
              <Form.Item name={["contact", "contactDetails", "address"]} label='Address'>
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item name={["contact", "contactDetails", "email"]} label='Email'>
                <Input />
              </Form.Item>
              <Form.Item name={["contact", "contactDetails", "phone"]} label='Phone'>
                <Input />
              </Form.Item>
              <Form.Item name={["contact", "contactDetails", "whatsapp"]} label='WhatsApp'>
                <Input />
              </Form.Item>
            </Form.Item>

            <Form.Item name={["contact", "mapUrl"]} label='Map URL'>
              <Input />
            </Form.Item>
          </Panel>

          {/* Footer Section */}
          <Panel header='Footer' key='footer'>
            <Form.List name={["footer", "socialLinks"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={[name, "platform"]} rules={[{ required: true }]}>
                        <Input placeholder='Platform (facebook/instagram/linkedin)' />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "url"]} rules={[{ required: true }]}>
                        <Input placeholder='URL' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Social Link
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item name={["footer", "copyright"]} label='Copyright'>
              <Input />
            </Form.Item>
          </Panel>

          {/* Testimonials Section */}
          <Panel header='Testimonials' key='testimonials'>
            <Form.List name={["testimonials", "testimonials"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                      <Form.Item {...restField} name={[name, "content"]} label='Content' rules={[{ required: true }]}>
                        <TextArea rows={3} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "author"]} label='Author' rules={[{ required: true }]}>
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
          </Panel>

          {/* Add this panel alongside your other panels */}
          <Panel header='Gallery' key='gallery'>
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
          </Panel>
        </Collapse>
      </Form>
    </div>
  );
};

export default FormTwo;
