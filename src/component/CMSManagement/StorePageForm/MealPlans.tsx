import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Space } from "antd";
import { FormInstance } from "antd/es/form";
import TextArea from "antd/es/input/TextArea";

interface MealSectionProps {
  form?: FormInstance<any>;
}

const MealPlansForm: FC<MealSectionProps> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.Item name={["mealPlans", "preTitle"]} label='Pre Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["mealPlans", "title"]} label='Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["mealPlans", "subtitle"]} label='Subtitle'>
          <Input />
        </Form.Item>
        <Form.Item name={["mealPlans", "description"]} label='Description'>
          <TextArea rows={3} />
        </Form.Item>

        <Form.List name={["mealPlans", "steps"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "title"]} label='Step Title'>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "highlight"]} label='Step Highlight'>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "description"]} label='Step Description'>
                    <TextArea rows={2} />
                  </Form.Item>

                  <Form.List name={[name, "bullets"]}>
                    {(bulletFields, { add: addBullet, remove: removeBullet }) => (
                      <>
                        {bulletFields.map(({ key: bulletKey, name: bulletName, ...restBulletField }) => (
                          <Space key={bulletKey} style={{ display: "flex", marginBottom: 8 }} align='baseline'>
                            <Form.Item {...restBulletField} name={bulletName}>
                              <Input placeholder='Bullet point' />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => removeBullet(bulletName)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type='dashed' onClick={() => addBullet()} block icon={<PlusOutlined />}>
                            Add Bullet Point
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item {...restField} name={[name, "ctaDescription"]} label='CTA Description'>
                    <TextArea rows={2} />
                  </Form.Item>

                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Step
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Step
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name={["mealPlans", "ctaText"]} label='CTA Text'>
          <Input />
        </Form.Item>
      </>
    );
  } else {
    return <></>;
  }
};

export default MealPlansForm;
