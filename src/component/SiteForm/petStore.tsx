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
  Segmented,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, DeleteColumnOutlined, DeleteFilled } from "@ant-design/icons";
import type { LandingSiteConfig } from "../../services/interfaces/SiteForm";
import siteConfigService from "../../services/siteConfigService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { onSetRefresh } from "../../store/reducers/storeSlice";
import UploadInput from "../common/UploadInput";
import { ISiteType } from "../../services/interfaces/common";
import { Tabs } from "antd";

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
        {/* <Segmented
          options={["Required", "Optional"]}
          value={segment}
          onChange={setSegment}
          block
          style={{ marginBottom: 20, maxWidth: 400 }}
        /> */}
        <Tabs
          defaultActiveKey='1'
          destroyInactiveTabPane={false}
          items={[
            {
              label: "Hero Section",
              key: "1",
              forceRender: true,
              children: (
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
                        form.setFieldValue(
                          ["hero", "backgroundImage"],
                          file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
                        );
                      }}
                    />
                  </Form.Item>
                </>
              ),
            },
            {
              label: "Contact",
              key: "2",
              forceRender: true,
              children: (
                <>
                  <Form.Item name={["contact", "contactDetails", "address"]} rules={[{ required: true }]} label='Address'>
                    <TextArea rows={3} />
                  </Form.Item>
                  <Row gutter={[32, 16]}>
                    <Col span={24} md={12}>
                      <Form.Item name={["contact", "contactDetails", "email"]} rules={[{ required: true }]} label='Email'>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                      <Form.Item name={["contact", "contactDetails", "phone"]} rules={[{ required: true }]} label='Phone'>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[32, 16]}>
                    <Col span={24} md={12}>
                      <Form.Item name={["contact", "contactDetails", "whatsapp"]} label='WhatsApp'>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={14} md={12}>
                      <Form.Item name={["contact", "mapUrl"]} label='Map URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[32, 16]}>
                    <Col span={14} md={12}>
                      <Form.Item name={["socialLinks", "facebook"]} label='Facebook URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={14} md={12}>
                      <Form.Item name={["socialLinks", "instagram"]} label='Instagram URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[32, 16]}>
                    <Col span={14} md={12}>
                      <Form.Item name={["socialLinks", "X"]} label='X URL'>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={14} md={12}>
                      <Form.Item name={["socialLinks", "youtube"]} label='YouTube URL'>
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

export default FormTwo;
