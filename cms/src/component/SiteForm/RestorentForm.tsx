import React from "react";
import { Form, Input, Button, Collapse, Space, Typography, TimePicker, Switch, InputNumber, FormInstance, message, Col, Row } from "antd";
import { PlusOutlined, MinusCircleOutlined, DeleteFilled } from "@ant-design/icons";
import { MenuItem, RestaurantConfig } from "../../services/interfaces/siteConfig";
import siteConfigService from "../../services/siteConfigService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/types/store";
import { onSetRefresh } from "../../store/reducers/storeSlice";
import UploadInput from "../common/UploadInput";
import { ISiteType } from "../../services/interfaces/common";
import { Tabs } from "antd";

const { Panel } = Collapse;
const { TextArea } = Input;
const { Title } = Typography;

const RestaurantConfigForm: React.FC<{ form: FormInstance; loading: boolean; setLoading: (v: boolean) => void }> = ({
  form,
  loading,
  setLoading,
}) => {
  const { selectedStore, refresh } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch();

  const onFinish = async (values: RestaurantConfig) => {
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
        <Tabs
          defaultActiveKey='1'
          destroyInactiveTabPane={false}
          items={[
            {
              label: "Home Page",
              key: "1",
              forceRender: true,
              children: (
                <>
                  {/* Hero Section */}
                  <Row gutter={[32, 16]}>
                    <Col span={12}>
                      <Title level={5}>Hero Section</Title>
                      <Form.Item name={["homepage", "hero", "heading"]} label='Heading' rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["homepage", "hero", "subheading"]} label='Subheading' rules={[{ required: true }]}>
                        <TextArea rows={3} />
                      </Form.Item>
                      <Form.Item name={["homepage", "hero", "backgroundImage"]} label='Background Image' rules={[{ required: true }]}>
                        <UploadInput
                          imageUrl={form.getFieldValue(["homepage", "hero", "backgroundImage"])}
                          onUploadRes={(file) => {
                            form.setFieldValue(
                              ["homepage", "hero", "backgroundImage"],
                              file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {/* About Section */}
                      <Title level={5}>About Section</Title>
                      <Form.Item name={["homepage", "about", "title"]} label='Title' rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["homepage", "about", "description"]} label='Description' rules={[{ required: true }]}>
                        <TextArea rows={3} />
                      </Form.Item>
                      <Form.Item name={["homepage", "about", "image"]} label='Owner Profile' rules={[{ required: true }]}>
                        <UploadInput
                          imageUrl={form.getFieldValue(["homepage", "about", "image"])}
                          onUploadRes={(file) => {
                            form.setFieldValue(
                              ["homepage", "about", "image"],
                              file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.List name={["homepage", "about", "stats"]}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                            <Form.Item {...restField} name={[name, "label"]} rules={[{ required: true }]}>
                              <Input placeholder='Stat Label' />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "value"]} rules={[{ required: true }]}>
                              <Input placeholder='Stat Value' />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}

                        <Form.Item>
                          <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Stat
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </>
              ),
            },
            {
              label: "Gallery",
              key: "2",
              forceRender: true,
              children: (
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
                              <Input placeholder='e.g., Breakfast, Lunch and Dinner' />
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
              ),
            },
            {
              label: "Contact",
              key: "3",
              forceRender: true,
              children: (
                <>
                  <Row gutter={[32, 16]}>
                    <Col span={12}>
                      <Form.Item name={["address", "street"]} label='Street' rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["address", "city"]} label='City' rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["address", "state"]} label='State' rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["address", "zip"]} label='ZIP Code' rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["address", "country"]} label='Country' rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name={["contact", "contactDetails", "email"]} label='Email'>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["contact", "contactDetails", "phone"]} label='Phone'>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["contact", "contactDetails", "whatsapp"]} label='WhatsApp'>
                        <Input />
                      </Form.Item>
                      <Form.Item name={["contact", "mapUrl"]} label='Google Maps Embed URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              label: "Business Hours",
              key: "4",
              forceRender: true,
              children: (
                <>
                  <Form.List name='hours'>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                            <Form.Item {...restField} name={[name, "day"]} rules={[{ required: true }]}>
                              <Input placeholder='Day' />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "open"]} rules={[{ required: true }]}>
                              {/* <TimePicker format='HH:mm' /> */}
                              <Input placeholder='Open' />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "close"]} rules={[{ required: true }]}>
                              {/* <TimePicker format='HH:mm' /> */}
                              <Input placeholder='Close' />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Business Hours
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </>
              ),
            },
            {
              label: "Social Media",
              key: "5",
              forceRender: true,
              children: (
                <>
                  <Row gutter={[32, 16]}>
                    <Col span={24} md={12}>
                      <Form.Item name={["social", "facebook"]} label='Facebook URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                      <Form.Item name={["social", "instagram"]} label='Instagram URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[32, 16]}>
                    <Col span={24} md={12}>
                      <Form.Item name={["social", "X"]} label='X URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                      <Form.Item name={["social", "youtube"]} label='YouTube URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
          ]}
        />
      </Form>
    </div>
  );
};

export default RestaurantConfigForm;
