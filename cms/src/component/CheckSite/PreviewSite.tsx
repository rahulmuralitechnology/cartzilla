import React from "react";
import { Button, Steps } from "antd";
import "./PreviewStyle.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Link } from "lucide-react";
import { getAppType, getURL } from "../../services/utils";
import { ISiteType } from "../../services/interfaces/common";

const PreviewSite: React.FC = () => {
  const { selectedStore, loading, refresh, publishing } = useSelector((state: RootState) => state.store);
  return (
    <div className='preview-container'>
      <div className='preview-content'>
        <h1>
          Preview <span className='highlight'>Your</span> {getAppType(selectedStore?.siteType as ISiteType)}
        </h1>

        <div className='preview-frame'>
          <div className='browser-frame'>
            <div className='browser-header'>
              <div className='browser-actions'>
                <span className='browser-dot'></span>
                <span className='browser-dot'></span>
                <span className='browser-dot'></span>
              </div>
              <div className='browser-address-bar'>
                <span>{getURL(selectedStore?.publishUrl as string)}</span>
              </div>
              <a href={getURL(selectedStore?.publishUrl as string)} target='_blank'>
                <Link />
              </a>
            </div>
            <div className='browser-content'>
              <iframe src={getURL(selectedStore?.publishUrl as string)} title='Website Preview' className='preview-iframe' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSite;
