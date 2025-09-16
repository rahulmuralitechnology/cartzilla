import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  Row,
  Col,
  Statistic,
  Alert,
  Tabs,
  Badge,
  Tooltip,
  Progress,
  message,
  Upload,
  Dropdown,
  Menu,
  Flex,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  FilterOutlined,
  ReloadOutlined,
  BellOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import inventoryService from "../../../services/inventoryService";
import { useParams } from "react-router-dom";
import { IProduct, ProductStatus } from "../../../services/productService";
import appConstant from "../../../services/appConstant";
import { ProductCategoryFormData } from "../../../services/interfaces/productCategory";

const { Content, Header } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

interface InventoryStats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  reorderNeeded: number;
}

interface StockHistory {
  id: string;
  changeAmount: number;
  changeType: string;
  reason?: string;
  createdAt: string;
  createdBy?: string;
}

const InventoryManagement: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategoryFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [upLoading, setUpLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
    reorderNeeded: 0,
  });
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [bulkUpdateModalVisible, setBulkUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const { storeId } = useParams() as { storeId: string };

  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();

  // Load inventory data
  const loadInventory = async (stdId: string) => {
    setLoading(true);
    try {
      const res = await inventoryService.getStoreInventory(stdId, searchText, categoryFilter, statusFilter, page, limit);
      setProducts(res.data.products);
      setProductCategories(res.data.productCategory);
      // Calculate stats
      const newStats = {
        totalProducts: res.data.stats.totalProducts,
        inStock: res.data.stats.inStock,
        lowStock: res.data.stats.lowStock,
        outOfStock: res.data.stats.outOfStock,
        totalValue: res.data.products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0),
        // reorderNeeded: res.data.products.filter((p) => (p.availableStock || 0) <= (p.reorderLevel || 0)).length, // Calculate reorder needed based on available stock
        reorderNeeded: 0,
      };
      setStats(newStats);
    } catch (error) {
      message.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      loadInventory(storeId);
    }
  }, [storeId, page, limit]);

  // Status tag color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return "success";
      case "LOW_STOCK":
        return "warning";
      case "OUT_OF_STOCK":
        return "error";
      case "BACKORDER":
        return "processing";
      case "DISCONTINUED":
        return "default";
      default:
        return "default";
    }
  };

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return <CheckCircleOutlined />;
      case "LOW_STOCK":
        return <WarningOutlined />;
      case "OUT_OF_STOCK":
        return <CloseCircleOutlined />;
      case "BACKORDER":
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  // Table columns
  const columns = [
    {
      title: "Product",
      key: "product",
      render: (record: IProduct) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={record.images[0]} alt={record.title} style={{ width: 40, height: 40, borderRadius: "4px", objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: 500, marginBottom: "2px" }}>{record.title}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>SKU: {record.sku || "N/A"}</div>
          </div>
        </div>
      ),
      width: 300,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "Stock Status",
      key: "stockStatus",
      render: (record: IProduct) => (
        <div>
          <Tag
            color={getStatusColor(record.availabilityStatus)}
            icon={getStatusIcon(record.availabilityStatus)}
            style={{ marginBottom: "4px" }}>
            {record?.availabilityStatus?.replace("_", " ")}
          </Tag>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {/* Available: {record.availableStock || 0} / Total: {record.stock || 0} */}
            Available: {record.stock || 0}
          </div>
          {(record.reservedStock || 0) > 0 && <div style={{ fontSize: "12px", color: "#f50" }}>Reserved: {record.reservedStock}</div>}
        </div>
      ),
      width: 150,
    },
    // Todo: Implement stock level indicator
    // {
    //   title: "Stock Level",
    //   key: "stockLevel",
    //   render: (record: IProduct) => {
    //     const percentage = Math.min(100, ((record.availableStock || 0) / Math.max(1, record.reorderLevel || 1)) * 100);
    //     const strokeColor = percentage > 100 ? "#52c41a" : percentage > 50 ? "#faad14" : "#ff4d4f";

    //     return (
    //       <div style={{ width: 100 }}>
    //         <Progress percent={Math.min(100, percentage)} size='small' strokeColor={strokeColor} showInfo={false} />
    //         <div style={{ fontSize: "12px", marginTop: "2px" }}>
    //           {record.availableStock || 0} / {record.reorderLevel || 0}
    //         </div>
    //       </div>
    //     );
    //   },
    //   width: 120,
    // },
    {
      title: "Price",
      key: "price",
      render: (record: IProduct) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {appConstant.CURRENY_SYMBOL}
            {(record.price || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Value: {appConstant.CURRENY_SYMBOL}
            {((record.price || 0) * (record.stock || 0)).toFixed(2)}
          </div>
        </div>
      ),
      width: 100,
    },
    {
      title: "Last Updated",
      key: "lastUpdated",
      render: (record: IProduct) => (
        <div style={{ fontSize: "12px" }}>{record.lastStockUpdate ? new Date(record.lastStockUpdate).toLocaleDateString() : "N/A"}</div>
      ),
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: IProduct) => (
        <Space>
          <Tooltip title='Update Stock'>
            <Button type='text' icon={<EditOutlined />} onClick={() => handleEditStock(record)} />
          </Tooltip>
          {/* Todo */}
          {/* <Tooltip title='View History'>
            <Button type='text' icon={<BellOutlined />} onClick={() => handleViewHistory(record)} />
          </Tooltip> */}
        </Space>
      ),
      width: 100,
    },
  ];

  // Handle stock update
  const handleEditStock = (product: IProduct) => {
    setSelectedProduct(product);
    form.setFieldsValue({
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      availabilityStatus: product.availabilityStatus,
    });
    setStockModalVisible(true);
  };

  // Handle view stock history
  const handleViewHistory = async (product: IProduct) => {
    setSelectedProduct(product);
    // Mock history data
    const mockHistory: StockHistory[] = [
      {
        id: "1",
        changeAmount: -2,
        changeType: "ORDER_CONFIRMED",
        reason: "Order #12345 confirmed",
        createdAt: "2024-01-20T10:30:00Z",
        createdBy: "System",
      },
      {
        id: "2",
        changeAmount: 50,
        changeType: "PURCHASE_RECEIVED",
        reason: "New stock received",
        createdAt: "2024-01-19T15:45:00Z",
        createdBy: "Admin",
      },
      {
        id: "3",
        changeAmount: -5,
        changeType: "MANUAL_ADJUSTMENT",
        reason: "Damaged items removed",
        createdAt: "2024-01-18T12:00:00Z",
        createdBy: "Manager",
      },
    ];
    setStockHistory(mockHistory);
    setHistoryModalVisible(true);
  };

  // Handle stock form submission
  const handleStockSubmit = async (values: any) => {
    try {
      setUpLoading(true);
      await inventoryService.updateProductStock(
        selectedProduct?.id as string,
        values.stock,
        values.reorderLevel,
        values.availabilityStatus
      );
      console.log("Updating stock:", values);
      message.success("Stock updated successfully");
      setStockModalVisible(false);
      setUpLoading(false);
      loadInventory(storeId);
    } catch (error) {
      setUpLoading(false);
      message.error("Failed to update stock");
    }
  };

  // Handle bulk update
  const handleBulkUpdate = () => {
    if (selectedProducts.length === 0) {
      message.warning("Please select products to update");
      return;
    }
    setBulkUpdateModalVisible(true);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchText ||
      product.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchText.toLowerCase()));

    const matchesStatus = !statusFilter || product.availabilityStatus === statusFilter;
    const matchesCategory = !categoryFilter || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Low stock products
  const lowStockProducts = products.filter((p) => p.availabilityStatus === "LOW_STOCK" || p.availabilityStatus === "OUT_OF_STOCK");

  // Reorder needed products
  const reorderProducts = products.filter((p) => (p.availableStock || 0) <= (p.reorderLevel || 0));

  return (
    <section className='bloomi5_page'>
      <Flex justify='space-between' align='center' style={{ marginBottom: 10 }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>Inventory Management</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => loadInventory(storeId)}>
            Refresh
          </Button>
          {/* <Button type='primary' icon={<PlusOutlined />}>
            Add Product
          </Button> */}
        </Space>
      </Flex>

      <Content>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab='Inventory Overview' key='inventory'>
            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title='Total Products'
                    value={stats.totalProducts}
                    prefix={<CheckCircleOutlined style={{ color: "#1890ff" }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic title='In Stock' value={stats.inStock} prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />} />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <Statistic
                    title='Total Inventory Value'
                    value={stats.totalValue}
                    precision={2}
                    prefix={appConstant.CURRENY_SYMBOL}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              {/* Todo */}
              {/* <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic title='Low Stock' value={stats.lowStock} prefix={<WarningOutlined style={{ color: "#faad14" }} />} />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic title='Out of Stock' value={stats.outOfStock} prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />} />
                </Card>
              </Col> */}
            </Row>

            {/* Todo Total Value Card */}
            {/* <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
              <Col xs={24} sm={12}>
                <Card>
                  <Statistic
                    title='Total Inventory Value'
                    value={stats.totalValue}
                    precision={2}
                    prefix={appConstant.CURRENY_SYMBOL}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <Statistic
                    title='Reorder Needed'
                    value={stats.reorderNeeded}
                    prefix={<WarningOutlined style={{ color: "#faad14" }} />}
                    valueStyle={{ color: stats.reorderNeeded > 0 ? "#cf1322" : "#3f8600" }}
                  />
                </Card>
              </Col>
            </Row> */}

            {/* Alerts */}
            {stats.reorderNeeded > 0 && (
              <Alert
                message={`${stats.reorderNeeded} products need reordering`}
                type='warning'
                showIcon
                closable
                style={{ marginBottom: "16px" }}
                action={
                  <Button size='small' onClick={() => setActiveTab("reorder")}>
                    View Details
                  </Button>
                }
              />
            )}

            {/* Filters */}
            <Card>
              <Row gutter={[16, 16]} align='middle'>
                <Col xs={24} sm={8} md={6}>
                  <Input
                    placeholder='Search products...'
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} style={{ width: "100%" }} allowClear>
                    <Option value='IN_STOCK'>In Stock</Option>
                    <Option value='LOW_STOCK'>Low Stock</Option>
                    <Option value='OUT_OF_STOCK'>Out of Stock</Option>
                    <Option value='BACKORDER'>Backorder</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <Select placeholder='Category' value={categoryFilter} onChange={setCategoryFilter} style={{ width: "100%" }} allowClear>
                    {productCategories.map((c, i) => (
                      <Option key={i} value={c.name}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                {/* Todo */}
                {/* <Col xs={24} sm={24} md={10}>
                  <Space>
                    <Button disabled={selectedProducts.length === 0} onClick={handleBulkUpdate}>
                      Bulk Update ({selectedProducts.length})
                    </Button>
                    <Button icon={<DownloadOutlined />}>Export</Button>
                    <Button icon={<UploadOutlined />}>Import</Button>
                  </Space>
                </Col> */}
              </Row>
            </Card>

            {/* Products Table */}
            <Card styles={{ body: { padding: 0 } }}>
              <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey='id'
                loading={loading}
                pagination={{
                  style: { padding: "0 20px" },
                  pageSize: limit,
                  total: stats.totalProducts,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setLimit(pageSize);
                  },
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
                }}
                rowSelection={{
                  selectedRowKeys: selectedProducts,
                  onChange: (selectedRowKeys) => setSelectedProducts(selectedRowKeys as string[]),
                  type: "checkbox",
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>
          {/* Tddo */}
          {/* <TabPane
            tab={
              <Badge count={stats.lowStock} offset={[10, 0]}>
                Low Stock Alerts
              </Badge>
            }
            key='lowstock'>
            <Card>
              <Alert
                message='Low Stock Alert'
                description='These products are running low on stock and may need immediate attention.'
                type='warning'
                showIcon
                style={{ marginBottom: "16px" }}
              />
              <Table
                columns={columns.filter((col) => col.key !== "actions")}
                dataSource={lowStockProducts}
                rowKey='id'
                pagination={false}
              />
            </Card>
          </TabPane> */}

          {/* Todo */}
          {/* <TabPane
            tab={
              <Badge count={stats.reorderNeeded} offset={[10, 0]}>
                Reorder Needed
              </Badge>
            }
            key='reorder'>
            <Card>
              <Alert
                message='Reorder Alert'
                description='These products have reached their reorder level and need to be restocked.'
                type='error'
                showIcon
                style={{ marginBottom: "16px" }}
              />
              <Table columns={columns} dataSource={reorderProducts} rowKey='id' pagination={false} />
            </Card>
          </TabPane> */}
        </Tabs>

        {/* Stock Update Modal */}
        <Modal
          title={`Update Stock - ${selectedProduct?.title}`}
          open={stockModalVisible}
          onCancel={() => setStockModalVisible(false)}
          footer={null}
          okButtonProps={{ loading: upLoading }}
          width={600}>
          <Form form={form} layout='vertical' onFinish={handleStockSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label='Current Stock' name='stock' rules={[{ required: true, message: "Please enter stock quantity" }]}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='Reorder Level' name='reorderLevel'>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label='Availability Status' name='availabilityStatus'>
              <Select>
                <Option value='IN_STOCK'>In Stock</Option>
                <Option value='LOW_STOCK'>Low Stock</Option>
                <Option value='OUT_OF_STOCK'>Out of Stock</Option>
                <Option value='BACKORDER'>Backorder</Option>
                <Option value='DISCONTINUED'>Discontinued</Option>
              </Select>
            </Form.Item>
            {/* <Form.Item label='Reason for Change' name='reason'>
              <Input.TextArea rows={3} placeholder='Enter reason for stock change...' />
            </Form.Item> */}
            <Form.Item>
              <Space style={{ justifyContent: "flex-end", width: "100%" }}>
                <Button type='primary' htmlType='submit' loading={upLoading}>
                  Update Stock
                </Button>
                <Button onClick={() => setStockModalVisible(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Stock History Modal */}
        <Modal
          title={`Stock History - ${selectedProduct?.title}`}
          open={historyModalVisible}
          onCancel={() => setHistoryModalVisible(false)}
          footer={[
            <Button key='close' onClick={() => setHistoryModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={800}>
          <Table
            dataSource={stockHistory}
            rowKey='id'
            pagination={false}
            columns={[
              {
                title: "Date",
                dataIndex: "createdAt",
                render: (date: string) => new Date(date).toLocaleString(),
              },
              {
                title: "Change",
                dataIndex: "changeAmount",
                render: (amount: number) => (
                  <span style={{ color: amount > 0 ? "#52c41a" : "#ff4d4f", fontWeight: "bold" }}>
                    {amount > 0 ? "+" : ""}
                    {amount}
                  </span>
                ),
              },
              {
                title: "Type",
                dataIndex: "changeType",
                render: (type: string) => <Tag color='blue'>{type?.replace("_", " ")}</Tag>,
              },
              {
                title: "Reason",
                dataIndex: "reason",
              },
              {
                title: "Updated By",
                dataIndex: "createdBy",
              },
            ]}
          />
        </Modal>

        {/* Bulk Update Modal */}
        <Modal title='Bulk Update Stock' open={bulkUpdateModalVisible} onCancel={() => setBulkUpdateModalVisible(false)} footer={null}>
          <Form
            form={bulkForm}
            layout='vertical'
            onFinish={(values) => {
              console.log("Bulk update:", values);
              message.success("Bulk update completed");
              setBulkUpdateModalVisible(false);
              setSelectedProducts([]);
              loadInventory(storeId);
            }}>
            <Alert message={`Updating ${selectedProducts.length} selected products`} type='info' style={{ marginBottom: "16px" }} />
            <Form.Item label='Stock Adjustment' name='stockAdjustment' help='Enter positive number to add stock, negative to reduce'>
              <InputNumber style={{ width: "100%" }} placeholder='Enter positive or negative adjustment' />
            </Form.Item>
            <Form.Item label='Availability Status' name='availabilityStatus'>
              <Select placeholder='Select status (optional)'>
                <Option value='IN_STOCK'>In Stock</Option>
                <Option value='LOW_STOCK'>Low Stock</Option>
                <Option value='OUT_OF_STOCK'>Out of Stock</Option>
                <Option value='BACKORDER'>Backorder</Option>
              </Select>
            </Form.Item>
            <Form.Item label='Reason' name='reason' rules={[{ required: true, message: "Please enter reason for bulk update" }]}>
              <Input.TextArea rows={3} placeholder='Enter reason for bulk update...' />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type='primary' htmlType='submit'>
                  Update All Selected
                </Button>
                <Button onClick={() => setBulkUpdateModalVisible(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </section>
  );
};

export default InventoryManagement;
