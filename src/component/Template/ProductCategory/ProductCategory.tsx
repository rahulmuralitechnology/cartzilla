"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  message,
  Space,
  Row,
  Col,
  Avatar,
  Upload,
  UploadProps,
} from "antd";
import { PlusOutlined, EditOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { MenuItem } from "../../../services/interfaces/siteConfig";
import UploadInput from "../../common/UploadInput";
import { handleExcelMenuUpload } from "../../../services/utils";
import restaurantService from "../../../services/restaurantService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ProductCategoryFormData } from "../../../services/interfaces/productCategory";
import productService from "../../../services/productService";
import { setProductCategory } from "../../../store/reducers/productSlice";
import { useParams } from "react-router-dom";

const AddProductCategory: React.FC = () => {
  const [menuItems, setMenuItems] = useState<ProductCategoryFormData[]>([]);
  const params = useParams() as { storeId: string };
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<ProductCategoryFormData | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uplaodLoading, setUploadLoading] = useState<boolean>(false);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const { productCategory } = useSelector((state: RootState) => state.product);

  const columns: any = [
    {
      title: "Category Image",
      dataIndex: "categoryImage",
      key: "categoryImage",
      render: (categoryImage: string) => <Avatar size='small' src={categoryImage} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Actions",
      key: "actions",
      align: "end",
      render: (_: any, record: ProductCategoryFormData) => (
        <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      align: "end",
      render: (_: any, record: MenuItem) => (
        <Button type='text' icon={<DeleteOutlined />} danger onClick={() => deleteMenuItem(record.id as string)} />
      ),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item: ProductCategoryFormData) => {
    setEditingItem(item);
    form.setFieldValue("image", item.categoryImage);
    form.setFieldsValue({
      ...item,
    });
    setIsModalVisible(true);
  };

  const deleteMenuItem = async (catId: string) => {
    try {
      const deleteRes = await productService.deleteProductCategory(catId);
      message.success(deleteRes.message);
      setRefresh(!refresh);
    } catch (error: any) {
      message.error(error.message);
    } finally {
    }
  };

  const handleModalOk = async () => {
    form.validateFields().then(async (values) => {
      const newItem: ProductCategoryFormData = {
        ...values,
        userId: selectedStore?.userId,
        storeId: selectedStore?.id,
      };
      setLoading(true);
      if (editingItem) {
        try {
          const updateRes = await productService.updateProductCategory({ ...newItem, id: editingItem.id });
          message.success("Product Category updated successfully");
          setEditingItem(null);
          setIsModalVisible(false);
        } catch (error: any) {
          message.error(error.message);
        }
      } else {
        try {
          const result = await productService.createProductCategory({ ...newItem });
          message.success(result.message);
        } catch (error: any) {
          message.error(error.message);
        }
      }
      setLoading(false);
      setRefresh(!refresh);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const props: UploadProps = {
    name: "file",
    beforeUpload: () => false,
    onChange(info) {
      setUploadLoading(true);
      handleExcelMenuUpload(info.file as any, async (items) => {
        try {
          const res = await restaurantService.buldUploadMenu(
            items.map((item) => ({ ...item, userId: selectedStore?.userId, storeId: selectedStore?.id }))
          );
          setRefresh(!refresh);
          setUploadLoading(false);
        } catch (error: any) {
          message.error(error.message);
        }
      });
    },
  };

  const fetchAllProductsCategory = async (storeId: string) => {
    try {
      setLoading(true);
      const response = await productService.getAllProductCategoyList(storeId);
      dispatch(setProductCategory(response.data.productCategory.reverse()));
    } catch (error) {
      console.log("Failed to fetch Product Category", error);
      message.error("Failed to fetch product category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      fetchAllProductsCategory(selectedStore?.id);
    }
  }, [refresh, selectedStore?.id]);

  return (
    <section className='bloomi5_page product_category_container'>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 0" }}>
        <div></div>
        <Space align='center' size='middle'>
          {/* <Upload {...props}>
            <Button size='middle' loading={uplaodLoading} icon={<UploadOutlined />}>
              Bulk Upload
            </Button>
          </Upload> */}
          <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
            Add Category
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        loading={loading}
        pagination={{
          total: productCategory.length,
          pageSize: 5,
        }}
        dataSource={productCategory}
        rowKey='id'
      />
      <Modal
        centered
        title={editingItem ? "Update Category" : "Add Category"}
        open={isModalVisible}
        okText={editingItem ? "Update " : "Add "}
        onOk={handleModalOk}
        okButtonProps={{ loading: loading }}
        onCancel={handleModalCancel}>
        <Form form={form} layout='vertical'>
          <Form.Item name='name' label='Name' rules={[{ required: true, message: "Please input the name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name='description' label='Description' rules={[{ required: true, message: "Please input the description!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name='image' label='Image'>
            <UploadInput
              imageUrl={form.getFieldValue("image")}
              onUploadRes={(file) => {
                form.setFieldValue("image", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default AddProductCategory;
