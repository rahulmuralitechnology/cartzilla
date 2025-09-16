import React, { FC, useEffect } from "react";
import { Card, Steps, Button, Space, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ArrowLeft } from "lucide-react";
import { ISiteType, IWebsiteType } from "../../services/interfaces/common";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setAllTemplates, setSelectedSiteType } from "../../store/reducers/storeSlice";
import templateService from "../../services/templateService";

const SelectTemplate: FC<{ onNext: (stp: number) => void }> = ({ onNext }) => {
  const dispatch = useDispatch();
  const { selectedSiteType } = useSelector((state: RootState) => state.store);
  const websiteTypes: IWebsiteType[] = [
    {
      title: "E-Commerce Store",
      key: "webapp",
      image: "/assets/e-com-background.jpg",
    },
    {
      title: "Business Website",
      key: "website",
      image: "/assets/website.jpg",
    },
    // {
    //   title: "Portfolio Website",
    //   key: "portfolio",
    //   image: "/assets/portfolio.svg",
    // },
  ];

  const onSelectSite = (type: ISiteType) => {
    console.log(type);
    dispatch(setSelectedSiteType(type));
  };

  const getAllTemplates = async () => {
    try {
      const result = await templateService.getAllTemplates(false);
      dispatch(setAllTemplates(result.data.templates));
    } catch (error: any) {}
  };

  useEffect(() => {
    getAllTemplates();
  }, []);

  return (
    <div className='selection-content'>
      <h1>
        Select a <span className='highlight'>Website</span> type
      </h1>
      <p className='subtitle'>choose a site you want to create</p>

      <div className='website-types-grid'>
        {websiteTypes.map((type, index) => (
          <div key={index} className='website-type-container' onClick={() => onSelectSite(type.key)}>
            <Card hoverable className={`website-type-card ${selectedSiteType === type.key && "selected-card"}`}>
              <img alt={type.title} src={type.image} />
            </Card>
            <h3 className={`website-type-title `}>{type.title}</h3>
          </div>
        ))}
      </div>

      <div className='action-section'>
        <p>Start Building your website in few steps!</p>
        <Space size='middle' className='action-btns'>
          <Button type='link' href='/' className='setup-button action-back '>
            <ArrowLeft /> Back
          </Button>
          <Button type='primary' onClick={() => onNext(1)} className='setup-button custom-btn-gradient'>
            Select Website <ArrowRightOutlined />
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default SelectTemplate;
