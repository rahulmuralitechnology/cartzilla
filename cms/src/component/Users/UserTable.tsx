import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, message, Tag, Popover } from "antd";
import { SearchIcon, Edit2Icon, Key } from "lucide-react";
import authService, { IUser } from "../../services/authService";
import UserEditModal from "./UserEditModal";
import { useDispatch, useSelector } from "react-redux";
import { setStoreClients } from "../../store/reducers/userReducer";
import { RootState } from "../../store/types/store";
import roleConfig from "../../config/roleConfig";
import { render } from "sass";
import { getURL } from "../../services/utils";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const UserTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchText, setSearchText] = useState("");
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const { clients } = useSelector((root: RootState) => root.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   const { users, loading, error, totalUsers, fetchUsers } = useUserStore();

  const getAllClients = async () => {
    try {
      setLoading(true);
      const response = await authService.getStoreClients(page, pageSize);
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
      render: (username: string, record: IUser) => {
        return (
          <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate(`/admin/user/${record?.id}/stores`)}>
            {username}
          </span>
        );
      },
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
      <div style={{ marginBottom: 20 }}>
        <Search
          placeholder='Search users...'
          allowClear
          enterButton={<SearchIcon size={20} />}
          onChange={(e) => handleSearch(e.target.value)}
          size='large'
          onSearch={handleSearch}
        />
      </div>

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
        onClose={() => {
          setRefresh(!refresh);
          setIsModalVisible(false);
          setEditingUser(null);
        }}
      />
    </div>
  );
};

export default UserTable;
