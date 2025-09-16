
import { FormInstance, Row, Col, Form, Input, Switch, } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FC } from "react";
import UploadInput from "../../common/UploadInput";

interface FooterForm {
  form?: FormInstance<any>;
}
const FooterForm: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.Item name={["footer", "showSocialLinks"]} label='Show Social Links' valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name={["footer", "showQuickLinks"]} label='Show Quick Links' valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name={["footer", "showContactInfo"]} label='Show Contact Info' valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name={["footer", "copyrightText"]} label='Copyright Text'>
          <Input />
        </Form.Item>
      </>
    );
  } else {
    return <></>;
  }
};

export default FooterForm;