import React, { useEffect, useState } from "react";
import { Button, Flex, Form, FormInstance, Input, message, Popconfirm, Radio, Result, Space } from "antd";
import { RootState } from "../../../store/types/store";
import { useDispatch, useSelector } from "react-redux";
import createSiteService from "../../../services/createSiteService";
import storeService, { IStore } from "../../../services/storeService";
import { onSetRefresh, setIsPublishing, setLoading, setSelectedStoreId, setTemplateVersions } from "../../../store/reducers/storeSlice";
import useApiCaller from "../../CustomHook/useAPICaller";
import PreviewSite from "../../CheckSite/PreviewSite";
import DeployStatus from "../../DeployedStatus/DeployedStatus";
import { ArrowLeft } from "lucide-react";
import { ArrowLeftOutlined } from "@ant-design/icons";

export interface PublishConfig {
  domain: string;
  appType: string;
}

const PublishSiteButton: React.FC = ({}) => {
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
        appType: selectedStore?.appType ? selectedStore?.appType : selectedStore?.appType,
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
        <>
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
              <Button
                loading={publishing}
                disabled={
                  selectedStore?.storeCategory !== "landing-page-bloomi5" &&
                  (selectedStore?.subscriptionPlanId === null || selectedStore?.paymentStatus === "PENDING")
                }
                type='primary'
                className='custom-btn-gradient'>
                {selectedStore?.isPublished ? "Re-Publish" : "Publish Store"}
              </Button>
            </Popconfirm>
          </Flex>
        </>
      </section>
    </>
  );
};

export default PublishSiteButton;
