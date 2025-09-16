import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, message, Tag, Popover, Empty, Modal, Form, Select, List } from "antd";
import { SearchIcon, Edit2Icon, Key, Plus, UserPlus, Mail } from "lucide-react";
import authService, { IUser } from "../../services/authService";
import userService from "../../services/userService";
import UserEditModal from "./UserEditModal";
import { useDispatch, useSelector } from "react-redux";
import { setStoreClients } from "../../store/reducers/userReducer";
import { RootState } from "../../store/types/store";
import roleConfig from "../../config/roleConfig";
import { render } from "sass";
import { getURL } from "../../services/utils";
import { useNavigate, useParams } from "react-router-dom";
import storeService from "../../services/storeService";

const { Search } = Input;
const { Option } = Select;

const StoreUserTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchText, setSearchText] = useState("");
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const { clients } = useSelector((root: RootState) => root.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [assignUserModalVisible, setAssignUserModalVisible] = useState(false);
  const [allPortalUsers, setAllPortalUsers] = useState<IUser[]>([]);
  const [assignUserLoading, setAssignUserLoading] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeId } = useParams<{ storeId: string }>();
  const [form] = Form.useForm();
  const { selectedStore } = useSelector((root: RootState) => root.store);
  
  // Filter function to get only CLIENT users associated with the current store
  const getUsersForCurrentStore = (users: IUser[]) => {
    if (!storeId) return users;
    
    return users.filter(user => 
      user.role === roleConfig.CLIENT &&
      user.Store && 
      user.Store.some(store => store.id === storeId)
    );
  };

  const getAllClients = async () => {
    try {
      setLoading(true);
      const response = await authService.getStoreClients(page, pageSize);
      
      // Filter users for the current store before dispatching
      const filteredUsers = getUsersForCurrentStore(response.data.clients);
      
      dispatch(setStoreClients(filteredUsers));
      setTotalUsers(filteredUsers.length);
    } catch (error) {
      console.log("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllPortalUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getStoreClients(page, pageSize);
      
      const filteredUsers = response.data.clients.filter(user => 
      user.role === roleConfig.CLIENT
    );
    console.log("All portal users:", filteredUsers);
      setAllPortalUsers(filteredUsers);
    } catch (error) {
      console.log("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllClients();
  }, [refresh, page, pageSize, storeId]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleAddUser = () => {
    setAddUserModalVisible(true);
  };

  const handleAssignUser = () => {
    setAssignUserModalVisible(true);
    getAllPortalUsers();
  };

  const handleAddUserSubmit = async (values: { email: string }) => {
    try {
      setAddUserLoading(true);
      // Call API to add user by email and assign to store
      await userService.sendAddUserInvitation(
        values.email,
        storeId || "",
        selectedStore?.userId as string,
        "client"
      );
      
      message.success(`Invitation sent to ${values.email}`);
      setAddUserModalVisible(false);
      form.resetFields();
      setRefresh(!refresh); // Refresh the user list
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to add user");
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleAssignUserSubmit = async (userId: string) => {
    try {
      setAssignUserLoading(true);
      // Call API to assign existing user to store
      await storeService.assignUserToStore(
        userId,
        storeId || "",
      );
      
      message.success("User assigned to store successfully");
      setAssignUserModalVisible(false);
      setRefresh(!refresh); // Refresh the user list
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to assign user");
    } finally {
      setAssignUserLoading(false);
    }
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
        if (record?.role === roleConfig.CLIENT) {
          return <Tag color='cyan'>{record?.role?.toUpperCase()}</Tag>;
        }
        return "--";
      },
    },
    {
      title: "Store Access",
      dataIndex: "Store",
      render: (stores: any[], record: IUser) => {
        return (
          <Space size={0} wrap>
            {stores?.map((store, index) => (
              <Tag key={index} color='green'>
                {store.name}
              </Tag>
            ))}
          </Space>
        );
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
      const matchesSearch = client.username.toLowerCase().includes(query.toLowerCase()) ||
                           client.email.toLowerCase().includes(query.toLowerCase());
      return matchesSearch;
    });
  };

  // Filter users for current store first, then apply search filter
  const usersForCurrentStore = getUsersForCurrentStore(clients as IUser[]);
  const filteredClients = filterUser(searchText, usersForCurrentStore);
  const hasUsers = filteredClients.length > 0;

  return (
    <div className='bloomi5_page' style={{ padding: 24 }}>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Client Users</h2>
        {hasUsers && (
          <Space>
            <Button type="primary" icon={<Plus size={16} />} onClick={handleAddUser}>
              Create & Re-Assign User
            </Button>
            <Button type="default" icon={<UserPlus size={16} />} onClick={handleAssignUser}>
              Re-Assign User
            </Button>
          </Space>
        )}
      </div>

      {hasUsers ? (
        <>
          <div style={{ marginBottom: 20 }}>
            <Search
              placeholder='Search client users...'
              allowClear
              enterButton={<SearchIcon size={20} />}
              onChange={(e) => handleSearch(e.target.value)}
              size='large'
              onSearch={handleSearch}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredClients}
            rowKey='id'
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: filteredClients.length,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} client users in this store`,
            }}
          />
        </>
      ) : (
        <Empty
          description={
            <span>
              No client users found for this store
            </span>
          }
          imageStyle={{ height: 120 }}
        >
          <Space direction="vertical" size="middle">
            <div>Get started by adding a new user or assigning an existing user to this store</div>
            <Space>
              <Button type="primary" size="large" icon={<Plus size={16} />} onClick={handleAddUser}>
                Add New User
              </Button>
              <Button type="default" size="large" icon={<UserPlus size={16} />} onClick={handleAssignUser}>
                Assign Existing User
              </Button>
            </Space>
          </Space>
        </Empty>
      )}

      {/* Add User Modal */}
      <Modal
        title="Add User to Store"
        open={addUserModalVisible}
        onCancel={() => setAddUserModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddUserSubmit}
        >
          <Form.Item
            name="email"
            label="User Email"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<Mail size={16} />} 
              placeholder="Enter user's email address" 
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={addUserLoading}
              >
                Send Invitation
              </Button>
              <Button onClick={() => setAddUserModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign User Modal */}
      <Modal
        title="Assign Existing User to Store"
        open={assignUserModalVisible}
        onCancel={() => setAssignUserModalVisible(false)}
        footer={null}
        width={600}
      >
        {assignUserLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading users...</div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={allPortalUsers}
            renderItem={(user: IUser) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    onClick={() => handleAssignUserSubmit(user.id)}
                    loading={assignUserLoading}
                  >
                    Assign to Store
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={user.username}
                  description={
                    <Space direction="vertical" size={0}>
                      <div>{user.email}</div>
                      <div>
                        <Tag color="blue">{user.role}</Tag>
                        {user.Store && user.Store.length > 0 && (
                          <Tag color="green">Already in {user.Store.length} store(s)</Tag>
                        )}
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

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

export default StoreUserTable;