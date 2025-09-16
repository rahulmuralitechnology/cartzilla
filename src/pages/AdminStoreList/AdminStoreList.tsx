import { FC, useState } from "react";
import { Layout, Button, message, Modal, Flex, Input } from "antd";
import { ArrowRightOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import StoreList from "../../component/stores/StoreList";
import StoreForm from "../../component/stores/StoreForm";
import { StoreFormData } from "../../store/types/store";
import { addStore, updateStore, deleteStore, setLoading, setStores, setFormOpen } from "../../store/reducers/storeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import storeService, { IStore } from "../../services/storeService";
import React from "react";
import appService from "../../services/appService";
import roleConfig from "../../config/roleConfig";
import createSiteService from "../../services/createSiteService";
import authService from "../../services/authService";

const { Content } = Layout;

const AdminStoreList: FC<{}> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [subdomain, setSubdomain] = useState<string>("");
  const { stores, loading, formOpen, refresh: storeRefresh, selectedStore } = useSelector((state: RootState) => state.store);
  const { user } = useSelector((state: RootState) => state.user);
  const [editingStore, setEditingStore] = useState<IStore | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const { storeId } = useParams() as { storeId: string };

  const checkSubdomain = async (storeName: string) => {
    try {
      const res = await appService.checkSubdomain(storeName);
      setSubdomain(res.subdomain);
      return res.subdomain;
    } catch (error) {
      throw Error("Failed to check subdomain");
    }
  };

  const handleAddEdit = async (values: StoreFormData) => {
    setCreateLoading(true);
    if (editingStore) {
      try {
        const response = await storeService.updateStore({
          ...values,
          id: editingStore.id,
        });
        message.success("Store updated successfully");
        setCreateLoading(false);
        dispatch(setFormOpen(false));
        setRefresh(!refresh);
      } catch (error: any) {
        console.log("Failed to update store", error);
        message.error(error.message);
        setCreateLoading(false);
      }
    } else {
      try {
        const domain = await checkSubdomain(values.name);
        const response = await storeService.createStore(
          {
            ...values,
            subdomain: domain as string,
            userId: user?.id as string,
          },
          couponCode
        );
        setCreateLoading(false);
        dispatch(setFormOpen(false));
        setSubdomain("");
        setEditingStore(null);
        setRefresh(!refresh);
        message.success("Store created successfully");
      } catch (error: any) {
        setCreateLoading(false);
        console.log("Failed to add store", error);
        message.error(error.message);
      }
    }
  };

  const onDeleteStore = async (store: IStore) => {
    try {
      if (store?.isPublished) {
        const res = await createSiteService.createSite({
          domain: store?.subdomain as string,
          storeId: store?.id as string,
          storeCategory: store?.storeCategory as string,
          operation: "delete",
          siteType: store?.siteType as string,
          uniqueId: store?.uniqueId as string,
        });
      }

      const response = await storeService.deleteStore(store?.id as string);
      localStorage.removeItem("selectedStore");
      localStorage.removeItem("currentStep");
      message.success("Store deleted successfully");
      setRefresh(!refresh);
    } catch (error) {
      console.log("Failed to delete store", error);
      message.error("Failed to delete store");
    }
  };

  const fetchAllStore = async () => {
    try {
      dispatch(setLoading(true));
      const response = await storeService.getAllStoreList();
      if (response?.data?.stores?.length === 0) {
        navigate("/");
      }
      dispatch(setStores(response.data.stores.reverse()));
    } catch (error) {
      console.log("Failed to fetch store", error);
      message.error("Failed to fetch stores");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = (store: IStore) => {
    let inputValue = "";
    let modal: any = null;

    modal = Modal.confirm({
      title: "Are you sure you want to delete this store?",
      content: (
        <div>
          <p>This action cannot be undone.</p>
          <p>
            Please type <b>{store.name}</b> to confirm:
          </p>
          <Input
            autoFocus
            style={{ width: "100%" }}
            onChange={(e) => {
              inputValue = e.target.value;
              // Enable/disable the OK button based on input
              if (modal) {
                modal.update({
                  okButtonProps: {
                    disabled: inputValue !== store.name,
                  },
                });
              }
            }}
          />
        </div>
      ),
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      okButtonProps: { disabled: true },
      onOk: () => {
        onDeleteStore(store);
        dispatch(deleteStore(store?.id as string));
      },
    });
  };

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchAllStore();
    }
  }, [refresh]);
  console.log("selectedStore", selectedStore);

  const onNextStep = () => {
    if (selectedStore?.storeCategory === "landing-page-bloomi5") {
      navigate(`/store/${storeId}/cms/page/homepage`);
    } else if (selectedStore?.subscriptionPlanId && selectedStore.paymentStatus !== "PENDING") {
      navigate(`/store/configuration/${selectedStore?.id}`);
    } else {
      navigate(`/store/payment/${selectedStore?.id}`);
    }
  };

  return (
    <section className='bloomi5_page store-list-page'>
      <Content>
        <StoreList
          stores={stores}
          loading={loading}
          onEdit={(store) => {
            setEditingStore(store);
            dispatch(setFormOpen(true));
          }}
          onDelete={handleDelete}
        />

        {!loading && stores.length > 0 && selectedStore && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type='primary'
              className='custom-btn-gradient'
              style={{ width: "160px", marginTop: 20, boxShadow: "none" }}
              onClick={() => onNextStep()}>
              Next <ArrowRightOutlined />
            </Button>
          </div>
        )}

        <StoreForm
          visible={formOpen}
          initialValues={editingStore || undefined}
          onCancel={() => {
            dispatch(setFormOpen(false));
            setEditingStore(null);
          }}
          onSubmit={handleAddEdit}
          loading={createLoading}
        />
      </Content>
    </section>
  );
};

export default AdminStoreList;
