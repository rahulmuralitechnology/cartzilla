import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Modal, message, List, Typography, Flex } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useParams } from "react-router-dom";
import { EmailNotificationProps } from "../../services/interfaces/emailNotification";
import storeService from "../../services/storeService";
import { setAllEmails } from "../../store/reducers/storeSlice";

const { Search } = Input;

const EmailNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { storeEmails, selectedStore } = useSelector((state: RootState) => state.store);

  const [searchText, setSearchText] = useState("");
  const [filteredEmail, setFilteredEmail] = useState<EmailNotificationProps[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const statusColors = {
    pending: "gold",
    Ordered: "blue",
    Shipped: "green",
    cancelled: "red",
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Customer",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, record: EmailNotificationProps) => new Date(record.createdAt).toLocaleString(),
      sorter: (a: EmailNotificationProps, b: EmailNotificationProps) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  const handleSearch = (value: string) => {
    const filtered = storeEmails.filter((email) => email.message.toLowerCase().includes(value.toLowerCase()));
    setFilteredEmail(filtered);
    setSearchText(value);
  };

  const getAllEmails = async (storeId: string) => {
    setLoading(true);
    try {
      const response = await storeService.getAllStoreEmails(storeId);
      setFilteredEmail(response.data.reverse());
      dispatch(setAllEmails(response.data.reverse()));
    } catch (error) {
      console.log("Failed to fetch products", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getAllEmails(selectedStore?.id);
    }
  }, [selectedStore?.id]);

  return (
    <section className=''>
      <Flex justify='flex-end' style={{ marginBottom: "15px" }}>
        <Search
          placeholder='Search orders by ID or customer name'
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
        dataSource={filteredEmail?.length > 0 ? filteredEmail : []}
        loading={loading}
        rowKey='id'
        pagination={{
          total: filteredEmail?.length,
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total) => `Total ${total} orders`,
        }}
      />
    </section>
  );
};

export default EmailNotification;
