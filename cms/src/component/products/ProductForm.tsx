import { FC, useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Modal, Button, message, Row, Col, Divider } from "antd";
import { ProductFormData } from "../../store/types/product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import ProductCategoryForm from "./ProductCategory/ProductCategory";
import productService from "../../services/productService";
import { setProductCategory } from "../../store/reducers/productSlice";
import UploadInput from "../common/UploadInput";
import appConstant from "../../services/appConstant";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ProductFormData) => void;
  loading: boolean;
}

const ProductForm: FC<ProductFormProps> = ({ initialValues, visible, onCancel, onSubmit, loading }) => {
  const [isCategoryForm, setCategoryForm] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const { productCategory } = useSelector((state: RootState) => state.product);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const fetchAllProductsCategory = async (storeId: string) => {
    try {
      const response = await productService.getAllProductCategoyList(storeId);
      dispatch(setProductCategory(response.data.productCategory));
    } catch (error) {
      console.log("Failed to fetch products category", error);
      message.error("Failed to fetch product category");
    }
  };

  useEffect(() => {

    setSelectedCategory("");
    setEditCategory("");
    if (selectedStore?.id) {
      fetchAllProductsCategory(selectedStore?.id as string);
    }
    if (initialValues) {
      form.setFieldValue("category", initialValues.category);
      form.setFieldValue("title", initialValues.title);
      form.setFieldValue("description", initialValues.description);
      form.setFieldValue("availabilityStatus", initialValues.availabilityStatus === "IN_STOCK" ? true : false);
      form.setFieldValue("brand", initialValues.brand);
      form.setFieldValue("dimensions", initialValues?.dimensions);
      form.setFieldValue("discountPercentage", initialValues.discountPercentage);
      form.setFieldValue("minimumOrderQuantity", initialValues.minimumOrderQuantity);
      form.setFieldValue("price", initialValues.price);
      form.setFieldValue("sku", initialValues.sku);
      form.setFieldValue("stock", initialValues.stock);
      form.setFieldValue("hsnCode", initialValues.hsnCode);
      form.setFieldValue("gstRate", initialValues.gstRate);
      form.setFieldValue("gstInclusive", initialValues.gstInclusive);
      form.setFieldValue("variants", initialValues?.variants);
      form.setFieldValue("umo", initialValues?.umo);
      form.setFieldValue("strikePrice", initialValues?.strikePrice);
      form.setFieldValue("umoValue", initialValues?.umoValue);
      setSelectedCategory(initialValues?.category as string);
      setEditCategory(initialValues?.category as string);
      form.setFieldValue("status", initialValues?.status === "DRAFT" ? false : true);
    }
  }, [refresh, selectedStore?.id, initialValues]);

  return (
    <>
      <Modal
        title={initialValues ? "Edit Product" : "Add Product"}
        open={visible}
        onCancel={onCancel}
        okButtonProps={{ loading: loading }}
        onOk={() => form.submit()}
        okText={initialValues?.id ? "Update" : "Add"}
        centered
        width={800}>
        <Form form={form} layout='vertical' onFinish={onSubmit}>
          <Form.Item name='title' label='Product Name' rules={[{ required: true, message: "Please enter product name" }]}>
            <Input />
          </Form.Item>

          <Form.Item name='description' label='Description' rules={[{ required: true, message: "Please enter description" }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col span={5}>
              {selectedStore?.storeCategory !== "ecom_interior_template" && (
                <>
                  <Form.Item name='price' label='Price' rules={[{ required: true, message: "Please enter price" }]}>
                    <InputNumber
                      min={0}
                      precision={2}
                      style={{ width: "100%" }}
                      formatter={(value) => `${appConstant.CURRENY_SYMBOL} ${value}`}
                    />
                  </Form.Item>
                </>
              )}
            </Col>
            <Col span={5}>
              {selectedStore?.storeCategory !== "ecom_interior_template" && (
                <>
                  <Form.Item name='strikePrice' label='Strike Price'>
                    <InputNumber
                      min={0}
                      precision={2}
                      style={{ width: "100%" }}
                      formatter={(value) => `${appConstant.CURRENY_SYMBOL} ${value}`}
                    />
                  </Form.Item>
                </>
              )}
            </Col>
            <Col span={7}>
              {selectedStore?.storeCategory !== "ecom_interior_template" && (
                <Form.Item name='umo' label='UOM ' rules={[{ required: true, message: "Please enter UMO" }]}>
                  <Input.Group compact>
                    <Form.Item name='umo' noStyle rules={[{ required: true, message: "Please select UOM" }]}>
                      <Select placeholder='Select UOM' style={{ width: "30%" }}>
                        <Select.Option value='gm'>gm</Select.Option>
                        <Select.Option value='kg'>kg</Select.Option>
                        <Select.Option value='Qty'>Qty</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name='umoValue' noStyle rules={[{ required: true, message: "Please enter value" }]}>
                      <InputNumber min={0} style={{ width: "70%" }} placeholder='Enter weight' />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              )}
            </Col>
            <Col span={7}>
              <Form.Item name='category' label='Category' rules={[{ required: true, message: "Please select category" }]}>
                <Row gutter={[16, 16]}>
                  <Col span={18}>
                    <Select
                      value={selectedCategory}
                      onSelect={(v) => {
                        form.setFieldValue("category", v);
                        setSelectedCategory(v);
                      }}>
                      {productCategory.length > 0 && productCategory.map((p, i) => <Select.Option key={p.name}>{p.name}</Select.Option>)}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Button
                      type='primary'
                      style={{ width: "100%" }}
                      onClick={() => {
                        setCategoryForm(true);
                      }}>
                      Add
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name='sku' label='SKU' rules={[{ required: true, message: "Please enter SKU" }]}>
                <Input />
              </Form.Item>
            </Col>

            {selectedStore?.storeCategory !== "ecom_interior_template" && (
              <>
                <Col span={8}>
                  <Form.Item name='stock' label='Stock Quantity' rules={[{ required: true, message: "Please enter stock quantity" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='minimumOrderQuantity'
                    label='Minimum Order Quantity'
                    rules={[{ required: true, message: "Please enter minimum order quantity" }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Divider orientation='left'>Varients</Divider>
          <Form.List name='variants'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={[16, 16]} key={key} align='middle'>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label='Variant Name'
                        rules={[{ required: true, message: "Please enter variant name" }]}>
                        <Input placeholder='Enter variant name' />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        label='Variant Price'
                        rules={[{ required: true, message: "Please enter variant price" }]}>
                        <InputNumber
                          formatter={(value) => `${appConstant.CURRENY_SYMBOL} ${value}`}
                          min={0}
                          style={{ width: "100%" }}
                          placeholder='Enter price'
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "strikePrice"]}
                        label='Variant Strike Price'
                        rules={[{ required: false, message: "Please enter variant price" }]}>
                        <InputNumber
                          formatter={(value) => `${appConstant.CURRENY_SYMBOL} ${value}`}
                          min={0}
                          style={{ width: "100%" }}
                          placeholder='Enter strike price'
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "stock"]}
                        label='Variant Stock'
                        rules={[{ required: true, message: "Please enter variant stock" }]}>
                        <InputNumber min={0} style={{ width: "100%" }} placeholder='Enter stock' />
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{ display: "flex", alignItems: "center", paddingTop: "5px" }}>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Variant
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Divider orientation='left'>GST</Divider>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                name='hsnCode'
                label='HSN Code'
                rules={[
                  { required: true, message: 'Please enter HSN Code' },
                  {
                    pattern: /^[A-Za-z0-9]{6,8}$/,
                    message: 'HSN/SAC Code should be 6 or 8 digits long. Please enter a valid HSN/SAC code.',
                  },
                ]}
              >
                <Input maxLength={8} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='gstRate' label='GST Rate' rules={[{ required: false, message: "Please enter GST Rate" }]}>
                <Select>
                  <Select.Option value={0}>0%</Select.Option>
                  <Select.Option value={5}>5%</Select.Option>
                  <Select.Option value={12}>12%</Select.Option>
                  <Select.Option value={18}>18%</Select.Option>
                  <Select.Option value={28}>28%</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='gstInclusive' label='GST Inclusive' valuePropName='checked'>
                <Switch checkedChildren='Yes' unCheckedChildren='No' />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name='images' label='Images' valuePropName='images' rules={[{ required: true, message: "Please insert Image" }]}>
                <UploadInput
                  maxCount={5}
                  imageUrl={initialValues?.images?.length ? initialValues?.images : [""]}
                  onDelete={(url: string) => {
                    const currentImages = form.getFieldValue("images") || [];
                    const newImages = currentImages.filter((img: string) => img !== url);
                    form.setFieldValue("images", newImages);
                  }}
                  onUploadRes={(file) => {
                    const currentImages = form.getFieldValue("images") || [];
                    form.setFieldValue("images", [
                      ...currentImages,
                      file.response?.data?.url || URL.createObjectURL(file.originFileObj as Blob),
                    ]);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='thumbnail' label='Thumbnail' valuePropName='thumbnail' rules={[{ required: true, message: "Please insert Thumbnail" }]}>
                <UploadInput
                  imageUrl={initialValues?.thumbnail ? initialValues.thumbnail : ""}
                  onUploadRes={(file) => {
                    form.setFieldValue("thumbnail", file.response?.data?.url || URL.createObjectURL(file.originFileObj as Blob));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Row gutter={[16, 16]}>
                <Col>
                  <Form.Item name='status' label='Status' valuePropName='checked'>
                    <Switch checkedChildren='Published' unCheckedChildren='Draft' />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name='availabilityStatus' label='Availability' valuePropName='checked'>
                    <Switch checkedChildren='Available' defaultChecked={true} unCheckedChildren='Not-Available' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* <Col span={12}>
              <Form.Item name='sellEvenInZeroQuantity' label='Sell Even in Zero Quantity' valuePropName='checked'>
                <Switch checkedChildren='Yes' defaultChecked={false} unCheckedChildren='No' />
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Modal>
      <ProductCategoryForm
        visible={isCategoryForm}
        // initialValues={productCategory.filter((c) => c.name === editCategory)[0] || null}
        onCancel={() => setCategoryForm(false)}
        onRefresh={() => setRefresh(!refresh)}
      />
    </>
  );
};

export default ProductForm;
