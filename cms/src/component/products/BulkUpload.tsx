import { FC, useState } from "react";
import { Form, Modal, Upload, UploadFile, UploadProps, message } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import productService from "../../services/productService";
import { convertFileToJson, getFileTypeDescription } from "../../services/utils";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, store } from "../../store";

const { Dragger } = Upload;

interface BulkUploadFormProps {
  visible: boolean;
  onCancel: () => void;
  onUploadSuccess: () => void;
}

const BulkUploadForm: FC<BulkUploadFormProps> = ({ visible, onCancel, onUploadSuccess }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const { products } = useSelector((state: RootState) => state.product);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    setLoading(true);
    if (fileList.length === 0) {
      message.error("Please select a file to upload");
      return;
    }

    const file = fileList[0];
    try {
      const productData = await convertFileToJson(
        file.originFileObj,
        getFileTypeDescription(file.originFileObj?.type as string),
        selectedStore?.userId as string
      );

      if (
        selectedStore?.subscriptionPlan &&
        selectedStore?.subscriptionPlan?.featuresValidation?.product_limit < products.length + productData.length
      ) {
        setLoading(false);
        message.info(`You can upload only ${selectedStore?.subscriptionPlan?.featuresValidation?.product_limit} products in this plan`);
        return;
      }
      const res = await productService.productBulkUpload(productData, selectedStore?.id as string, selectedStore?.userId as string);

      message.success("Product uploaded successfully");
      onUploadSuccess();
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      message.error("Failed to upload product:" + error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx",
    maxCount: 1,
    fileList: fileList,
    onChange(info) {
      setFileList(info.fileList);
    },
  };

  return (
    <Modal
      title='Bulk Upload'
      open={visible}
      destroyOnClose
      okText='Add'
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        onCancel();
      }}
      onOk={handleUpload}
      confirmLoading={loading}
      centered
      width={600}>
      <Form form={form} layout='vertical'>
        <Form.Item name='file' label='Upload Excel File' rules={[{ required: true, message: "Please select a file to upload" }]}>
          <Dragger {...props} beforeUpload={() => false}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
            <p className='ant-upload-hint'>Support for a single or bulk upload..</p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BulkUploadForm;
