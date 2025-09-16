import { FormInstance, Row, Col, Form, Input, Button } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import TextArea from "antd/es/input/TextArea";
import UploadInput from "../../common/UploadInput";

const ContactForm: FC<{ form: FormInstance }> = ({ form }) => {
  const { selectedStore } = useSelector((state: RootState) => state.store);

  if (selectedStore?.siteType === "webapp") {
    return (
      <section className='site_contact_form'>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name={["contact", "email"]} label='Email' rules={[{ required: true }, { type: "email" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={["contact", "phone"]} label='Phone' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name={["contact", "address"]} label='Address' rules={[{ required: true }]}>
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={["contact", "mapUrl"]} label='Map Url' rules={[{ required: false }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </section>
    );
  } else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "website_interiors_template") {
    return (
      <>
        <Form.Item name={["contact", "contactDetails", "address"]} label='Address'>
          <TextArea rows={3} />
        </Form.Item>
        <Row gutter={[32, 16]}>
          <Col span={24} md={12}>
            <Form.Item name={["contact", "contactDetails", "email"]} label='Email'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name={["contact", "contactDetails", "phone"]} label='Phone'>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[32, 16]}>
          <Col span={24} md={12}>
            <Form.Item name={["contact", "contactDetails", "whatsapp"]} label='WhatsApp'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={14} md={12}>
            <Form.Item name={["contact", "mapUrl"]} label='Map URL'>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[32, 16]}>
          <Col span={14} md={12}>
            <Form.Item name={["socialLinks", "facebook"]} label='Facebook URL'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={14} md={12}>
            <Form.Item name={["socialLinks", "instagram"]} label='Instagram URL'>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[32, 16]}>
          <Col span={14} md={12}>
            <Form.Item name={["socialLinks", "X"]} label='X URL'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={14} md={12}>
            <Form.Item name={["socialLinks", "youtube"]} label='YouTube URL'>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }
  // In ContactForm.tsx - Update the pet store section
  else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "ecom_petstore_template") {
    return (
      <>
        <Form.Item name={["contact", "title"]} label='Contact Title'>
          <Input />
        </Form.Item>
        <Form.Item name={["contact", "intro"]} label='Contact Intro'>
          <Input />
        </Form.Item>
        <Form.Item name={["contact", "description"]} label='Contact Description'>
          <TextArea rows={3} />
        </Form.Item>

        <Row gutter={[32, 16]}>
          <Col span={24} md={12}>
            <Form.Item name={["contact", "email"]} label='Email'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name={["contact", "phone"]} label='Phone'>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name={["contact", "address"]} label='Address'>
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item name={["contact", "Image"]} label='Contact Image'>
          <UploadInput
            imageUrl={form.getFieldValue(["contact", "Image"])}
            onUploadRes={(file) => {
              form.setFieldValue(
                ["contact", "Image"],
                file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob)
              );
            }}
          />
        </Form.Item>

        {/* Contact Form Fields - Updated structure */}
        <h3>Contact Form Fields</h3>
        <Form.List name={["contact", "form", "fields"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
                  <Form.Item {...restField} name={[name, "label"]} label='Field Label' rules={[{ required: true }]}>
                    <Input placeholder='e.g., Your Name *' />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "defaultValue"]} label='Default Value'>
                    <Input placeholder='e.g., +91' />
                  </Form.Item>
                  <Button type='link' danger onClick={() => remove(name)}>
                    Remove Field
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} block>
                  Add Form Field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name={["contact", "form", "messageLabel"]} label='Message Label'>
          <Input placeholder='e.g., Your Question *' />
        </Form.Item>
        <Form.Item name={["contact", "form", "submitButton"]} label='Submit Button Text'>
          <Input placeholder='e.g., Submit' />
        </Form.Item>
      </>
    );
  } else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "website_restaurant_template") {
    return (
      <>
        <Row gutter={[32, 16]}>
          <Col span={12}>
            <Form.Item name={["address", "street"]} label='Street' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={["address", "city"]} label='City' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={["address", "state"]} label='State' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={["address", "zip"]} label='ZIP Code' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={["address", "country"]} label='Country' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={["contact", "contactDetails", "email"]} label='Email'>
              <Input />
            </Form.Item>
            <Form.Item name={["contact", "contactDetails", "phone"]} label='Phone'>
              <Input />
            </Form.Item>
            <Form.Item name={["contact", "contactDetails", "whatsapp"]} label='WhatsApp'>
              <Input />
            </Form.Item>
            <Form.Item name={["contact", "mapUrl"]} label='Google Maps Embed URL'>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  } else if (selectedStore?.siteType === "website" && selectedStore.storeCategory === "landing-page-bloomi5") {
    return (
      <>
        <Form.Item name={["contact", "heading"]} label='Heading' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={["contact", "subheading"]} label='Subheading' rules={[{ required: true }]}>
          <TextArea rows={3} />
        </Form.Item>
        <Row gutter={[32, 16]}>
          <Col span={24} md={12}>
            <Form.Item name={["contact", "email"]} label='Email' rules={[{ required: true }, { type: "email" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name={["contact", "phone"]} label='Phone' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name={["contact", "address"]} label='Address' rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name={["contact", "formHeading"]} label='Form Heading' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={["contact", "formSubheading"]} label='Form Subheading' rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name={["contact", "mapUrl"]} label='Map URL' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </>
    );
  }
};

export default ContactForm;
