import { Outlet, useLocation, useParams } from "react-router-dom";
import React, { FC, useEffect } from "react";
import { UserOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { Layout, Space, Avatar, Dropdown, Breadcrumb, Tag } from "antd";
import "./StepLayout.scss";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import roleConfig from "../../config/roleConfig";
import { setUser } from "../../store/reducers/userReducer";
import { RootState } from "../../store";
import { setSelectedStoreId, setStores } from "../../store/reducers/storeSlice";
import appConstant from "../../services/appConstant";
import storeService from "../../services/storeService";

const { Content } = Layout;

export const CustomHeader: FC<{ itemsBreadCrumb: string[] }> = ({ itemsBreadCrumb }) => {
  const { user, userRefresh } = useSelector((state: RootState) => state.user);
  const { refresh: storeRefresh } = useSelector((state: RootState) => state.store);
  const { storeId } = useParams() as { storeId: string };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items: MenuProps["items"] = [];

  if (user?.role === roleConfig.SUPERADMIN) {
    items.push(
      ...[
        {
          label: "Dashboard",
          icon: <DashboardOutlined />,
          key: "2",
          onClick: async () => {
            navigate(`/store/${storeId}`);
          },
        },
        {
          label: "Users",
          icon: <UserOutlined />,
          key: "1",
          onClick: async () => {
            navigate(`/store/${storeId}/users`);
          },
        },
      ]
    );
  }

  items.push({
    label: "Logout",
    icon: <LogoutOutlined rotate={-90} />,
    key: "0",
    onClick: async () => {
      authService.logout();
      localStorage.removeItem(appConstant.AUTH_TOKEN);
      dispatch(setUser(null));
      dispatch(setSelectedStoreId(null));
      navigate("/account/sign-in");
    },
  });

  const getUser = async () => {
    if (authService.isAuthenticated()) {
      const res = await authService.getUserInfo();
      dispatch(setUser(res?.data?.user));
    }
  };

  const fetchAllStore = async () => {
    try {
      const response = await storeService.getAllStoreList();
      dispatch(setStores(response.data.stores.reverse()));
    } catch (error) {
      console.log("Failed to fetch store", error);
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchAllStore();
    }
  }, [storeRefresh]);

  useEffect(() => {
    getUser();
  }, [userRefresh]);

  return (
    <div className='main-header-container'>
      <Space>
        <span
          onClick={() => {
            navigate("/");
          }}>
          <img src='/logo.png' style={{ width: "140px", objectFit: "contain", cursor: "pointer" }} />
        </span>
      </Space>
      <Breadcrumb separator='>'>
        {itemsBreadCrumb.map((bread, i) => {
          return (
            <Breadcrumb.Item key={i}>
              <span style={{ color: i == 0 ? "#576fdb" : "#242538" }}>{bread}</span>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Space className='user_info_card' size={15} direction='horizontal' align='center'>
          <Space direction='vertical' size={0}>
            <h3>{user?.username}</h3>
            <h4>{user?.email}</h4>
            {user && user?.role === roleConfig.SUPERADMIN && (
              <Tag style={{ float: "right", marginRight: 0 }} color='green'>
                SuperAdmin
              </Tag>
            )}
          </Space>
          <Avatar shape='circle' size='large' icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </div>
  );
};

const MainLayout: React.FC<{ breadCrumb?: string[]; className?: string }> = ({ className, breadCrumb = [] }) => {
  const pathname = useLocation().pathname;
  return (
    <Layout className='started-layout-wrapper'>
      {pathname === "/" && <img src='./assets/ellipse1-getstarted.svg' className='ellipse-1' />}

      <Layout className='site-layout'>
        <CustomHeader itemsBreadCrumb={breadCrumb ?? []} />
        <Content className={`main-content-container`}>
          <div className={className}>
            <Outlet />
          </div>
        </Content>
      </Layout>
      {pathname === "/" && <img src='./assets/ellipse-2-getstarted.svg' className='ellipse-2' />}
    </Layout>
  );
};

export default MainLayout;
