import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Tag, Avatar, Typography, message, Dropdown, Flex } from "antd";
import { SearchOutlined, DownloadOutlined, FilterOutlined, FilePdfFilled } from "@ant-design/icons";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService, { IUser } from "../../services/authService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "../../styles/Customer.scss";

const { Text } = Typography;

const CustomersTable: React.FC = () => {
  const navigate = useNavigate();
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cusetomerList, setCustomerList] = useState<IUser[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<IUser[]>([]);
  const { storeId } = useParams() as { storeId: string };

  const handleSearch = (value: string) => {
    if (value === "") {
      setFilteredCustomers(cusetomerList);
    } else {
      const filtered = filteredCustomers.filter(
        (customer) =>
          customer.username.toLowerCase().includes(value.toLowerCase()) ||
          customer.email.toLowerCase().includes(value.toLowerCase()) ||
          customer.id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
    setSearchText(value);
  };

  const handleExport = async (type: "csv" | "excel" | "pdf") => {
    setLoading(true);
    try {
      // Implement export logic here
      message.success(`Exported as ${type.toUpperCase()}`);
    } catch (error) {
      message.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  const exportMenu = {
    items: [
      {
        key: "csv",
        label: "Export as CSV",
        icon: <FileSpreadsheet size={16} />,
        onClick: () => handleExport("csv"),
      },
      {
        key: "excel",
        label: "Export as Excel",
        icon: <FileText size={16} />,
        onClick: () => handleExport("excel"),
      },
      {
        key: "pdf",
        label: "Export as PDF",
        icon: <FilePdfFilled size={16} />,
        onClick: () => handleExport("pdf"),
      },
    ],
  };

  const columns: any = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: IUser, b: IUser) => `${a.email}`.localeCompare(`${b.email}`),
      render: (_: any, record: IUser) => <span onClick={() => navigate(`/store/${storeId}/customer/${record.id}`)}>{record.email}</span>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (record: IUser) => (
        <Space>
          <Avatar src='' size='large' />
          <div>
            <Text strong>{`${record.username}`}</Text>
            <br />
            <Text type='secondary'>{record.email}</Text>
          </div>
        </Space>
      ),
      sorter: (a: IUser, b: IUser) => `${a.username}`.localeCompare(`${b.username}`),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (record: IUser) => (record?.phone ? record.phone : "--"),
    },
    {
      title: "Registration Date",
      sorter: (a: IUser, b: IUser) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (record: IUser) => {
        return new Date(record.createdAt).toLocaleDateString();
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: IUser) => <Tag color={"green"}>Active</Tag>,
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
    },
  ];

  const getAllCustomer = async (storeId: string) => {
    try {
      setLoading(true);
      const response = await authService.getAllStoreCustomer(storeId);
      setFilteredCustomers(response.data.customers);
      setCustomerList(response.data.customers);
    } catch (error) {
      console.log("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getAllCustomer(selectedStore?.id);
    }
  }, [selectedStore?.id]);

  return (
    <div className='bloomi5_page customers_page'>
      <Flex justify='space-between' align='center' style={{ marginBottom: 15 }}>
        <h2>Customers </h2>
        <Input.Search
          placeholder='Search customers...'
          allowClear
          enterButton={<SearchOutlined />}
          size='large'
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey='id'
        loading={loading}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} customers`,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        onRow={(record) => ({
          // onClick: () => navigate(`customer/${record.id}`),
        })}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default CustomersTable;
