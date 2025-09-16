import React, { useEffect, useState } from "react";
import { Button, Flex, Form, FormInstance, Input, message, Popconfirm, Radio, Result, Space } from "antd";
import { RootState } from "../../store/types/store";
import { useDispatch, useSelector } from "react-redux";
import createSiteService from "../../services/createSiteService";
import storeService, { IStore } from "../../services/storeService";
import { onSetRefresh, setIsPublishing, setLoading, setSelectedStoreId, setTemplateVersions } from "../../store/reducers/storeSlice";
import { setLocalStorage } from "../../services/utils";
import useApiCaller from "../CustomHook/useAPICaller";
import PreviewSite from "../CheckSite/PreviewSite";
import DeployStatus from "../DeployedStatus/DeployedStatus";
import { ArrowLeft, Home } from "lucide-react";
import { ArrowLeftOutlined, HomeOutlined, RocketOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DeploymentWaitingScreen from "../DeploymentWaitScreen/DeploymentWaitScreen";
import BeforePublishUI from "./BeforePublishUI/BeforePublishUI";

export interface PublishConfig {
  domain: string;
  appType: string;
}

interface PublishFormProps {
  publishForm: FormInstance;
  onNext: (stp: number) => void;
}

const PublishForm: React.FC<PublishFormProps> = ({ publishForm, onNext }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedStore, loading, refresh, publishing, templateVersions } = useSelector((state: RootState) => state.store);
  const { startApiCall, stopApiCall } = useApiCaller();

  useEffect(() => {
    if (selectedStore?.id && selectedStore.publishUrl && !selectedStore.buildStatus) {
      startApiCall(selectedStore.id, "deploying");
    }
    return () => stopApiCall();
  }, [selectedStore]);

  const updateStore = async (operation: string) => {
    try {
      const domain = operation === "create" ? `${selectedStore?.subdomain}` : selectedStore?.domain;
      const response = await storeService.updateStore({
        ...(selectedStore as IStore),
        isPublished: operation === "delete" ? false : true,
        publishUrl: operation === "delete" ? "" : `${domain}`,
        previewUrl: operation === "delete" ? "" : `${domain}`,
        domain: domain,
        appType: selectedStore?.appType ? selectedStore.appType : publishForm.getFieldValue("appType"),
        buildStatus: operation === "update" ? false : selectedStore?.buildStatus,
        currentVersion: templateVersions || "0.0.1",
        isCustomDomain: operation === "create" ? false : (selectedStore?.isCustomDomain as boolean),
      });
      // message.success("Website is publish successfully");

      dispatch(onSetRefresh(!refresh));
      dispatch(setSelectedStoreId(response.data.store));
    } catch (error: any) {
      console.log("Failed to update store", error);
      message.error(error.message);
    }
  };

  const onSubmitSite = async (operation: string) => {
    try {
      setLoading(true);
      if (operation !== "delete") {
        dispatch(setIsPublishing(true));
      }
      const res = await createSiteService.createSite({
        domain: operation === "create" ? `${selectedStore?.subdomain}` : (selectedStore?.domain as string),
        storeId: selectedStore?.id as string,
        storeCategory: selectedStore?.storeCategory as string,
        operation,
        siteType: selectedStore?.siteType as string,
        uniqueId: selectedStore?.uniqueId,
      });
      await updateStore(operation);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setLoading(false);
      dispatch(setIsPublishing(false));
    }
  };

  return (
    <>
      <section className='publish-continer'>
        {publishing ? (
          <DeploymentWaitingScreen />
        ) : (
          <>
            {selectedStore?.isPublished ? <PreviewSite /> : <BeforePublishUI />}

            <Flex align='center' justify='center' gap={30}>
              <Popconfirm
                title={`Are you sure want to publish?`}
                onConfirm={() => {
                  if (selectedStore?.isPublished) {
                    onSubmitSite("update");
                  } else {
                    onSubmitSite("create");
                  }
                }}
                okText='Yes'
                cancelText='No'>
                <Button type='primary' icon={<RocketOutlined />} className='custom-btn-gradient publish-btn'>
                  {selectedStore?.isPublished ? "Re-Publish" : <>Publish {selectedStore?.siteType === "webapp" ? "Store" : "Site"}</>}
                </Button>
              </Popconfirm>
              {selectedStore?.isPublished && (
                <Space size='middle'>
                  <Button type='default' onClick={() => navigate("/store-list")} style={{ width: "140px", height: 40 }}>
                    <HomeOutlined /> Go Home
                  </Button>
                  <Popconfirm
                    title={`Are you sure want to delete?`}
                    onConfirm={() => {
                      onSubmitSite("delete");
                    }}
                    okText='Yes'
                    cancelText='No'>
                    <Button danger type='primary' style={{ width: "140px", height: 40 }}>
                      Delete {selectedStore?.siteType === "webapp" ? "Store" : "Site"}
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            </Flex>
          </>
        )}
      </section>
    </>
  );
};

export default PublishForm;
