import { Button, Card, Col, Row, Tag } from "antd";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store";

const PageCards: FC = () => {
  const navigate = useNavigate();
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const { storeId } = useParams() as { storeId: string };
  const pages = [
    { key: "1", name: "Home Page", status: "Published", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/homepage` },
    { key: "2", name: "About Us", status: "Published", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/aboutus` },
    { key: "4", name: "Contact", status: "Published", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/contact` },
    { key: "6", name: "Blog", status: "Published", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/blogs` },
    // {
    //   key: "custom_section",
    //   name: "Custom Section",
    //   status: "Published",
    //   thumbnail: "[Thumbnail]",
    //   pathname: `/store/${storeId}/cms/page/custom_section`,
    // },
    // { key: "7", name: "FAQ", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/faq` },
  ];

  if (selectedStore?.siteType === "webapp") {
    pages.push(
      ...[
        {
          key: "9",
          name: "Advertisement",
          status: "Draft",
          thumbnail: "[Thumbnail]",
          pathname: `/store/${storeId}/cms/page/advertisement`,
        },
        { key: "8", name: "Banner", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/banner` },
      ]
    );
  }

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory !== "landing-page-bloomi5" && selectedStore.storeCategory !== "ecom_petstore_template") {
    pages.push(
      ...[
        { key: "3", name: "Services", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/services` },
        // { key: "10", name: "Testimonial", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/testimonial` },
        { key: "11", name: "Our Work", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/ourwork` },
        { key: "12", name: "Gallery", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/gallery` },
      ]
    );
  }
  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    pages.push(
      ...[
        { key: "faq", name: "FAQ", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/faq` },
        // { key: "10", name: "Testimonial", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/testimonial` },
        { key: "meal", name: "Meal Plans", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/meal` },
        { key: "reason", name: "Reasons", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/reason` },
        { key: "brand", name: "Brand", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/brand` },
        { key: "profile", name: "Profile", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/profile` },
        { key: "navigation", name: "Navigation", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/navigation` },
        { key: "footer", name: "Footer", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/footer` },
        { key: "social", name: "Social Links", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/social` },
      ]
    );
  }
  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "landing-page-bloomi5") {
    pages.push(
      ...[
        { key: "ecom", name: "Ecommerce", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/ecommerce` },
        { key: "seo", name: "Seo", status: "Draft", thumbnail: "[Thumbnail]", pathname: `/store/${storeId}/cms/page/seo` },
        {
          key: "website-service",
          name: "Website Service",
          status: "Draft",
          thumbnail: "[Thumbnail]",
          pathname: `/store/${storeId}/cms/page/website_service`,
        },
      ]
    );
  }

  return (
    <div className='pages_card_container'>
      <Row gutter={[16, 16]}>
        {pages.map((page) => (
          <Col key={page.key} span={6} className='page_card_col'>
            <Card
              onClick={() => navigate(page.pathname)}
              className='page_card'
              // cover={<div className='thumbnail'>{page.thumbnail}</div>}
              actions={[
                <Tag color={page.status === "Published" ? "green" : "green"}>Published</Tag>,
                <Button type='link' onClick={() => navigate(page.pathname)} style={{ width: "100%" }}>
                  Edit
                </Button>,
              ]}>
              {/* <Card.Meta title={page.name} style={{ marginBottom: 10 }} /> */}
              <h2>{page.name}</h2>
            </Card>
          </Col>
        ))}
        {/* <Col span={6}>
          <Card>
            <div className='new-card'>[+] New</div>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default PageCards;
