import { FormInstance, Row, Col, Form, Input, Button, Flex, } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FC } from "react";
import UploadInput from "../../common/UploadInput";

interface FAQSectionProps {
  form?: FormInstance<any>;
}

const FAQSection: FC<FAQSectionProps> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (!form) {
    // Optional fallback if no form is passed
    const [internalForm] = Form.useForm();
    form = internalForm;
  }

  // In FAQSection.tsx - Update the structure
  if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.Item name={["faq", "title"]} label='FAQ Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["faq", "subtitle"]} label='FAQ Subtitle'>
          <Input />
        </Form.Item>
        <Form.Item name={["faq", "description"]} label='FAQ Description'>
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name={["faq", "image"]} label='FAQ Image'>
          <UploadInput
            imageUrl={form.getFieldValue(["faq", "image"])}
            onUploadRes={(file) => {
              form.setFieldValue(
                ["faq", "image"],
                file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
              );
            }}
          />
        </Form.Item>

        {/* Add this section for FAQ items */}
        <Form.List name={["faq", "items"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "question"]} label='Question' rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "answer"]} label='Answer' rules={[{ required: true }]}>
                    <TextArea rows={3} />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove FAQ Item
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block>
                  Add FAQ Item
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    );
  } else {
    return (
      <section className='site_faq_form'>
        <Form.List name={["faq", "items"]}>
          {(fields, { add, remove }) => (
            <Row gutter={[16, 16]}>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col span={12} key={key}>
                  <div style={{ marginBottom: 24 }}>
                    <Flex justify='space-between' align='center' style={{ marginBottom: 16 }}>
                      <h4>FAQ Item #{index + 1}</h4>
                      <Button type='text' danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Flex>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "question"]}
                          label='Question'
                          rules={[{ required: true, message: "Please enter the question" }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "answer"]}
                          label='Answer'
                          rules={[{ required: true, message: "Please enter the answer" }]}>
                          <TextArea rows={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </Col>
              ))}
              <Button type='dashed' onClick={() => add()} block>
                Add FAQ Item
              </Button>
            </Row>
          )}
        </Form.List>
      </section>
    );
  };
}

export default FAQSection;
