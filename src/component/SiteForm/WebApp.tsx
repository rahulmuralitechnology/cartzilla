import { FC } from "react";
import { Form, Input, Switch, Button, Card, Collapse, Space, message, Typography, Select, FormInstance, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined, DeleteFilled } from "@ant-design/icons";
import type { SliderConfig, StoreSiteConfig } from "../../services/interfaces/siteConfig";
import siteConfigService from "../../services/siteConfigService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { onSetRefresh } from "../../store/reducers/storeSlice";
import UploadInput from "../../component/common/UploadInput";
import { ISiteType } from "../../services/restaurantService";
import { Tabs } from "antd";

const { Panel } = Collapse;
const { TextArea } = Input;
const { Title } = Typography;

const WebAppForm: FC<{ form: FormInstance; loading: boolean; setLoading: (v: boolean) => void }> = ({ form, loading, setLoading }) => {
  const dispatch = useDispatch();
  const { selectedStore, refresh } = useSelector((state: RootState) => state.store);
  const onFinish = async (values: StoreSiteConfig) => {
    setLoading(true);
    try {
      let slider: SliderConfig = { enabled: false };
      if (values?.slider && values?.slider?.enabled) {
        slider = { ...values.slider };
      }

      if (!values?.banner) {
        values = {
          ...values,
          banner: {
            enabled: false,
            banners: [],
          },
        };
      }

      const response = await siteConfigService.saveSiteConfig({
        ...values,
        siteType: selectedStore?.siteType as ISiteType,
        slider: slider as SliderConfig,
        storeId: selectedStore?.id,
        userId: selectedStore?.userId,
        subdomain: selectedStore?.domain,
      });
      dispatch(onSetRefresh(!refresh));
      message.success("Configuration saved successfully!");
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
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
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item name={["hero", "title"]} label='Title' rules={[{ required: true, message: "Please enter hero title" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["hero", "subtitle"]} label='Subtitle' rules={[{ required: true }]}>
                      <TextArea rows={2} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item name={["contact", "email"]} label='Email' rules={[{ required: true }, { type: "email" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["contact", "phone"]} label='Phone' rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name={["contact", "mapUrl"]} label='Map Url' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item name={["contact", "address"]} label='Address' rules={[{ required: true }]}>
                      <TextArea />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Background Image' name={["hero", "backgroundImage"]} rules={[{ required: true }]}>
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
                  </Col>
                </Row>
              </>
            ),
          },
          ...(selectedStore?.storeCategory === "ecom_cosmetics_template"
            ? [
                {
                  label: "About",
                  key: "5",
                  forceRender: true,
                  children: (
                    <>
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
                                <Form.Item
                                  name={["about", "section1", "description"]}
                                  label='Description'
                                  rules={[{ required: true, message: "Please enter description" }]}>
                                  <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item
                                  name={["about", "section1", "additionalText"]}
                                  label='Additional Text'
                                  rules={[{ required: false, message: "Please enter additional text" }]}>
                                  <TextArea rows={4} />
                                </Form.Item>
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
                                <Form.Item
                                  name={["about", "section2", "description"]}
                                  label='Description'
                                  rules={[{ required: true, message: "Please enter description" }]}>
                                  <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item
                                  name={["about", "section2", "additionalText"]}
                                  label='Additional Text'
                                  rules={[{ required: false, message: "Please enter additional text" }]}>
                                  <TextArea rows={4} />
                                </Form.Item>
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
                    </>
                  ),
                },
              ]
            : []),
        ]}
      />
    </Form>
  );
};

export default WebAppForm;
