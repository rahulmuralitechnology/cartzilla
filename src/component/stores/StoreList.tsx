import { FC, useEffect } from "react";
import { List, Card, Space, Tag, Button, Dropdown, Avatar, Tooltip, message } from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  ShopOutlined,
  GlobalOutlined,
  SettingFilled,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import storeService, { IStore } from "../../services/storeService";
import { Plus, Store } from "lucide-react";
import { useDispatch } from "react-redux";
import { setFormOpen, setSelectedStoreId, setSelectedTemplate, setTemplateVersions } from "../../store/reducers/storeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/types/store";
import { getLocalStorage, setLocalStorage } from "../../services/utils";
import { useNavigate } from "react-router-dom";
import { DEFAULT_THEME } from "../../theme/defaultTheme";
import roleConfig from "../../config/roleConfig";
import appConstant from "../../services/appConstant";

interface StoreListProps {
  stores: IStore[];
  onEdit: (store: IStore) => void;
  onDelete: (id: IStore) => void;
  loading: boolean;
}

const StoreList: FC<StoreListProps> = ({ stores, onEdit, onDelete, loading }) => {
  const navigate = useNavigate();
  const { selectedStore } = useSelector((root: RootState) => root.store);
  const { user } = useSelector((root: RootState) => root.user);
  const dispatch = useDispatch();

  const onSelectStore = (storeInfo: IStore) => {
    setLocalStorage(appConstant.SELECTED_STORE_ID, storeInfo?.id);
    dispatch(setSelectedStoreId(storeInfo));
    if (user.role === roleConfig.CLIENT) {
      navigate(`/store/${storeInfo.id}/dashboard`);
    } else {
      navigate(`/store/${storeInfo.id}/analytics`);
    }
  };

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
      dataSource={
        !loading
          ? [
              ...stores,
              {
                name: "newStore",
                logo: "",
                description: "",
                createdAt: "",
                storeCategory: "ecom_clothing_template",
                subdomain: "",
                siteType: "website",
              },
            ]
          : []
      }
      loading={loading}
      renderItem={(store: IStore) => {
        if (loading) return <></>;
        if (store.name && store.name === "newStore" && (user?.role === roleConfig.ADMIN || user?.role === roleConfig.SUPERADMIN)) {
          return (
            <List.Item>
              <Card
                className='add_store_card'
                onClick={() => {
                  dispatch(setSelectedTemplate(""));
                  navigate("/create/store");
                }}>
                <Plus size={60} style={{ color: DEFAULT_THEME.brand.brandColor }} />
              </Card>
            </List.Item>
          );
        } else if (store.name === "newStore") {
          return <></>;
        } else {
          return (
            <List.Item>
              <Card
                onClick={() => dispatch(setSelectedStoreId(store))}
                // className={`${selectedStore?.id === store.id ? "selected_store" : ""} store_card`}
                className={` store_card`}
                actions={[
                  <Tooltip title='Edit'>
                    <Button key='edit' type='text' icon={<EditOutlined />} onClick={() => onEdit(store)} />
                  </Tooltip>,
                  // <Button key='manage' type='text' icon={<ShopOutlined />} onClick={() => onManage(store.id as string)} />,
                  <Tooltip title='Manage Store'>
                    <Button
                      key='manage'
                      type='text'
                      icon={<ShopOutlined />}
                      onClick={() => {
                        onSelectStore(store);
                      }}
                    />
                  </Tooltip>,
                  // <Tooltip title='Site Update'>
                  //   <Button
                  //     key='manage'
                  //     type='text'
                  //     icon={<SettingOutlined />}
                  //     onClick={() => {
                  //       dispatch(setSelectedStoreId(store));
                  //       navigate(`/store/configuration/${store?.id}`);
                  //     }}
                  //   />
                  // </Tooltip>,

                  <Button type='text' danger onClick={() => onDelete(store)} icon={<DeleteOutlined />} />,
                ]}>
                <Card.Meta
                  title={
                    <Space style={{ width: "100%", justifyContent: "space-between", alignItems: "start" }}>
                      <Space size={0}>
                        <h3>{store.name}</h3>{" "}
                        {store.isPublished && store.publishUrl && (
                          <Tooltip title='Visit Website'>
                            <Button
                              target='_blank'
                              type='link'
                              href={
                                selectedStore?.customDomain?.hostname
                                  ? `https://${selectedStore.customDomain.hostname}`
                                  : `https://${store.publishUrl}`
                              }
                              icon={<GlobalOutlined />}
                            />
                          </Tooltip>
                        )}
                      </Space>
                      <Avatar src={store.favicon} size='large' />
                    </Space>
                  }
                  description={
                    <Space direction='vertical' size='small'>
                      <div>{store.description.length > 30 ? `${store.description.substring(0, 30)}...` : store.description}</div>
                      <div>Created: {moment(store.createdAt).format("DD-MM-YYYY")}</div>
                      {/* <Tag color={getStatusColor(store?.status)}>{store.status?.toUpperCase()}</Tag> */}
                      <Space>
                        {/* {store?.currentVersion && <Tag color='blue'>Current V - {store.currentVersion}</Tag>}
                        {store?.currentVersion !==
                          templateVersions.filter((f) => f.storeCategory === store.storeCategory)[0]?.latestVersion && (
                          <Tag color='green'>
                            Latest V - {templateVersions.filter((f) => f.storeCategory === store?.storeCategory)[0]?.latestVersion}
                          </Tag>
                        )} */}
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          );
        }
      }}
    />
  );
};

export default StoreList;
