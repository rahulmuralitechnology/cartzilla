import { FC, useState } from "react";
import { Form, Input, Select, Switch, Radio, DatePicker, InputNumber, Divider, Space, Button, Row, Col } from "antd";
import { CaretDownOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { IProduct } from "../../services/productService";

const { Option } = Select;

const DiscountCouponForm: FC<{
  initialValues: any;
  onFinish: (v: any) => void;
  onCancel: () => void;
  products: IProduct[];
  loading: boolean;
}> = ({ initialValues, onFinish, onCancel, products, loading }) => {
  const [form] = Form.useForm();
  const [usageType, setUsageType] = useState(initialValues?.usageType || "unlimited");

  return (
    <Form form={form} layout='vertical' onFinish={onFinish} initialValues={{ showOnCheckout: true, ...initialValues }}>
      {/* Information Section */}
      <Divider orientation='left' style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
        Information
      </Divider>

      <Form.Item label='Name' name='name' rules={[{ required: true, message: "Please input the discount name!" }]}>
        <Input placeholder='Name' />
      </Form.Item>

      <Form.Item label='Description' name='description'>
        <Input.TextArea placeholder='Description' />
      </Form.Item>

      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item
          label='Type'
          name='discountType'
          style={{ flex: 1 }}
          rules={[{ required: true, message: "Please select the discount type!" }]}>
          <Select suffixIcon={<CaretDownOutlined />}>
            <Option value='PERCENTAGE'>Percentage Discount</Option>
            <Option value='FIXED'>Fixed Amount</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Code' name='code' style={{ flex: 1 }} rules={[{ required: true, message: "Please input the discount code!" }]}>
          <Input placeholder='Code' />
        </Form.Item>
      </div>
      <Row>
        <Col span={12}>
          <Form.Item name='showOnCheckout' label='Show On Checkout' initialValue={true} valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='active' label='Active' initialValue={true} valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      {/* Validity Section */}
      <Divider orientation='left' style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
        Validity
      </Divider>

      <Form.Item label='Usage Type' name='limited'>
        <Radio.Group onChange={(e) => setUsageType(e.target.value)} buttonStyle='solid'>
          <Radio.Button value={true}>Unlimited</Radio.Button>
          <Radio.Button value={false}>Limited</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item
          label='Start Date'
          getValueProps={(value) => ({ value: value ? dayjs(value) : "" })}
          name='startDate'
          style={{ flex: 1 }}
          rules={[{ required: false, message: "Start Date is required" }]}>
          <DatePicker style={{ width: "100%" }} suffixIcon={<CalendarOutlined />} />
        </Form.Item>

        <Form.Item
          label='End Date'
          name='expiryDate'
          getValueProps={(value) => ({ value: value ? dayjs(value) : "" })}
          style={{ flex: 1 }}
          rules={[{ required: true, message: "End Date is required" }]}>
          <DatePicker style={{ width: "100%" }} suffixIcon={<CalendarOutlined />} />
        </Form.Item>
      </div>
      <Form.Item label='Customer Usage Limit' name='customerUsageLimit' style={{ flex: 1 }}>
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>

      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item label='Minimum Cart Amount' name='minOrderAmount' style={{ flex: 1 }}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label='Maximum Amount' name='maxOrderAmount' style={{ flex: 1 }}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </div>

      {/* Discounts Section */}
      <Divider orientation='left' style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
        Discounts
      </Divider>
      <Row gutter={[16, 16]}>
        <Col lg={12} span={24}>
          <Form.Item label='Discount Value' name='value' rules={[{ required: true, message: "Please input the discount value!" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Col>
        <Col lg={12} span={24}>
          <Form.Item label='Allow Maximum Discount Value' name='maxDiscountAmount'>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Col>
      </Row>

      {/* Products Section */}
      <Divider orientation='left' style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
        Products
      </Divider>

      <Row gutter={[16, 16]}>
        <Col lg={8} span={24}>
          <Form.Item name='productIncludeExclude'>
            <Radio.Group>
              <Radio value='include'>Include</Radio>
              <Radio value='exclude'>Exclude</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col lg={8} span={24}>
          <Form.Item label='Product Name' name='products'>
            <Select mode='multiple' placeholder='Select products' suffixIcon={<CaretDownOutlined />} showSearch>
              {products?.length > 0 &&
                products.map((p, i) => {
                  return (
                    <Option key={p.id} value={p.id}>
                      {p.title}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={8} span={24}>
          <Form.Item label='Product Minimum Quantity' name='productMinQuantity'>
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
        </Col>
      </Row>

      {/* Form Actions */}
      <Form.Item>
        <Space>
          <Button type='primary' htmlType='submit' loading={loading}>
            {initialValues ? "Update" : "Create"} Discount
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DiscountCouponForm;
