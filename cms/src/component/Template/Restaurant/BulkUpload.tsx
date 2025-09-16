import { FC, useState } from "react";
import { Form, Modal, Upload, UploadFile, UploadProps, message } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import productService from "../../../services/productService";
import { convertFileToJson, getFileTypeDescription, handleExcelMenuUpload } from "../../../services/utils";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store";
import restaurantService from "../../../services/restaurantService";
import { MenuItem } from "../../../services/interfaces/siteConfig";

const { Dragger } = Upload;

interface BulkUploadFormProps {
  visible: boolean;
  onCancel: () => void;
  onUploadSuccess: () => void;
  menuItems: MenuItem[];
}

const BulkUploadForm: FC<BulkUploadFormProps> = ({ visible, onCancel, onUploadSuccess, menuItems }) => {
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
      handleExcelMenuUpload(file.originFileObj as any, async (items) => {
        if (
          selectedStore?.subscriptionPlan &&
          selectedStore?.subscriptionPlan?.featuresValidation?.product_limit < menuItems.length + items.length
        ) {
          message.info(`You can upload only ${selectedStore?.subscriptionPlan?.featuresValidation?.product_limit} menu items in this plan`);
          return;
        }
        const res = await restaurantService.buldUploadMenu(
          items.map((item) => ({ ...item, userId: selectedStore?.userId, storeId: selectedStore?.id }))
        );
        onUploadSuccess();
        setFileList([]);
        setLoading(false);
        message.success("Menus uploaded successfully");
      });
    } catch (error) {
      message.error("Failed to upload menus");
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
        setFileList([]);
        onCancel();
      }}
      onOk={handleUpload}
      okButtonProps={{
        loading: loading,
      }}
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
