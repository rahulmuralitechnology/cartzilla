import { FC, useEffect, useState } from "react";
import { Form, Input, Modal, Upload, Select, UploadFile, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { StoreFormData } from "../../store/types/store";
import { isValidStoreName, onPreviewFile } from "../../services/utils";
import UploadInput from "../common/UploadInput";
import { set } from "lodash";

interface StoreFormProps {
  initialValues?: Partial<StoreFormData>;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: StoreFormData) => void;
  loading: boolean;
}

const siteType = [
  { key: "website", value: "Business Website" },
  { key: "webapp", value: "E-commerce App" },
];

const StoreForm: FC<StoreFormProps> = ({ initialValues, visible, onCancel, onSubmit, loading }) => {
  const [sltSiteType, setSltSiteType] = useState<string>("website");
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldValue("name", initialValues.name);
      form.setFieldValue("description", initialValues.description);
      form.setFieldValue("storeCategory", initialValues.storeCategory);
      form.setFieldValue("siteType", initialValues.siteType);
      form.setFieldValue("logo", initialValues.logo);
      form.setFieldValue("favicon", initialValues.favicon);
      setSltSiteType(initialValues?.siteType as string);
    } else {
      form.setFieldValue("siteType", "website");
    }
  }, [initialValues]);

  return (
    <Modal
      title={initialValues ? "Edit Store" : "Create New Store"}
      open={visible}
      destroyOnClose
      okText={initialValues ? "Update" : "Create"}
      okButtonProps={{
        loading: loading,
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      width={600}>
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Form.Item name='name' label='Store Name' rules={[{ required: true, message: "Please enter store name" }]}>
          <Input disabled={!!initialValues?.name} />
        </Form.Item>

        <Form.Item name='description' label='Description' rules={[{ required: true, message: "Please enter description" }]}>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name='siteType' label='Site Type' rules={[{ required: true, message: "Please select site type" }]}>
          <Select disabled={!!initialValues?.siteType} onSelect={(v) => setSltSiteType(v)}>
            {siteType.map((site, i) => (
              <Select.Option key={i} value={site.key}>
                {site.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item name='storeCategory' label='Store Category' rules={[{ required: true, message: "Please select store category" }]}>
          <Select disabled={!!selectedStore?.storeCategory}>
            {templateList
              .filter((t) => t.templateType === sltSiteType)
              .map((store, i) => (
                <Select.Option key={i} value={store.repoDirName}>
                  {store.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item> */}

        <Row gutter={[0, 16]}>
          <Col span={12}>
            <Form.Item name='logo' label='Store Logo' rules={[{ required: true, message: "Please upload store logo" }]}>
              <UploadInput
                imageUrl={initialValues?.logo ? initialValues?.logo : ""}
                onUploadRes={(file) => {
                  form.setFieldValue("logo", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"favicon"} label='Favicon' extra='maximum size for favicon 32x32'>
              <UploadInput
                imageUrl={initialValues?.favicon ? initialValues?.favicon : ""}
                onUploadRes={(file) => {
                  form.setFieldValue("favicon", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default StoreForm;
