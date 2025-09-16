import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Flex, Form, message, Space } from "antd";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { IBloomi5LandingPage, RestaurantConfig, SliderConfig, StoreSiteConfig } from "../../../services/interfaces/siteConfig";
import siteConfigService from "../../../services/siteConfigService";
import { ISiteType } from "../../../services/interfaces/common";
import { LandingSiteConfig } from "../../../services/interfaces/SiteForm";
import { setSiteConfig } from "../../../store/reducers/storeSlice";
import HomePageForm from "./HomePage";
import AboutUsForm from "./AboutPage";
import ContactForm from "./ContactPage";
import FAQSection from "./FAQSection";
import BannerForm from "./BannerForm";
import AdvertisementForm from "./AdvertisementForm";
import Testimonial from "./Testimonial";
import MealPlansForm from "./MealPlans";
import ReasonsForm from "./Reasons";
import BrandForm from "./BrandForm";
import ProfileForm from "./ProfileForm";
import NavigationForm from "./NavigationForm";
import FooterForm from "./FooterForm";
import SocialForm from "./SocialForm";
import Gallery from "./Gallery";
import ServiceForm from "./ServiceForm";
import CustomSection from "./CustomSection";
import CreatedSections from "../../SectionBuilder/CreatedSectionList";
import { PlusOutlined } from "@ant-design/icons";
import Ecommerce from "./Bloomi5/Ecommerce";
import Seo from "./Bloomi5/Seo";
import WebsiteService from "./Bloomi5/WebsiteService";

const StorePageForm: FC = () => {
  const [form] = Form.useForm();
  const params = useParams() as { pagename: string };
  const dispatch = useDispatch();
  const { selectedStore, siteConfig } = useSelector((state: RootState) => state.store);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const PageInfo: any = {
    homepage: {
      title: "Home Page",
      component: <HomePageForm form={form} />,
    },
    aboutus: {
      title: "About Us",
      component: <AboutUsForm form={form} />,
    },
    services: {
      title: "Services",
      component: <ServiceForm form={form} />,
    },
    contact: {
      title: "Contact",
      component: <ContactForm form={form} />,
    },
    faq: {
      title: "FAQ",
      component: <FAQSection form={form} />,
    },
    banner: {
      title: "Banner",
      component: <BannerForm form={form} />,
    },
    advertisement: {
      title: "Advertisement",
      component: <AdvertisementForm form={form} />,
    },
    testimonial: {
      title: "Testimonial",
      component: <Testimonial form={form} />,
    },
    ourwork: {
      title: "Our Work",
      component: <Testimonial form={form} />,
    },
    gallery: {
      title: "Gallery",
      component: <Gallery form={form} />,
    },
    custom_section: {
      title: "Created Section",
      component: <CreatedSections />,
    },
    create_section: {
      title: "Custom Section",
      component: <CustomSection />,
    },
    ecommerce: {
      title: "Ecommerce",
      component: <Ecommerce form={form} />,
    },
    seo: {
      title: "Ecommerce",
      component: <Seo form={form} />,
    },
    website_service: {
      title: "Website Service",
      component: <WebsiteService form={form} />,
    },
    meal: {
      title: "Meal Plans",
      component: <MealPlansForm form={form} />,
    },
    reason: {
      title: "Reasons",
      component: <ReasonsForm form={form} />,
    },
    brand: {
      title: "Brand",
      component: <BrandForm form={form} />,
    },
    profile: {
      title: "Profile",
      component: <ProfileForm form={form} />,
    },
    navigation: {
      title: "Navigation",
      component: <NavigationForm form={form} />,
    },
    footer: {
      title: "Footer",
      component: <FooterForm form={form} />,
    },
    social: {
      title: "Social",
      component: <SocialForm form={form} />,
    },
  };

  const transformSiteConfigForSave = (values: any) => {
    const transformed = { ...values };

    // Transform colors from objects to hex strings
    if (transformed.brand?.colors) {
      if (typeof transformed.brand.colors.primary === 'object') {
        transformed.brand.colors.primary = transformed.brand.colors.primary.toHexString?.() || '#ff9800';
      }
      if (typeof transformed.brand.colors.secondary === 'object') {
        transformed.brand.colors.secondary = transformed.brand.colors.secondary.toHexString?.() || '#2a1a11';
      }
    }

    // Ensure social is an array (not socialLinks object)
    if (transformed.socialLinks && !transformed.social) {
      transformed.social = Object.entries(transformed.socialLinks).map(([platform, url]) => ({
        platform,
        url,
        icon: platform
      }));
      delete transformed.socialLinks;
    }

    return transformed;
  };

  const onFinish = async (values: StoreSiteConfig) => {
    try {
      const validateField = await form.validateFields();
      setLoading(true);
      // Transform the data before saving
      const transformedValues = transformSiteConfigForSave(values);
      let newSiteconfig = { ...siteConfig };

      if (selectedStore?.siteType === "webapp") {
        let slider: SliderConfig = { enabled: false };
        if (values?.slider && values?.slider?.enabled) {
          slider = { ...values.slider };
        }

        if (!values?.banner) {
          values = {
            ...values,
            banner: {
              enabled: false,
              banners: [],
            },
          };
        }
        newSiteconfig = { ...newSiteconfig, slider };
      }

      const response = await siteConfigService.saveSiteConfig({
        ...newSiteconfig,
        ...values,
        siteType: selectedStore?.siteType as ISiteType,

        storeId: selectedStore?.id,
        userId: selectedStore?.userId,
      });

      message.success("Configuration saved successfully!");
      setRefresh(!refresh);
    } catch (error: any) {
      console.log(error);
      if (error?.errorFields?.length) {
        message.error("Fields are missing");
      } else {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
      // In StorePageForm.tsx - Update the pet store mapping
      if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
        const storeConfig = response.data.siteConfig as any;

        // Set all the form fields according to the new structure
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
        form.setFieldValue("social", storeConfig?.social); // Changed from socialLinks to social
        form.setFieldValue("footer", storeConfig?.footer);
        form.setFieldValue("profile", storeConfig?.profile);

        // Convert color objects to hex strings if needed
        if (storeConfig?.brand?.colors?.primary && typeof storeConfig.brand.colors.primary === 'object') {
          form.setFieldValue(["brand", "colors", "primary"], storeConfig.brand.colors.primary.metaColor?.toHexString?.() || '#ff9800');
        }
        if (storeConfig?.brand?.colors?.secondary && typeof storeConfig.brand.colors.secondary === 'object') {
          form.setFieldValue(["brand", "colors", "secondary"], storeConfig.brand.colors.secondary.metaColor?.toHexString?.() || '#2a1a11');
        }
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
      if (response.data.siteConfig.siteType === "website" && selectedStore?.storeCategory === "landing-page-bloomi5") {
        const storeConfig = response.data.siteConfig as IBloomi5LandingPage;
        form.setFieldValue("hero", storeConfig?.hero);
        form.setFieldValue("about", storeConfig?.about);
        form.setFieldValue("ecommerce", storeConfig?.ecommerce);
        form.setFieldValue("seo", storeConfig?.seo);
        form.setFieldValue("websiteServices", storeConfig?.websiteServices);
      }
      form.setFieldValue("contact", response?.data.siteConfig?.contact);
      form.setFieldValue("faq", response?.data.siteConfig?.faq);
    } catch (error: any) {
      console.log("site config error ", error);
      // message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getSiteConfig(selectedStore?.id as string);
    }
  }, [selectedStore?.id, refresh]);

  return (
    <section>
      <Flex justify='space-between' align='center' style={{ marginBottom: 15 }}>
        <h2>{PageInfo[params?.pagename]?.title} </h2>
        <Space>
          <Button type='text' icon={<ArrowLeft />} onClick={() => navigate(-1)} className='back-button'>
            Go Back
          </Button>

          {params?.pagename !== "create_section" && params.pagename !== "custom_section" && (
            <Button className='save_button' type='dashed' onClick={() => form.submit()} loading={loading}>
              Save
            </Button>
          )}

          {params?.pagename === "custom_section" && (
            <Button type='primary' icon={<PlusOutlined />} onClick={() => navigate(`/store/${selectedStore?.id}/cms/page/create_section`)}>
              Create New Section
            </Button>
          )}
        </Space>
      </Flex>
      <div className='site_form_container'>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          {PageInfo[params?.pagename]?.component}
        </Form>
      </div>
    </section>
  );
};

export default StorePageForm;
