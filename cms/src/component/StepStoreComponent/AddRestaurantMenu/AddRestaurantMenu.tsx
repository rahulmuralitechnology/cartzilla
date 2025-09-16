import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, Row, Col, Space, Tag, message } from "antd";
import { ArrowRightOutlined, DownloadOutlined } from "@ant-design/icons";
import "./AddRestaurantMenu.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import AddMenuForm from "../../Template/Restaurant/AddMenuForm";

const AddRestaurantMenu: React.FC<{ onNext: (stp: number) => void }> = ({ onNext }) => {
  const { selectedSiteType, selectedTemplate, selectedStore } = useSelector((state: RootState) => state.store);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  return (
    <div className='add-menu-container'>
      <div className='store-details-content'>
        <div className='form-section'>
          <h1>
            Add <span className='highlight'>Store</span> Menu <Tag color='blue'>{selectedStore?.name.toUpperCase()}</Tag>
          </h1>
          <p className='subtitle'>Manage Restaurant Menu</p>
          <p style={{ margin: "0 0 10px 0" }}>
            Dummy menu list{" "}
            <Button type='link' href={"./assets/dummy_menu_items.xlsx"} download={true} icon={<DownloadOutlined />} style={{ padding: 0 }}>
              Download Sample
            </Button>
          </p>
          <AddMenuForm />
        </div>
      </div>
      <div className='button-group'>
        <Space size='middle'>
          <Button type='default' onClick={() => onNext(0)} className='back-btn'>
            Back
          </Button>
          <Button type='primary' onClick={() => onNext(3)} loading={createLoading} className='custom-btn-gradient next-btn'>
            Next <ArrowRightOutlined />
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default AddRestaurantMenu;
