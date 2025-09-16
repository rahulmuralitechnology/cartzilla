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
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { MenuItem } from "../../../services/interfaces/siteConfig";
import UploadInput from "../../common/UploadInput";
import { handleExcelMenuUpload } from "../../../services/utils";
import restaurantService from "../../../services/restaurantService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import BulkUploadForm from "./BulkUpload";
import appConstant from "../../../services/appConstant";

const AddMenuForm: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isbulkUpload, setIsBulkUpload] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uplaodLoading, setUploadLoading] = useState<boolean>(false);
  const { selectedStore } = useSelector((state: RootState) => state.store);

  const columns: any = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <Avatar size='small' src={image} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${appConstant.CURRENY_SYMBOL}${price.toFixed(2)}`,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Actions",
      key: "actions",
      align: "end",
      render: (_: any, record: MenuItem) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      align: "end",
      render: (_: any, record: MenuItem) => (
        <Popconfirm
          title={`Are you sure want to delete?`}
          onConfirm={() => {
            deleteMenuItem(record.id as string);
          }}
          okText='Yes'
          cancelText='No'>
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      ...item.dietary,
    });
    setIsModalVisible(true);
  };

  const deleteMenuItem = async (menuId: string) => {
    try {
      const deleteRes = await restaurantService.deleteMenu(menuId);
      message.success(deleteRes.message);
      setRefresh(!refresh);
    } catch (error: any) {
      message.error(error.message);
    } finally {
    }
  };

  const handleModalOk = async () => {
    form.validateFields().then(async (values) => {
      const newItem: MenuItem = {
        category: values.category,
        name: values.name,
        price: values.price,
        description: values.description,
        image: values.image,
        dietary: {
          vegetarian: values.vegetarian,
          vegan: values.vegan,
          glutenFree: values.glutenFree,
          spicy: values.spicy,
        },
        userId: selectedStore?.userId,
        storeId: selectedStore?.id,
      };
      setLoading(true);
      if (editingItem) {
        try {
          const updateRes = await restaurantService.updateMenu({ ...newItem, id: editingItem.id });
          message.success("Menu item updated successfully");
        } catch (error: any) {
          message.error(error.message);
        }
      } else {
        try {
          if (selectedStore?.subscriptionPlan && selectedStore.subscriptionPlan?.featuresValidation?.product_limit < menuItems.length + 1) {
            setLoading(false);
            message.info(
              `You can upload only ${selectedStore?.subscriptionPlan?.featuresValidation?.product_limit} menu items in this plan`
            );
            return;
          }
          const result = await restaurantService.createMenu({ ...newItem, userId: selectedStore?.userId, storeId: selectedStore?.id });
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
          if (selectedStore?.subscriptionPlan?.name === "Starter" && menuItems.length + items.length > 25) {
            message.info("You can upload only 25 menu items in Starter plan");
            return;
          }
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

  const getAllMenu = async (storeId: string) => {
    try {
      const result = await restaurantService.getAllMenuList(storeId);
      setMenuItems(result.data.menuList);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedStore) {
      getAllMenu(selectedStore.id as string);
    }
  }, [refresh, selectedStore]);

  return (
    <div className='add-menu-form-container'>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", width: "100%" }}>
        <div></div>
        <Space align='center' size='middle'>
          <Button size='middle' onClick={() => setIsBulkUpload(true)} icon={<UploadOutlined />}>
            Bulk Upload
          </Button>

          <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
            Add Menu Item
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={menuItems} rowKey='id' />
      <Modal
        centered
        title={editingItem ? "Edit Menu Item" : "Add Menu Item"}
        open={isModalVisible}
        okText={editingItem ? "Update Menu" : "Add Menu"}
        onOk={handleModalOk}
        okButtonProps={{ loading: loading }}
        onCancel={handleModalCancel}>
        <Form form={form} layout='vertical'>
          <Row gutter={[16, 16]}>
            <Col span={24} md={16}>
              <Form.Item name='name' label='Name' rules={[{ required: true, message: "Please input the name!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item name='price' label='Price' rules={[{ required: true, message: "Please input the price!" }]}>
                <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name='description' label='Description' rules={[{ required: true, message: "Please input the description!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name='category' label='Category' rules={[{ required: true, message: "Please select the category!" }]}>
            <Select>
              <Select.Option value='appetizer'>Appetizer</Select.Option>
              <Select.Option value='main'>Main Course</Select.Option>
              <Select.Option value='dessert'>Dessert</Select.Option>
              <Select.Option value='beverage'>Beverage</Select.Option>
            </Select>
          </Form.Item>
          <Space size='large'>
            <Form.Item name='vegetarian' valuePropName='checked' label='Vegetarian'>
              <Switch />
            </Form.Item>
            <Form.Item name='vegetarian' valuePropName='checked' label='Vegetarian'>
              <Switch />
            </Form.Item>
            <Form.Item name='glutenFree' valuePropName='checked' label='Gluten-Free'>
              <Switch />
            </Form.Item>
            <Form.Item name='spicy' valuePropName='checked' label='Spicy'>
              <Switch />
            </Form.Item>
          </Space>
          {/* <Form.Item name='image' label='Image' rules={[{ required: true, message: "Please upload the image!" }]}> */}
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

      <BulkUploadForm
        menuItems={menuItems}
        visible={isbulkUpload}
        onCancel={() => setIsBulkUpload(false)}
        onUploadSuccess={() => {
          setRefresh(!refresh);
          setIsBulkUpload(false);
        }}
      />
    </div>
  );
};

export default AddMenuForm;
