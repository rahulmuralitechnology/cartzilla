import { FC, useEffect, useState } from "react";
import { Form, Input, Modal, Upload, Select, UploadFile, Row, Col, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RootState, StoreFormData } from "../../../store/types/store";
import UploadInput from "../../common/UploadInput";
import { set } from "lodash";
import storeService from "../../../services/storeService";
import { useDispatch, useSelector } from "react-redux";
import { setUserRefresh } from "../../../store/reducers/userReducer";
import { getURL } from "../../../services/utils";

const siteType = [
  { key: "website", value: "Business Website" },
  { key: "webapp", value: "E-commerce App" },
];

const StoreInfo: FC = () => {
  const [sltSiteType, setSltSiteType] = useState<string>("website");
  const { selectedStore, templateList } = useSelector((state: RootState) => state.store);
  const { userRefresh } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedStore) {
      form.setFieldValue("name", selectedStore.name);
      form.setFieldValue("description", selectedStore.description);
      form.setFieldValue("storeCategory", selectedStore.storeCategory);
      form.setFieldValue("siteType", selectedStore.siteType);
      form.setFieldValue("logo", selectedStore.logo);
      form.setFieldValue("favicon", selectedStore.favicon);
      form.setFieldValue("domain", getURL(selectedStore?.domain as string));
      setSltSiteType(selectedStore?.siteType as string);
    } else {
      form.setFieldValue("siteType", "website");
    }
  }, []);

  const handleAddEdit = async (values: StoreFormData) => {
    try {
      setLoading(true);
      const response = await storeService.updateStore({
        ...values,
        id: selectedStore?.id as string,
      });
      message.success("Store updated successfully");
      setLoading(false);
      dispatch(setUserRefresh());
    } catch (error: any) {
      console.log("Failed to update store", error);
      message.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='store_info_container'>
      <Form className='store_info_form' form={form} requiredMark={false} layout='vertical' onFinish={handleAddEdit}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name='name' label='Store Name' rules={[{ required: true, message: "Please enter store name" }]}>
              <Input disabled={!!selectedStore?.name} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='domain' label='Site URL' rules={[{ required: true, message: "Please enter store name" }]}>
              <Input disabled={true} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name='description' label='Description' rules={[{ required: true, message: "Please enter description" }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name='siteType' label='Site Type' rules={[{ required: true, message: "Please select site type" }]}>
              <Select disabled={!!selectedStore?.siteType} onSelect={(v) => setSltSiteType(v)}>
                {siteType.map((site, i) => (
                  <Select.Option key={i} value={site.key}>
                    {site.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='storeCategory' label='Store Category' rules={[{ required: true, message: "Please select store category" }]}>
              <Select disabled={!!selectedStore?.storeCategory}>
                {templateList
                  .filter((t) => t.templateType === sltSiteType)
                  .map((store, i) => (
                    <Select.Option key={i} value={store.repoDirName}>
                      {store.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[0, 16]}>
          <Col span={12}>
            <Form.Item name='logo' label='Store Logo' rules={[{ required: true, message: "Please upload store logo" }]}>
              <UploadInput
                imageUrl={selectedStore?.logo ? selectedStore?.logo : ""}
                onUploadRes={(file) => {
                  form.setFieldValue("logo", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={"favicon"} label='Favicon' extra='maximum size for favicon 32x32'>
              <UploadInput
                imageUrl={selectedStore?.favicon ? selectedStore?.favicon : ""}
                onUploadRes={(file) => {
                  form.setFieldValue("favicon", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button loading={loading} style={{ width: 200 }} htmlType='submit' type='primary'>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StoreInfo;
