import React, { FC, useEffect, useState } from "react";
import { Card, Steps, Button, Space, message } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setSelectedSiteType, setSelectedTemplate, setTemplateVersions } from "../../store/reducers/storeSlice";
import { IWebsiteType, IRequestCustomTheme } from "../../services/interfaces/common";
import { useNavigate } from "react-router-dom";
import RequestCustomTheme from "../RequestCustomTheme/RequestingCustomTheme";
import appService from "../../services/appService";
import { TemplateItem } from "../../services/storeService";
import { Template } from "../../services/interfaces/template";
import templateService from "../../services/templateService";
import roleConfig from "../../config/roleConfig";

const SelectTemplate: FC<{ onNext: (stp: number) => void }> = ({ onNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedSiteType, selectedTemplate, templateList } = useSelector((state: RootState) => state.store);
  const { user } = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSubmit = async (values: IRequestCustomTheme) => {
    try {
      const result = await appService.requestCustomeTheme({ ...values, userId: user?.id });
      message.success("Thank you! we will notify you when its created");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsModalOpen(false);
    }
  };

  const onSelectSite = (type: string) => {
    dispatch(setSelectedTemplate(type));
  };

  const onClickNext = () => {
    if (!selectedTemplate) {
      message.info("Please select a template");
    } else {
      onNext(2);
    }
  };

  return (
    <div className='selection-content'>
      <h1>
        Select a <span className='highlight'>Template</span> type
      </h1>
      <p className='subtitle'>choose a store you want to create</p>
      <Button type='link' style={{ color: "var(--primary-color)" }} onClick={() => setIsModalOpen(true)}>
        Request Custom theme
      </Button>

      <div className='website-types-grid'>
        {templateList
          .filter((t) => t.templateType === selectedSiteType && t.isActive)
          .map((theme: Template, index: number) => {
            return (
              <div key={index} className='website-type-container'>
                <Card
                  hoverable
                  className={`website-type-card ${selectedTemplate === theme.repoDirName && "selected-card"}`}
                  onClick={() => {
                    onSelectSite(theme.repoDirName);
                    dispatch(setTemplateVersions(theme.latestVersion));
                  }}>
                  <img alt={theme.name} src={theme.previewImage} />
                </Card>
                <h3 className={`website-type-title ${selectedTemplate === theme.repoDirName && "selected-site-type"}`}>{theme.name}</h3>
              </div>
            );
          })}
      </div>

      <div className='action-section'>
        <p>Start Building your website in few steps!</p>
        <Space size='middle' className='action-btns'>
          <Button type='link' onClick={() => onNext(0)} className='setup-button action-back '>
            <ArrowLeftOutlined /> Back
          </Button>
          <Button type='primary' onClick={onClickNext} className='setup-button custom-btn-gradient'>
            Select Template <ArrowRightOutlined />
          </Button>
        </Space>
      </div>

      <RequestCustomTheme isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
};

export default SelectTemplate;
