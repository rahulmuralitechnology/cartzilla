import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Switch,
  DatePicker,
  Button,
  Card,
  Collapse,
  Space,
  ColorPicker,
  message,
  Typography,
  Layout,
  Flex,
  Select,
  Divider,
  FormInstance,
  Row,
  Col,
  UploadFile,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, SettingFilled, UploadOutlined } from "@ant-design/icons";
import type { RestaurantConfig, SliderConfig, StoreSiteConfig } from "../../services/interfaces/siteConfig";
import { Content } from "antd/es/layout/layout";
import siteConfigService, { SiteTypeConfig } from "../../services/siteConfigService";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { onPreviewFile } from "../../services/utils";
import { onSetRefresh, setSiteConfig } from "../../store/reducers/storeSlice";
import Interiors from "../../component/SiteForm/Interiors";
import PetStore from "../../component/SiteForm/petStore";
import { LandingSiteConfig } from "../../services/interfaces/SiteForm";
import UploadInput from "../../component/common/UploadInput";
import RestaurantConfigForm from "../../component/SiteForm/RestorentForm";
import WebAppForm from "../../component/SiteForm/WebApp";

const { Panel } = Collapse;
const { TextArea } = Input;
const { Title } = Typography;

const SiteConfig: React.FC<{ form: FormInstance; loading: boolean; setLoading: (v: boolean) => void }> = ({
  form,
  loading,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const { selectedStore, selectedSiteType, selectedTemplate } = useSelector((state: RootState) => state.store);
  const params = useParams() as { storeId: string };

  const getSiteConfig = async (storeId: string) => {
    try {
      setLoading(true);
      const response = await siteConfigService.getSiteConfig(storeId);
      dispatch(setSiteConfig(response.data.siteConfig));
      if (response.data.siteConfig.siteType === "webapp") {
        const storeConfig = response.data.siteConfig as StoreSiteConfig;
        form.setFieldValue("banner", storeConfig?.banner);
        form.setFieldValue("slider", storeConfig?.slider);
        form.setFieldValue("socialMedia", storeConfig?.socialMedia);
        form.setFieldValue("hero", storeConfig?.hero);
        form.setFieldValue("gstInfo", storeConfig?.gstInfo);
        form.setFieldValue("about", storeConfig?.about);
      }
      if (response.data.siteConfig.siteType === "website" && selectedStore?.storeCategory === "website_interiors_template") {
        console.log("hit33");
        const storeConfig = response.data.siteConfig as LandingSiteConfig;
        form.setFieldValue("siteInfo", storeConfig?.siteInfo);
        form.setFieldValue("hero", storeConfig?.hero);
        form.setFieldValue("contact", storeConfig?.contact);
        form.setFieldValue("about", storeConfig?.about);
        form.setFieldValue("services", storeConfig?.services);
        // form.setFieldValue("gallery", storeConfig?.gallery);
        form.setFieldValue("portfolio", storeConfig?.portfolio);
        form.setFieldValue("footer", storeConfig?.footer);
        form.setFieldValue("navbar", storeConfig?.navbar);
        form.setFieldValue("testimonials", storeConfig?.navbar);
        form.setFieldValue("gallery", storeConfig?.gallery);
        form.setFieldValue("testimonials", storeConfig?.testimonials);
        form.setFieldValue("hero", storeConfig?.hero);
      }

      if (response.data.siteConfig.siteType === "website" && selectedStore?.storeCategory === "ecom_petstore_template") {
        console.log("hit33");
        const storeConfig = response.data.siteConfig as any;
        form.setFieldValue("hero", storeConfig?.hero);
        form.setFieldValue("brand", storeConfig?.brand);
        form.setFieldValue("about", storeConfig?.about);
        form.setFieldValue("aboutFounder", storeConfig?.aboutFounder);
        form.setFieldValue("mission", storeConfig?.mission);
        form.setFieldValue("vision", storeConfig?.vision);
        form.setFieldValue("description", storeConfig?.description);
        form.setFieldValue("thriveBanner", storeConfig?.thriveBanner);
        form.setFieldValue("contact", storeConfig?.contact);
        form.setFieldValue("reasons", storeConfig?.reasons);
        form.setFieldValue("mealPlans", storeConfig?.mealPlans);
        form.setFieldValue("whyChooseUs", storeConfig?.whyChooseUs);
        form.setFieldValue("faq", storeConfig?.faq);
        form.setFieldValue("brand", storeConfig?.brand);
        form.setFieldValue("navigation", storeConfig?.navigation);
        form.setFieldValue("social", storeConfig?.social);
        form.setFieldValue("footer", storeConfig?.footer);
        form.setFieldValue("profile", storeConfig?.profile);
      }

      if (response.data.siteConfig.siteType === "website" && selectedStore?.storeCategory === "website_restaurant_template") {
        const storeConfig = response.data.siteConfig as RestaurantConfig;
        form.setFieldValue("homepage", storeConfig?.homepage);
        form.setFieldValue("address", storeConfig?.address);
        form.setFieldValue("contact", storeConfig?.contact);
        form.setFieldValue("social", storeConfig?.social);
        // form.setFieldValue("gallery", storeConfig?.gallery);
        form.setFieldValue("hours", storeConfig?.hours);
      }
      form.setFieldValue("contact", response?.data.siteConfig?.contact);
    } catch (error: any) {
      console.log("site config error ", error);
      // message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.storeId) {
      getSiteConfig(params.storeId as string);
    }
  }, [params.storeId]);

  const siteForm: any = {
    webapp: <WebAppForm form={form} loading={loading} setLoading={setLoading} />,
    website_interiors_template: <Interiors form={form} loading={loading} setLoading={setLoading} />,
    ecom_petstore_template: <PetStore form={form} loading={loading} setLoading={setLoading} />,
    website_restaurant_template: <RestaurantConfigForm form={form} loading={loading} setLoading={setLoading} />,
  };

  return (
    <section className='site-form'>
      {selectedStore?.siteType === "webapp" && siteForm["webapp"]}
      {selectedStore?.siteType === "website" && siteForm[selectedStore.storeCategory]}
    </section>
  );
};

export default SiteConfig;
