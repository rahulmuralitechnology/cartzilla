import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Tag, Avatar, Typography, message, Dropdown, Flex, Modal, DatePicker } from "antd";
import { SearchOutlined, DownloadOutlined, FilterOutlined, FilePdfFilled, ArrowLeftOutlined } from "@ant-design/icons";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService, { IUser } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import "../../styles/Customer.scss";
import storeService, { IStore } from "../../services/storeService";
import { setStores } from "../../store/reducers/storeSlice";
import dayjs from "dayjs";
import moment from "moment";
import { getURL } from "../../services/utils";

const { Text } = Typography;

const StoreListTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stores } = useSelector((state: RootState) => state.store);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cusetomerList, setCustomerList] = useState<IUser[]>([]);
  const [filteredStores, setFilteredStores] = useState<IStore[]>([]);
  const { userId } = useParams() as { userId: string };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
  const [subscriptionDate, setSubscriptionDate] = useState<string>("");

  const showModal = (store: IStore) => {
    setSelectedStore(store);
    setSubscriptionDate(store.subscriptionEndDate || "");
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedStore(null);
    setSubscriptionDate("");
  };

  const handleUpdateSubscription = async () => {
    if (!selectedStore) return;

    try {
      setLoading(true);

      await storeService.updateStore({
        ...selectedStore,
        subscriptionEndDate: subscriptionDate,
      });

      message.success("Subscription date updated successfully");
      fetchAllStore(userId);
      handleCancel();
    } catch (error) {
      console.error("Failed to update subscription date:", error);
      message.error("Failed to update subscription date");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    if (value === "") {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter((store) => store.name.toLowerCase().includes(value.toLowerCase()));
      setFilteredStores(filtered);
    }
    setSearchText(value);
  };

  const columns: any = [
    {
      title: "Store",
      key: "store",
      render: (record: IStore) => (
        <Space>
          <Avatar src={record.logo || ""} size='large' />
          <div>
            <Text strong>{record.name}</Text>
            {record?.isPublished && (
              <>
                <br />
                <a href={getURL(record?.domain as string)} target='_blank'>
                  {record.domain}
                </a>
              </>
            )}
          </div>
        </Space>
      ),
      sorter: (a: IStore, b: IStore) => `${a.name}`.localeCompare(`${b.name}`),
    },
    {
      title: "Site Type",
      dataIndex: "siteType",
      key: "siteType",
      render: (siteType: string) => <Tag>{siteType}</Tag>,
    },

    {
      title: "Published",
      key: "isPublished",
      render: (record: IStore) => <Tag color={record.isPublished ? "green" : "red"}>{record.isPublished ? "Published" : "Draft"}</Tag>,
      filters: [
        { text: "Published", value: true },
        { text: "Draft", value: false },
      ],
    },
    {
      title: "Created Date",
      key: "createdAt",
      sorter: (a: IStore, b: IStore) => new Date(a?.createdAt as string).getTime() - new Date(b.createdAt as string).getTime(),
      render: (record: IStore) => {
        return moment(record?.createdAt).format("MMMM Do YYYY");
      },
    },
    {
      title: "Subscription End",
      key: "subscriptionEndDate",
      render: (record: IStore) => {
        if (!record.subscriptionEndDate) return "--";
        return moment(record.subscriptionEndDate).format("MMMM Do YYYY");
      },
      sorter: (a: IStore, b: IStore) => {
        if (!a.subscriptionEndDate || !b.subscriptionEndDate) return 0;
        return new Date(a.subscriptionEndDate).getTime() - new Date(b.subscriptionEndDate).getTime();
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (record: IStore) => (
        <Space>
          <Button
            type='default'
            size='small'
            onClick={(e) => {
              e.stopPropagation();
              showModal(record);
            }}>
            Update
          </Button>
        </Space>
      ),
    },
  ];

  const fetchAllStore = async (uId: string) => {
    try {
      setLoading(true);
      const response = await storeService.getAllStoreByUserId(uId);
      dispatch(setStores(response.data.stores));
      setFilteredStores(response.data.stores);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch store", error);
      message.error("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (userId) {
      fetchAllStore(userId);
    }
  }, [userId]);

  return (
    <div className='bloomi5_page user_storelist_page'>
      <Flex justify='space-between' align='center' style={{ marginBottom: 15 }}>
        <h2>Site </h2>
        <Space>
          <Button type='text' icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} size='large'>
            Back
          </Button>

          <Input.Search
            placeholder='Search site...'
            allowClear
            enterButton={<SearchOutlined />}
            size='large'
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </Space>
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredStores}
        rowKey='id'
        loading={loading}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} customers`,
        }}
        // rowSelection={{
        //   selectedRowKeys,
        //   onChange: setSelectedRowKeys,
        // }}
        style={{ cursor: "pointer" }}
      />

      <Modal
        title='Update Subscription End Date'
        open={isModalVisible}
        onOk={handleUpdateSubscription}
        onCancel={handleCancel}
        confirmLoading={loading}>
        <DatePicker
          value={subscriptionDate ? dayjs(subscriptionDate) : null}
          onChange={(date) => setSubscriptionDate(date ? date.format("YYYY-MM-DDTHH:mm:ss.SSSZ") : "")}
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
};

export default StoreListTable;
