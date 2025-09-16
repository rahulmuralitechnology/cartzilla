import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, Row, Col, Space, Tag, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./AddProduct.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import ProductDashboard from "../../../pages/products/ProductDashboard";

const AddProduct: React.FC<{ onNext: (stp: number) => void }> = ({ onNext }) => {
  const { selectedSiteType, selectedTemplate, selectedStore } = useSelector((state: RootState) => state.store);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const getDownloadFile = () => {
    if (selectedTemplate || selectedStore?.storeCategory === "ecom_clothing_template") {
      return "/assets/clothing.xlsx";
    } else {
      return "/assets/interior.xlsx";
    }
  };

  return (
    <div className='add-product-container'>
      <div className='store-details-content'>
        <div className='form-section'>
          <h1>
            Add <span className='highlight'>Store</span> Products <Tag color='blue'>{selectedStore?.name.toUpperCase()}</Tag>
          </h1>
          <p className='subtitle'>Manage Store Products</p>
          <p style={{ margin: "0 0 10px 0" }}>
            Dummy product list{" "}
            <a href={getDownloadFile()} download={true}>
              Download Sample
            </a>
          </p>

          <ProductDashboard />
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

export default AddProduct;
