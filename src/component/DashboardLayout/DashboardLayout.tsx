import { Outlet, useParams } from "react-router-dom";
import React, { FC, useEffect, useState } from "react";
import {
  UserOutlined,
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
  DashboardOutlined,
  ShopOutlined,
  SettingFilled,
  GlobalOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  QuestionCircleOutlined,
  CodeOutlined,
  GoldOutlined,
  ReconciliationOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Space, Avatar, Dropdown, Breadcrumb, Tag } from "antd";
import type { MenuProps } from "antd";
import AppLogo from "../AppLogo/AppLogo";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorage, getURL, setLocalStorage } from "../../services/utils";
import roleConfig from "../../config/roleConfig";
import { setSelectedSideMenu, setUser } from "../../store/reducers/userReducer";
import { RootState } from "../../store";
import { setAllTemplates, setSelectedStoreId } from "../../store/reducers/storeSlice";
import appConstant from "../../services/appConstant";
import "./DashboardLayout.scss";
import { LayoutTemplate, Palette } from "lucide-react";
import templateService from "../../services/templateService";
import PublishSiteButton from "../common/PublishSiteButton/PublishSiteButton";
import moment from "moment";

const { Header, Sider, Content } = Layout;

export const CustomHeader: FC<{ itemsBreadCrumb: string[] }> = ({ itemsBreadCrumb }) => {
  const { user, userRefresh } = useSelector((state: RootState) => state.user);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams() as { storeId: string };
  const items: MenuProps["items"] = [];

  if (user?.role === roleConfig.SUPERADMIN) {
    items.push(
      ...[
        {
          label: "Analytics",
          icon: <DashboardOutlined />,
          key: "2",
          onClick: async () => {
            navigate(`/store/${storeId}/analytics`);
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
        {
          label: "All Stores",
          icon: <ShopOutlined />,
          key: "storelist",
          onClick: async () => {
            navigate("/store-list");
          },
        },
        {
          label: "Themes",
          icon: <LayoutTemplate style={{ width: "15px", height: "15px" }} />,
          key: "theme",
          onClick: async () => {
            navigate(`/store/${storeId}/themes`);
          },
        },
        {
          label: "Requested Theme",
          icon: <Palette style={{ width: "15px", height: "15px" }} />,
          key: "3",
          onClick: async () => {
            navigate(`/store/${storeId}/requested-theme`);
          },
        },
      ]
    );
  }

  items.push(
    ...[
      {
        label: "Profile",
        icon: <UserOutlined />,
        key: "profile",
        onClick: async () => {
          navigate(`/store/${storeId}/user-profile`);
        },
      },
      {
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
      },
    ]
  );

  const getUser = async () => {
    if (authService.isAuthenticated()) {
      const res = await authService.getUserInfo();
      if (res?.data?.user?.Store) {
        dispatch(setSelectedStoreId(res.data.user.Store[0]));
      }
      dispatch(setUser(res.data.user));
    }
  };

  const getAllTemplates = async () => {
    try {
      const result = await templateService.getAllTemplates(false);
      dispatch(setAllTemplates(result.data.templates));
    } catch (error: any) {}
  };

  useEffect(() => {
    getUser();
    getAllTemplates();
  }, [userRefresh]);

  return (
    <Header className='main-header-container'>
      {user ? (
        <Space>
          <h2>
            Welcome <span style={{ color: "var(--purple-800)" }}>{user?.username}</span>{" "}
          </h2>
        </Space>
      ) : (
        <div></div>
      )}

      <Breadcrumb separator='>'>
        {itemsBreadCrumb.map((bread, i) => {
          return (
            <Breadcrumb.Item key={i}>
              <span style={{ color: i == 0 ? "#576fdb" : "#242538" }}>{bread}</span>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <Space size='middle'>
        <Button
          icon={<GlobalOutlined />}
          disabled={!selectedStore?.isPublished}
          href={getURL(selectedStore?.domain as string)}
          target='_blank'>
          Visit Site
        </Button>
        {user?.role !== roleConfig.USER && <PublishSiteButton />}

        {/* <Button type='primary'>Re-Publish</Button> */}
        {/* <BellOutlined style={{ fontSize: "1.6rem", color: "var(--purple-800)" }} /> */}
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Space className='user_info_card' size={15} direction='horizontal' align='center'>
            <Avatar icon={<UserOutlined />} style={{ fontSize: "1rem", color: "var(--purple-800)" }} />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

const CustomSider: FC = ({}) => {
  const [collapsed, setCollapsed] = useState(getLocalStorage("mainSider") ?? false);
  const dispatch = useDispatch();
  const { user, selectedSideMenu } = useSelector((state: RootState) => state.user);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const { storeId } = useParams() as { storeId: string };

  const navigate = useNavigate();

  const onCollaped = () => {
    setLocalStorage("mainSider", !collapsed);
    setCollapsed(!collapsed);
  };

  const items = [];

  if (user?.role === roleConfig.SUPERADMIN) {
    items.push(
      ...[
        {
          key: "Admin analytics",
          icon: <DashboardOutlined />,
          label: "Analytics",
          onClick: () => navigate(`/store/${storeId}/analytics`),
        },
        {
          key: "client",
          icon: <TeamOutlined />,
          label: "Client",
          onClick: () => navigate(`/store/${storeId}/store-users`),
        },
      ]
    );
  }
  if (selectedStore?.siteType === "webapp") {
    items.push(
      ...[
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          onClick: () => navigate(`/store/${storeId}/dashboard`),
        },
        {
          key: "order_manage",
          icon: <ShopOutlined />,
          label: "Order Management",
          children: [
            { key: "order_customer", label: "Customer", onClick: () => navigate(`/store/${storeId}/customer`), icon: <UserAddOutlined /> },
            { key: "order_order", label: "Orders", onClick: () => navigate(`/store/${storeId}/orders`), icon: <ShoppingCartOutlined /> },
            { key: "order_cart", label: "Cart", onClick: () => navigate(`/store/${storeId}/carts`), icon: <ShoppingCartOutlined /> },
            {
              key: "inventory_manage",
              label: "Inventory Manage",
              onClick: () => navigate(`/store/${storeId}/inventory`),
              icon: <ReconciliationOutlined />,
            },
          ],
        },
      ]
    );
  }

  items.push(
    ...[
      {
        key: "cms",
        icon: <ShopOutlined />,
        label: "CMS Management",
        onClick: () => navigate(`/store/${storeId}/cms`),
      },
      {
        key: "code-snippets",
        icon: <CodeOutlined />,
        label: "Code Snippets",
        onClick: () => navigate(`/store/${storeId}/code-snippets`),
      },
      // {
      //   key: "marketing-tools",
      //   icon: <ShopOutlined />,
      //   label: "Marketing Tools",
      //   onClick: () => navigate(`/store/${storeId}/marketing-tools"),
      // },
      ...(user?.role !== roleConfig.USER
        ? [
            {
              key: "settings",
              icon: <SettingFilled />,
              label: "Settings",
              onClick: () => navigate(`/store/${storeId}/settings`),
            },
            {
              key: "client-employee",
              icon: <UserOutlined />,
              label: "Employees",
              onClick: () => navigate(`/store/${storeId}/client/employees`),
            },
          ]
        : []),
      {
        key: "help-support",
        icon: <QuestionCircleOutlined />,
        label: "Help & Support",
        disabled: true,
        onClick: () => navigate(`/store/${storeId}/help-support`),
      },
    ]
  );

  React.useEffect(() => {
    if (storeId) {
      if (user.role === roleConfig.CLIENT) {
        navigate(`/store/${storeId}/dashboard`);
      } else {
        navigate(`/store/${storeId}/analytics`);
      }
    }
  }, [storeId]);

  return (
      <Sider trigger={null} collapsible theme='light' width={250} collapsed={collapsed} className='main-sider-wrapper'>
        <AppLogo width={"180px"} collapsed={collapsed} />
        <div className='user-profile'>
          {!collapsed && (
            <>
              <h2>
                {selectedStore?.name}
                {selectedStore?.buildStatus && (
                  <Button type='link' target='_blanck' href={getURL(selectedStore?.domain as string)} icon={<GlobalOutlined />} />
                )}
              </h2>
              {selectedStore?.subscriptionEndDate && moment(selectedStore.subscriptionEndDate).diff(moment(), "days") > 0 && (
                <div style={{ color: "green", fontWeight: "bold" }}>
                  <span>
                    Expires in: <Tag color='volcano'>{`${moment(selectedStore.subscriptionEndDate).diff(moment(), "days")} days`}</Tag>
                  </span>
                </div>
              )}

              {selectedStore?.subscriptionEndDate && moment(selectedStore.subscriptionEndDate).diff(moment(), "days") <= 0 && (
                <div style={{ color: "red", fontWeight: "bold" }}>
                  <span>Subscription Expired</span>
                </div>
              )}
            {/* <p>{user?.role === roleConfig.SUPERADMIN && "Super Admin"}</p> */}
            </>
          )}
        </div>
        <Menu
          theme='light'
          mode='inline'
          className='sider-memu-container'
          selectedKeys={[selectedSideMenu]}
          onSelect={({ key }) => {
            dispatch(setSelectedSideMenu(key));
          }}
          items={items}
        />
      {/* <Button
        className='logout-btn'
        style={{ width: collapsed ? 50 : 200 }}
        type='default'
        onClick={() => {
          authService.logout();
          localStorage.removeItem(appConstant.AUTH_TOKEN);
          dispatch(setUser(null));
          dispatch(setSelectedStoreId(null));
          navigate("/account/sign-in");
        }}>
        {collapsed ? <LogoutOutlined /> : "Logout"}
      </Button> */}

        <Button className='collaps-btn' onClick={onCollaped}>
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </Button>
      </Sider>
  );
};

const DashboardLayout: React.FC<{ breadCrumb?: string[]; className?: string }> = ({ className, breadCrumb = [] }) => {
  return (
    <Layout className='main-layout-wrapper'>
      <CustomSider />
      <Layout className='site-layout'>
        <CustomHeader itemsBreadCrumb={breadCrumb ?? []} />
        <Content className={`site-layout-background main-content-container`}>
          <div className={className}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
