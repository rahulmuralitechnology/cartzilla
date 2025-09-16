import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Modal, message, List, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useParams } from "react-router-dom";
import { EmailNotificationProps } from "../../../services/interfaces/emailNotification";
import storeService from "../../../services/storeService";
import { setAllEmails, setAllReservation } from "../../../store/reducers/storeSlice";
import { Reservation } from "../../../services/interfaces/restaurant";

const { Search } = Input;

const TableReservation: React.FC = () => {
  const dispatch = useDispatch();
  const { reservation } = useSelector((state: RootState) => state.store);
  const params = useParams() as { storeId: string };

  const [searchText, setSearchText] = useState("");
  const [filterReservation, setReservations] = useState<Reservation[]>([]);
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Guests",
      dataIndex: "guests",
      key: "guests",
    },
    {
      title: "Special Requests",
      dataIndex: "specialRequests",
      key: "specialRequests",
    },
    {
      title: "Booking Date",
      dataIndex: "date",
      key: "date",
      render: (_: any, record: Reservation) => `${record.date} : ${record.time}`,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, record: Reservation) => new Date(record.createdAt).toLocaleString(),
      sorter: (a: Reservation, b: Reservation) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  const handleSearch = (value: string) => {
    const filtered = reservation.filter((email) => email.email.toLowerCase().includes(value.toLowerCase()));
    setReservations(filtered);
    setSearchText(value);
  };

  const getAllEmails = async (storeId: string) => {
    setLoading(true);
    try {
      const response = await storeService.getAllReservation(storeId);
      setReservations(response.data.reverse());
      dispatch(setAllReservation(response.data));
    } catch (error) {
      console.log("Failed to fetch products", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (params?.storeId) {
      getAllEmails(params.storeId);
    }
  }, [params]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: "16px" }}>
        <Search
          placeholder='Search by email'
          allowClear
          enterButton={<SearchOutlined />}
          size='large'
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filterReservation?.length > 0 ? filterReservation : []}
        loading={loading}
        rowKey='id'
        pagination={{
          total: filterReservation?.length,
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total) => `Total ${total} orders`,
        }}
      />
    </div>
  );
};

export default TableReservation;
