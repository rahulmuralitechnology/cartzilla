import React, { FC, useEffect, useState } from "react";

import { Button, Card, Col, Flex, Form, FormInstance, Input, message, Row, Select, Space, Switch, Tabs } from "antd";

import TextArea from "antd/es/input/TextArea";

import { RootState } from "../../../store";

import UploadInput from "../../common/UploadInput";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const HomePageForm: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "webapp") {
    return (
      <section className='site_hero_form'>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item name={["hero", "title"]} label='Title' rules={[{ required: true, message: "Please enter hero title" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name={["hero", "subtitle"]} label='Subtitle' rules={[{ required: true }]}>
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Background Image' name={["hero", "backgroundImage"]} rules={[{ required: true }]}>
              <UploadInput
                imageUrl={form?.getFieldValue(["hero", "backgroundImage"])}
                onUploadRes={(file) => {
                  form.setFieldValue(
                    ["hero", "backgroundImage"],
                    file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </section>
    );
  } else if (selectedStore?.siteType === "website") {
    if (selectedStore?.storeCategory === "website_interiors_template") {
      return (
        <>
          <Form.Item label='Heading' style={{ marginBottom: 0 }}>
            <Form.Item name={["hero", "heading", "line1"]} rules={[{ required: true }]}>
              <Input placeholder='Line 1' />
            </Form.Item>
          </Form.Item>

          <Form.Item name={["hero", "description"]} label='Description' rules={[{ required: true }]}>
            <TextArea rows={2} />
          </Form.Item>

          <Form.List name={["hero", "metrics"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                    <Form.Item {...restField} name={[name, "value"]}>
                      <Input placeholder='Value' />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "label"]}>
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

          <Form.Item
            name={["hero", "backgroundImage"]}
            label='Background Image'
            rules={[{ required: true, message: "Rrequired background image" }]}>
            <UploadInput
              imageUrl={form.getFieldValue(["hero", "backgroundImage"])}
              onUploadRes={(file) => {
                form.setFieldValue(["hero", "backgroundImage"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
              }}
            />
          </Form.Item>
        </>
      );
    } else // In HomePageForm.tsx - Update the pet store section
      if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
        return (
          <>
            <Form.Item name={["hero", "title"]} label='Hero Title'>
              <Input />
            </Form.Item>
            <Form.Item name={["hero", "subtitle"]} label='Hero Subtitle'>
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name={["hero", "description"]} label='Hero Description'>
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name={["hero", "buttonText"]} label='Hero Button Text'>
              <Input />
            </Form.Item>
            <Form.Item name={["hero", "backgroundImage"]} label='Hero Background Image'>
              <UploadInput
                imageUrl={form.getFieldValue(["hero", "backgroundImage"])}
                onUploadRes={(file) => {
                  form.setFieldValue(["hero", "backgroundImage"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>

            {/* Description Section */}
            <Form.Item name={["description", "title"]} label='Description Title'>
              <Input />
            </Form.Item>
            <Form.Item name={["description", "highlightedTitle"]} label='Description Highlighted Title'>
              <Input />
            </Form.Item>
            <Form.Item name={["description", "image"]} label='Description Image'>
              <UploadInput
                imageUrl={form.getFieldValue(["description", "image"])}
                onUploadRes={(file) => {
                  form.setFieldValue(["description", "image"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>


            <Form.List name={["description", "paragraphs"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                      <Form.Item {...restField} name={name} rules={[{ required: false }]}>
                        <TextArea rows={2} placeholder='Paragraph' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Paragraph
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            {/* Thrive Banner */}
            <Form.Item name={["thriveBanner", "text"]} label='Thrive Banner Text'>
              <Input />
            </Form.Item>

            {/* Why Choose Us */}
            <Form.Item name={["whyChooseUs", "title"]} label='Why Choose Us Title'>
              <Input />
            </Form.Item>
            <Form.Item name={["whyChooseUs", "subtitle"]} label='Why Choose Us Subtitle'>
              <Input />
            </Form.Item>
          </>
        );
      } else if (selectedStore?.storeCategory === "website_restaurant_template") {
        <>
          {/* Hero Section */}
          <Row gutter={[32, 16]}>
            <Col span={12}>
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
          </Row>
        </>;
      } else if (selectedStore.storeCategory === "landing-page-bloomi5") {
        return (
          <>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item label='Title'>
                  <Row gutter={[8, 8]}>
                    <Col span={6}>
                      <Form.Item name={["hero", "title", "start"]} rules={[{ required: true }]}>
                        <Input placeholder='Start' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name={["hero", "title", "highlight1"]} rules={[{ required: true }]}>
                        <Input placeholder='Highlight 1' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name={["hero", "title", "middle"]} rules={[{ required: true }]}>
                        <Input placeholder='Middle' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name={["hero", "title", "highlight2"]} rules={[{ required: true }]}>
                        <Input placeholder='Highlight 2' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name={["hero", "title", "preEnd"]} rules={[{ required: true }]}>
                        <Input placeholder='Pre End' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name={["hero", "title", "highlight3"]} rules={[{ required: true }]}>
                        <Input placeholder='Highlight 3' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name={["hero", "title", "end"]} rules={[{ required: true }]}>
                        <Input placeholder='End' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label='Description'>
                  <Row gutter={[8, 8]}>
                    <Col span={8}>
                      <Form.Item name={["hero", "description"]} rules={[{ required: true }]}>
                        <Input placeholder='Description' />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name={["hero", "descriptionHighlight"]} rules={[{ required: true }]}>
                        <Input placeholder='Description Highlight' />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name={["hero", "descriptionEnd"]} rules={[{ required: true }]}>
                        <Input placeholder='Description End' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["hero", "ctaButtons", "primary", "text"]} label='Primary Button Text' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name={["hero", "ctaButtons", "primary", "url"]} label='Primary Button URL' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["hero", "ctaButtons", "secondary", "text"]} label='Secondary Button Text' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name={["hero", "ctaButtons", "secondary", "url"]} label='Secondary Button URL' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["hero", "heroImage"]} label='Hero Image' rules={[{ required: true }]}>
                  <UploadInput
                    imageUrl={form.getFieldValue(["hero", "heroImage"])}
                    onUploadRes={(file) => {
                      form.setFieldValue(["hero", "heroImage"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["hero", "heroImageAlt"]} label='Hero Image Alt Text' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      }
  } else {
    return (
      <>
        <Form.Item label='Heading' style={{ marginBottom: 0 }}>
          <Form.Item name={["hero", "heading", "line1"]} rules={[{ required: true }]}>
            <Input placeholder='Line 1' />
          </Form.Item>
        </Form.Item>

        <Form.Item name={["hero", "description"]} label='Description' rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>

        <Form.List name={["hero", "metrics"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                  <Form.Item {...restField} name={[name, "value"]}>
                    <Input placeholder='Value' />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "label"]}>
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

        <Form.Item
          name={["hero", "backgroundImage"]}
          label='Background Image'
          rules={[{ required: true, message: "Rrequired background image" }]}>
          <UploadInput
            imageUrl={form.getFieldValue(["hero", "backgroundImage"])}
            onUploadRes={(file) => {
              form.setFieldValue(["hero", "backgroundImage"], file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
            }}
          />
        </Form.Item>
      </>
    );
  }
};

export default HomePageForm;
