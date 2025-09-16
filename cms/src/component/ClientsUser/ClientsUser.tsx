import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tag, Flex, message } from "antd";
import { SearchIcon, Edit2Icon, Key } from "lucide-react";
import authService, { IUser } from "../../services/authService";
import UserEditModal from "./ClientUserForm";
import { useDispatch, useSelector } from "react-redux";
import { setStoreClients } from "../../store/reducers/userReducer";
import { RootState } from "../../store/types/store";
import roleConfig from "../../config/roleConfig";
import { Modal, Form } from "antd";
import userService from "../../services/userService";

const { Search } = Input;

const ClientUserTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchText, setSearchText] = useState("");
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const { clients } = useSelector((root: RootState) => root.user);
  const { selectedStore } = useSelector((root: RootState) => root.store);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [sendInviteModal, setSendInviteModal] = useState<boolean>(false);
  const [sendInviteLoading, setSendInviteLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleSend = async () => {
    try {
      await form.validateFields();
      setSendInviteLoading(true);
      const res = await userService.sendAddUserInvitation(
        form.getFieldValue("email"),
        selectedStore?.id as string,
        selectedStore?.userId as string,
        ""
      );
      message.success("Invite sent successfully");
      setSendInviteLoading(false);
      setSendInviteModal(false);
      form.resetFields(["email"]);
    } catch (error: any) {
      setSendInviteLoading(false);
      setSendInviteModal(false);
      console.log("Failed to send invite", error);
      if (error?.errorFields?.length) {
        message.error("Fields are missing");
      } else {
        message.error(error.message);
      }
    }
  };

  //   const { users, loading, error, totalUsers, fetchUsers } = useUserStore();

  const getAllClients = async () => {
    try {
      setLoading(true);
      const response = await authService.getStoreClientUsers(page, pageSize, selectedStore?.id as string, selectedStore?.userId as string);
      dispatch(setStoreClients(response.data.clients));
      setTotalUsers(response.data.totalUsers);
    } catch (error) {
      console.log("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllClients();
  }, [refresh, page, pageSize]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      sorter: (a: IUser, b: IUser) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: IUser, b: IUser) => a.email.localeCompare(b.email),
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      width: 400,
      render: (_: any, record: IUser) => {
        return (
          <Space size={0} wrap>
            {record?.permissions?.map((permission: string, index: number) => {
              return (
                <Tag key={index} color='blue' style={{ marginBottom: 5 }}>
                  {permission.toUpperCase()}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: IUser, b: IUser) => a.phone?.localeCompare(b?.phone),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (_: any, record: IUser) => {
        if (record?.role === roleConfig.SUPERADMIN) {
          return <Tag color='blue'>{record?.role?.toUpperCase()}</Tag>;
        } else if (record.role === roleConfig.CLIENT) {
          return <Tag color='cyan'>{record?.role?.toUpperCase()}</Tag>;
        } else if (record.role === roleConfig.CUSTOMER) {
          return <Tag color='magenta'>{record?.role?.toUpperCase()}</Tag>;
        } else if (record.role === roleConfig.USER) {
          return <Tag>{record?.role?.toUpperCase()}</Tag>;
        }
        return "--";
      },
    },
    {
      title: "Site Access",
      key: "access",
      render: (_: any, record: IUser) => {
        return record.storeId ? record?.storeId.split(",").length : "--";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IUser) => (
        <Button type='primary' icon={<Edit2Icon size={16} />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const filterUser = (query: string, data: IUser[]) => {
    return data.filter((client) => {
      const matchesSearch = client.username.toLowerCase().includes(query.toLowerCase());
      // const matchesEmail = client.email?.toLowerCase().includes(query.toLowerCase());
      // const matchesrole = client?.role?.toString().toLowerCase().includes(query.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredClients = filterUser(searchText, clients as IUser[]);

  return (
    <div className='bloomi5_page' style={{ padding: 24 }}>
      <Flex align='center' justify='space-between' style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Employees</h2>
        <Space>
          <Search
            placeholder='Search users...'
            allowClear
            enterButton={<SearchIcon size={20} />}
            onChange={(e) => handleSearch(e.target.value)}
            size='middle'
            onSearch={handleSearch}
          />
          <Button type='primary' onClick={() => setSendInviteModal(true)}>
            Send Invite
          </Button>
        </Space>
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredClients?.length ? filteredClients : []}
        rowKey='id'
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalUsers,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} users`,
        }}
      />

      <UserEditModal
        visible={isModalVisible}
        user={editingUser}
        isEdit={false}
        onClose={() => {
          setRefresh(!refresh);
          setIsModalVisible(false);
          setEditingUser(null);
        }}
      />

      <Modal
        title='Send Invite'
        open={sendInviteModal}
        onCancel={() => setSendInviteModal(false)}
        onOk={handleSend}
        okText='Send'
        okButtonProps={{ loading: sendInviteLoading }}>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}>
            <Input placeholder='Enter email' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientUserTable;
