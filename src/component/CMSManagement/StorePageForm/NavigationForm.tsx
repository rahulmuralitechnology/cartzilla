import { FormInstance, Row, Col, Form, Input, Button, Flex, } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FC } from "react";
import UploadInput from "../../common/UploadInput";
import exp from "constants";

interface NavigationForm {
  form?: FormInstance<any>;
}

// Add this to your StorePageForm or create new components
const NavigationForm: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.List name={["navigation", "links"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "title"]} label='Link Title' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "href"]} label='Link URL' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Link
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block >
                  Add Navigation Link
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    );
  } else {
    return <></>;
  }
};

export default NavigationForm;