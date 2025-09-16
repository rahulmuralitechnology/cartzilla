import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { FormInstance, Tabs, Row, Col, Form, Input, Space, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC } from "react";
import { useSelector } from "react-redux";
import UploadInput from "../../common/UploadInput";
import { RootState } from "../../../store";

const AboutUsForm: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "webapp" && selectedStore?.storeCategory === "ecom_cosmetics_template") {
    return (
      <section className='site_about_form'>
        <Tabs
          defaultActiveKey='section1'
          items={[
            {
              label: "Section 1",
              key: "section1",
              forceRender: true,
              children: (
                <>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section1", "title"]}
                        label='Title'
                        rules={[{ required: true, message: "Please enter title" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section1", "subtitle"]}
                        label='Subtitle'
                        rules={[{ required: false, message: "Please enter subtitle" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section1", "description"]}
                        label='Description'
                        rules={[{ required: true, message: "Please enter description" }]}>
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section1", "additionalText"]}
                        label='Additional Text'
                        rules={[{ required: false, message: "Please enter additional text" }]}>
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section1", "backgroundImage"]}
                        label='Background Image'
                        rules={[{ required: true, message: "Please upload background image" }]}>
                        <UploadInput
                          imageUrl={form.getFieldValue(["about", "section1", "backgroundImage"])}
                          onUploadRes={(file) => {
                            form.setFieldValue(
                              ["about", "section1", "backgroundImage"],
                              file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section1", "ctaText"]}
                        label='CTA Text'
                        rules={[{ required: false, message: "Please enter CTA text" }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={["about", "section1", "ctaLink"]}
                        label='CTA Link'
                        rules={[{ required: false, message: "Please enter CTA link" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },

            {
              label: "section 2",
              key: "section2",
              forceRender: true,
              children: (
                <>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section2", "title"]}
                        label='Title'
                        rules={[{ required: true, message: "Please enter title" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section2", "subtitle"]}
                        label='Subtitle'
                        rules={[{ required: false, message: "Please enter subtitle" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section2", "description"]}
                        label='Description'
                        rules={[{ required: true, message: "Please enter description" }]}>
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section2", "additionalText"]}
                        label='Additional Text'
                        rules={[{ required: false, message: "Please enter additional text" }]}>
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section2", "backgroundImage"]}
                        label='Background Image'
                        rules={[{ required: true, message: "Please upload background image" }]}>
                        <UploadInput
                          imageUrl={form.getFieldValue(["about", "section2", "backgroundImage"])}
                          onUploadRes={(file) => {
                            form.setFieldValue(
                              ["about", "section2", "backgroundImage"],
                              file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["about", "section2", "ctaText"]}
                        label='CTA Text'
                        rules={[{ required: false, message: "Please enter CTA text" }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={["about", "section2", "ctaLink"]}
                        label='CTA Link'
                        rules={[{ required: false, message: "Please enter CTA link" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
          ]}
        />
      </section>
    );
  } else if (selectedStore?.siteType === "website" && selectedStore?.storeCategory === "website_restaurant_template") {
    return (
      <Col span={12}>
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
      </Col>
    );
  } else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "website_interiors_template") {
    return (
      <>
        <Form.Item name={["about", "title"]} label='Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["about", "mainDescription"]} label='Main Description'>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name={["about", "image"]} label='Upload Image'>
          <UploadInput
            imageUrl={form.getFieldValue(["about", "image"])}
            onUploadRes={(file) => {
              form.setFieldValue(["about", "image"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
            }}
          />
        </Form.Item>
      </>
    );
  }
  // AboutUsForm.tsx - Update the pet store section
  else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        {/* <Form.Item name={["about", "title"]} label='Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["about", "mainDescription"]} label='Main Description'>
          <TextArea rows={4} />
        </Form.Item> */}

        {/* About Founder Section */}
        <Form.Item name={["aboutFounder", "title"]} label='Founder Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["aboutFounder", "subtitle"]} label='Founder Subtitle'>
          <Input />
        </Form.Item>
        <Form.Item name={["aboutFounder", "description1"]} label='Founder Description 1'>
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name={["aboutFounder", "description2"]} label='Founder Description 2'>
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name={["aboutFounder", "founderImage"]} label='Founder Image'>
          <UploadInput
            imageUrl={form.getFieldValue(["aboutFounder", "founderImage"])}
            onUploadRes={(file) => {
              form.setFieldValue(
                ["aboutFounder", "founderImage"],
                file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
              );
            }}
          />
        </Form.Item>

        {/* Mission and Vision */}
        <Form.Item name={["mission", "title"]} label='Mission Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["mission", "description"]} label='Mission Description'>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name={["mission", "highlight"]} label='Mission Highlight'>
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item name={["vision", "title"]} label='Vision Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["vision", "description"]} label='Vision Description'>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name={["vision", "highlight"]} label='Vision Highlight'>
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item name={["about", "image"]} label='About Image'>
          <UploadInput
            imageUrl={form.getFieldValue(["about", "image"])}
            onUploadRes={(file) => {
              form.setFieldValue(["about", "image"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
            }}
          />
        </Form.Item>
      </>
    );
  } else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "landing-page-bloomi5") {
    return (
      <>
        <Form.Item name={["about", "badge"]} label='Badge'>
          <Input placeholder='Badge' />
        </Form.Item>
        <Form.Item name={["about", "title"]} label='Title'>
          <Input placeholder='Title' />
        </Form.Item>
        <Form.Item name={["about", "titleHighlight"]} label='Title Highlight'>
          <Input placeholder='Title Highlight' />
        </Form.Item>
        <Form.Item name={["about", "description"]} label='Description'>
          <TextArea rows={4} placeholder='Description' />
        </Form.Item>
        <Form.Item name={["about", "image"]} label='Image'>
          <UploadInput
            imageUrl={form.getFieldValue(["about", "image"])}
            onUploadRes={(file) => {
              form.setFieldValue(["about", "image"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
            }}
          />
        </Form.Item>
        <Form.Item name={["about", "imageAlt"]} label='Image Alt Text'>
          <Input placeholder='Image Alt Text' />
        </Form.Item>
        <Form.List name={["about", "features"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                  <Form.Item {...restField} name={[name, "title"]} rules={[{ required: true, message: "Please enter feature title" }]}>
                    <Input placeholder='Feature Title' />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    rules={[{ required: true, message: "Please enter feature description" }]}>
                    <TextArea rows={2} placeholder='Feature Description' />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Feature
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    );
  } else {
    return (
      <section className='site_about_form'>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name={["about", "title"]} label='Title' rules={[{ required: true, message: "Please enter title" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={["about", "subtitle"]} label='Subtitle' rules={[{ required: false, message: "Please enter subtitle" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </section>
    );
  }
};

export default AboutUsForm;
