import { FC, useState } from "react";
import { Layout, Button, message, Modal, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProductList from "../../component/products/ProductList";
import ProductFilters from "../../component/products/ProductFilters";
import ProductForm from "../../component/products/ProductForm";
import { ProductFormData } from "../../store/types/product";
import { updateProduct, deleteProduct, setFilters, setLoading, setProducts } from "../../store/reducers/productSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import productService, { IProduct, ProductStatus } from "../../services/productService";
import BulkUploadForm from "../../component/products/BulkUpload";

const { Content } = Layout;

const ProductDashboard: FC = () => {
  const dispatch = useDispatch();
  const [bulkUpload, setBulkUpload] = useState<boolean>(false);
  const { products, loading, filters } = useSelector((state: RootState) => state.product);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const [formVisible, setFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleAddEdit = async (values: ProductFormData) => {
    dispatch(setLoading(true));
    if (editingProduct) {
      try {
        const response = await productService.updateProduct({
          ...values,
          id: editingProduct?.id as string,
          availabilityStatus: values?.availabilityStatus ? "IN_STOCK" : "OUT_OF_STOCK",
          status: values?.status ? "PUBLISHED" : "DRAFT",
        });
        message.success("Product updated successfully");
      } catch (error: any) {
        console.log("Failed to add product", error);
        message.error(error.message);
        dispatch(setLoading(false));
      }
      setFormVisible(false);
      dispatch(setLoading(false));
      setRefresh(!refresh);
    } else {
      try {
        // TODO: Check the plan limit
        if (
          selectedStore?.subscriptionPlan?.featuresValidation?.product_limit &&
          products.length >= selectedStore?.subscriptionPlan?.featuresValidation?.product_limit
        ) {
          dispatch(setLoading(false));
          return message.error(
            `You can add only ${selectedStore?.subscriptionPlan?.featuresValidation?.product_limit} products in this plan`
          );
        }
        const response = await productService.createProduct({
          ...values,
          userId: selectedStore?.userId as string,
          availabilityStatus: values?.availabilityStatus ? "IN_STOCK" : "OUT_OF_STOCK",
          status: values?.status ? "PUBLISHED" : "DRAFT",
          storeId: selectedStore?.id as string,
        });
        dispatch(setLoading(false));
        setFormVisible(false);
        setRefresh(!refresh);
        message.success("Product added successfully");
      } catch (error: any) {
        dispatch(setLoading(false));
        console.log("Failed to add product", error);
        message.error(error.message);
      }
    }

    setEditingProduct(null);
  };

  const onDeleteProduct = async (id: string) => {
    try {
      const response = await productService.deleteProduct(id);
      setRefresh(!refresh);
      message.success("Product deleted successfully");
    } catch (error) {
      console.log("Failed to delete product", error);
      message.error("Failed to delete product");
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        dispatch(deleteProduct(id));
        onDeleteProduct(id);
      },
    });
  };

  const fetchAllProducts = async (userId: string, storeId: string) => {
    dispatch(setLoading(true));
    try {
      const response = await productService.getAllProductList({ storeId: storeId as string, userId: userId as string });
      if (!response.success) {
        throw new Error(response.error || response.info);
      }
      dispatch(setProducts(response.data.products));
    } catch (error) {
      console.log("Failed to fetch products", error);
      message.error("Failed to fetch products");
    }
    dispatch(setLoading(false));
  };

  const handleStatusChange = (id: string, status: ProductStatus) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      dispatch(updateProduct({ ...product, status }));
      message.success(`Product ${status === "PUBLISHED" ? "published" : "unpublished"} successfully`);
    }
  };

  React.useEffect(() => {
    if (selectedStore?.userId) {
      fetchAllProducts(selectedStore?.userId, selectedStore?.id as string);
    }
  }, [refresh, selectedStore?.userId]);

  const filterProducts = (productsData: IProduct[], filters: any) => {
    return productsData.filter((product) => {
      const matchesSearch = product?.title?.toLowerCase().includes(filters?.search?.toLowerCase());
      const matchesCategory = filters.category ? product.category === filters.category : true;
      const matchesStatus = filters.status === "all" ? true : product.status === filters.status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    // .sort((a, b) => {
    //   const sortFieldA = a[filters.sortBy];
    //   const sortFieldB = b[filters.sortBy];
    //   if (filters.sortOrder === 'asc') {
    //     return sortFieldA > sortFieldB ? 1 : -1;
    //   } else {
    //     return sortFieldA < sortFieldB ? 1 : -1;
    //   }
    // });
  };

  const filteredProducts = filterProducts(products, filters);

  return (
    <Content className='product-container-page'>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between" }} className='filter-header'>
        <ProductFilters filters={filters} onFilterChange={(newFilters) => dispatch(setFilters(newFilters))} />
        <Space>
          <Button type='default' onClick={() => setBulkUpload(true)}>
            Bulk Upload
          </Button>

          <Button
            type='default'
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null);
              setFormVisible(true);
            }}>
            Add Product
          </Button>
        </Space>
      </div>

      <ProductList
        products={filteredProducts}
        loading={loading}
        onEdit={(product) => {
          setEditingProduct(product);
          setFormVisible(true);
        }}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <ProductForm
        visible={formVisible}
        initialValues={editingProduct || undefined}
        onCancel={() => {
          setFormVisible(false);
          setEditingProduct(null);
        }}
        onSubmit={handleAddEdit}
        loading={loading}
      />

      <BulkUploadForm
        visible={bulkUpload}
        onCancel={() => setBulkUpload(false)}
        onUploadSuccess={() => {
          setBulkUpload(false);
          setRefresh(!refresh);
        }}
      />
    </Content>
  );
};

export default ProductDashboard;
