import { useEffect, useState } from "react";
import { Table, Button, Modal, Space, Tag, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DiscountCouponForm from "./DiscountCouponForm";
import { Discount } from "../../services/interfaces/common";
import discountService from "../../services/discountService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useParams } from "react-router-dom";
import productService, { IProduct } from "../../services/productService";

export default function DiscountCouponList() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
    },
    {
      title: "Discount Value",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (text: any, record: Discount) => (
        <span>{record.discountType === "percentage" ? `${record.value}%` : `₹${record.value}`}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: any, record: Discount) => <Tag color={record.active ? "green" : "red"}>{record.active ? "Acitve" : "In-Active"}</Tag>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "endDate",
      render: (v: any, record: Discount) => <>{new Date(record.expiryDate).toLocaleString()}</>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Discount) => (
        <Space size='middle'>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id as string)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingDiscount(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: Discount) => {
    setEditingDiscount(record as any);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDiscounts(discounts.filter((item) => item.id !== id));
  };

  const getCouponList = async (id: string) => {
    try {
      const result = await discountService.getDiscountCouponList(id);
      setDiscounts(result.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getCouponList(selectedStore?.id);
      fetchAllProducts(selectedStore?.id);
    }
  }, [selectedStore?.id, refresh]);

  const handleModalOk = async (values: Discount) => {
    try {
      setLoading(true);
      if (editingDiscount) {
        const updateRes = await discountService.updateDiscountCoupon({ ...values, storeId: selectedStore?.id as string });
        message.success("Coupon updated successfully");
        setRefresh(!refresh);
      } else {
        const saveDis = await discountService.createDiscountCoupon({ ...values, storeId: selectedStore?.id as string });
        console.log("save", saveDis);
        setIsModalVisible(false);
        setRefresh(!refresh);
        message.success("Coupon save successfully");
      }
      setIsModalVisible(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingDiscount(null);
  };

  const fetchAllProducts = async (storeId: string) => {
    try {
      const response = await productService.getAllProductList({ storeId: storeId as string, userId: "" });
      setProducts(response.data.products);
    } catch (error) {
      console.log("Failed to fetch products", error);
    }
  };

  return (
    <section className='bloomi5_page disount_contaienr'>
      <div style={{ display: "flex", justifyContent: "end", padding: "10px 0" }}>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
          Add New Discount
        </Button>
      </div>
      <Table columns={columns} dataSource={discounts} />
      <Modal
        destroyOnClose
        title={editingDiscount ? "Edit Discount Coupon" : "Add New Discount Coupon"}
        open={isModalVisible}
        centered
        onCancel={handleModalCancel}
        footer={null}
        width={800}>
        <DiscountCouponForm
          loading={loading}
          products={products}
          initialValues={editingDiscount}
          onFinish={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </section>
  );
}
