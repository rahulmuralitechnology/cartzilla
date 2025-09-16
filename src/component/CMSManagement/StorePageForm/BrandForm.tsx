import { FormInstance, Form, Input, ColorPicker } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import UploadInput from "../../common/UploadInput";
import { RootState } from "../../../store";

interface BrandSectionProps {
  form: FormInstance<any>;
}

// In BrandForm.tsx - Fix color handling
const BrandForm: FC<BrandSectionProps> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.Item name={["brand", "name"]} label='Brand Name'>
          <Input />
        </Form.Item>
        <Form.Item name={["brand", "headerLogo"]} label='Header Logo'>
          <UploadInput
            imageUrl={form.getFieldValue(["brand", "headerLogo"])}
            onUploadRes={(file) => {
              form.setFieldValue(
                ["brand", "headerLogo"],
                file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
              );
            }}
          />
        </Form.Item>
        <Form.Item name={["brand", "footerLogo"]} label='Footer Logo'>
          <UploadInput
            imageUrl={form.getFieldValue(["brand", "footerLogo"])}
            onUploadRes={(file) => {
              form.setFieldValue(
                ["brand", "footerLogo"],
                file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
              );
            }}
          />
        </Form.Item>
        {/* <Form.Item
          name={["brand", "colors", "primary"]}
          label='Primary Color'
          getValueFromEvent={(color) => color.toHexString()}
        >
          <ColorPicker format="hex" />
        </Form.Item> */}
        {/* <Form.Item
          name={["brand", "colors", "secondary"]}
          label='Secondary Color'
          getValueFromEvent={(color) => color.toHexString()}
        >
          <ColorPicker format="hex" />
        </Form.Item> */}
      </>
    );
  } else {
    return <></>;
  }
};

export default BrandForm;