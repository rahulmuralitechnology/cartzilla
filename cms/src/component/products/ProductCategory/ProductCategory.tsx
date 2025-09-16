import { FC, useEffect, useState } from "react";
import { Form, Input, Modal, Upload, Select, message, UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProductCategoryFormData } from "../../../services/interfaces/productCategory";
import productService from "../../../services/productService";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { onPreviewFile } from "../../../services/utils";
import uploadService from "../../../services/uploadService";
import UploadInput from "../../common/UploadInput";

interface ProductCategoryFormProps {
  // initialValues?: ProductCategoryFormData | null;
  visible: boolean;
  onCancel: () => void;
  onRefresh: () => void;
  //   onSubmit: (values: ProductCategoryFormData) => void;
  //   loading: boolean;
}

const ProductCategoryForm: FC<ProductCategoryFormProps> = ({ visible, onCancel, onRefresh }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const [initialValues, setInitiaValues] = useState<Partial<ProductCategoryFormData> | null>(null);
  const [form] = Form.useForm();

  const onSubmit = async (values: ProductCategoryFormData) => {
    try {
      const response = await productService.createProductCategory({
        ...values,
        userId: selectedStore?.userId as string,
        storeId: selectedStore?.id as string,
      });
      onRefresh();
      message.success("Product category added successfully");
      onCancel();
    } catch (error: any) {
      console.log("Failed to add product category", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldValue("name", initialValues.name);
      form.setFieldValue("description", initialValues.description);
      form.setFieldValue("categoryImage", initialValues.categoryImage);
    }
  }, [initialValues]);

  return (
    <Modal
      title={initialValues ? "Edit Product Category" : "Create New Product Category"}
      open={visible}
      destroyOnClose
      okText={initialValues ? "Edit" : "Save"}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      width={600}>
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Form.Item name='name' label='Category Name' rules={[{ required: true, message: "Please enter category name" }]}>
          <Input />
        </Form.Item>

        <Form.Item name='description' label='Description' rules={[{ required: true, message: "Please enter description" }]}>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name='categoryImage' label='Category Logo' valuePropName='categoryImage'>
          <UploadInput
            imageUrl={form.getFieldValue("categoryImage")}
            onUploadRes={(file) => {
              form.setFieldValue("categoryImage", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductCategoryForm;
