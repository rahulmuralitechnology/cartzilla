import React, { useState, useEffect } from "react";
import { Truck, Tag, Package, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Card,
  Steps,
  Alert,
  Row,
  Col,
  Form,
  InputNumber,
  Spin,
  Empty,
  Descriptions,
  Result,
  Button,
  Typography,
  Radio,
  Space,
  message,
} from "antd";
import "./ShiprocketOrderShipment.scss";
import orderService, { Order } from "../../../../services/orderService";
import { useNavigate, useParams } from "react-router-dom";
import shippingService from "../../../../services/shippingService";
import {
  CreateOrderRequest,
  IShippingServiceability,
  ShipmentData,
  ShiprocketOrderItem,
} from "../../../../services/interfaces/shippingTypes";
import appConstant from "../../../../services/appConstant";
import { OrderItem } from "../../../../services/interfaces/common";
const { Title } = Typography;
const { Step } = Steps;
const { Text } = Typography;

const ShiprocketOrderShipment: React.FC = () => {
  const [ordershipped, setOrderShipped] = useState<boolean>(false);
  const [orderLoading, setOrderLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingServiceAbility, setShippingServiceAbility] = useState<IShippingServiceability[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<number | null>(null);
  const [packageDetails, setPackageDetails] = useState({
    weight: 0.5,
    length: 10,
    breadth: 10,
    height: 5,
  });
  const [shipmentCreated, setShipmentCreated] = useState(false);
  const [shipmentDetails, setShipmentDetails] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const navigate = useNavigate();
  const params = useParams() as { storeId: string; orderId: string };
  const orderId = params.orderId;
  const sameAsBillingAddress = true;
  // Transform your ecommerce order to ShipRocket format
  const transformOrderData = (): CreateOrderRequest => {
    return {
      order_id: orderId,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: "warehouse",
      billing_customer_name: orderDetails?.billingAddress?.name || "",
      billing_last_name: orderDetails?.billingAddress?.name || "",
      billing_address: orderDetails?.billingAddress?.line1 || "",
      billing_address_2: orderDetails?.billingAddress?.line2 || "",
      billing_city: orderDetails?.billingAddress?.city || "",
      billing_pincode: orderDetails?.billingAddress?.zip || "",
      billing_state: orderDetails?.billingAddress?.state || "",
      billing_country: orderDetails?.billingAddress?.country || "",
      billing_email: orderDetails?.user?.email || "",
      billing_phone: orderDetails?.billingAddress?.phone || "",
      shipping_is_billing: sameAsBillingAddress,
      shipping_customer_name: sameAsBillingAddress ? orderDetails?.billingAddress?.name : orderDetails?.billingAddress?.name,
      shipping_address: sameAsBillingAddress ? orderDetails?.billingAddress?.line1 : orderDetails?.shippingAddress?.line1,
      shipping_address_2: sameAsBillingAddress ? orderDetails?.billingAddress?.line2 || "" : orderDetails?.shippingAddress?.line1 || "",
      shipping_city: sameAsBillingAddress ? orderDetails?.billingAddress?.city : orderDetails?.shippingAddress?.city,
      shipping_pincode: sameAsBillingAddress ? orderDetails?.billingAddress?.zip : orderDetails?.shippingAddress?.zip,
      shipping_state: sameAsBillingAddress ? orderDetails?.billingAddress?.state : orderDetails?.shippingAddress?.state,
      shipping_country: sameAsBillingAddress ? orderDetails?.billingAddress?.country : orderDetails?.shippingAddress?.country,
      shipping_email: orderDetails?.user?.email,
      shipping_phone: orderDetails?.billingAddress?.phone,
      order_items:
        orderDetails?.orderItems?.map((item: OrderItem, i) => ({
          name: item.productName,
          sku: `${item.productId}_${i}`,
          units: item.quantity,
          selling_price: Number(item.price),
          discount: "0",
          tax: "0",
          hsn: 0,
        })) || [],
      payment_method: orderDetails?.paymentMode === "CASH" ? "Cash on Delivery" : "Prepaid",
      shipping_charges: Number(shippingServiceAbility.find((c) => c.id === selectedCourier)?.rate.toFixed(2)) || 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: Number(orderDetails?.totalAmount),
      length: packageDetails.length,
      breadth: packageDetails.breadth,
      height: packageDetails.height,
      weight: packageDetails.weight,
      courierCompanyId: Number(selectedCourier),
      courierName: shippingServiceAbility.find((c) => c.id === selectedCourier)?.courier_name || "",
      courierRate: Number(shippingServiceAbility.find((c) => c.id === selectedCourier)?.rate.toFixed(2)),
    };
  };

  // Get shipping rates
  const fetchShippingRates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const shippingZipCode = orderDetails?.billingAddress?.zip ? orderDetails?.billingAddress?.zip : orderDetails?.shippingAddress?.zip;

      const shipmentData: ShipmentData = {
        pickupPostcode: "110001", // Your warehouse pincode
        deliveryPostcode: String(shippingZipCode),
        weight: packageDetails.weight,
        cod: orderDetails?.paymentMode === "CASH" ? 1 : 0,
        order_id: orderId,
      };

      const response = await shippingService.getShippingMethods(shipmentData);

      setShippingServiceAbility(response.data.available_shipping_companies);
      if (response.data.available_shipping_companies.length > 0) {
        const cheapestCourier = response.data.available_shipping_companies.reduce(
          (min: IShippingServiceability, courier: IShippingServiceability) => (courier.rate < min.rate ? courier : min),
          response.data.available_shipping_companies[0]
        );
        setSelectedCourier(cheapestCourier.id);
      } else {
        setError("No shipping options available for this delivery location.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch shipping rates.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create shipment
  const createShipment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const orderData = transformOrderData();
      const response = await shippingService.createShippingOrder(orderData);

      setShipmentCreated(true);
      setShipmentDetails(response.data.shiprocket_order_response);
      message.success("Shipment created successfully!");
      setOrderShipped(true);
      navigate(`/store/${params.storeId}/orders`);
    } catch (err: any) {
      setError(err.message || "Failed to create shipment.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2) {
      fetchShippingRates();
    }
  }, [step]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleUpdatePackageDetails = (name: string, value: any) => {
    setPackageDetails({
      ...packageDetails,
      [name]: parseFloat(value),
    });
  };

  const handleSelectCourier = (courierId: number) => {
    setSelectedCourier(courierId);
  };

  const handleProcessOrder = () => {
    createShipment();
  };

  const fetchOrderbyOrderId = async () => {
    try {
      setOrderLoading(true);
      const result = await orderService.getOrderDetailById(orderId);
      setOrderDetails(result);
      setOrderShipped(result.status === "SHIPPED" || result.status === "DELIVERED");
      setOrderLoading(false);
    } catch (error: any) {
      console.log("Error while fetching order", error);
      message.error(error.message);
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderbyOrderId();
    }
  }, [orderId]);

  return (
    <section className='shiprocket-shipment bloomi5_page'>
      <Card loading={orderLoading}>
        {/* Header */}
        <div className='shiprocket-header'>
          <Title level={4}>Process Shipment for Order #{orderId}</Title>
        </div>

        {/* Steps indicator */}
        <Steps current={step - 1} className='shiprocket-steps'>
          <Step title='Package Details' icon={<Package />} />
          <Step title='Shipping Method' icon={<Truck />} />
          <Step title='Confirmation' icon={<CheckCircle />} />
        </Steps>

        {/* Step content */}
        <div className='shiprocket-content'>
          {error && <Alert message={error} type='error' showIcon icon={<AlertCircle />} className='mb-4' />}
          {ordershipped && (
            <Alert message='Order has already been shipped.' type='success' showIcon icon={<CheckCircle />} className='mb-4' />
          )}

          {step === 1 && (
            <div>
              <Title level={5}>Package Dimensions and Weight</Title>
              <Text type='secondary' className='mb-4'>
                Enter the package dimensions and weight to calculate shipping rates.
              </Text>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label='Weight (kg)'>
                    <InputNumber
                      min={0.1}
                      step={0.1}
                      value={packageDetails.weight}
                      onChange={(value: any) => handleUpdatePackageDetails("weight", value)}
                      className='w-full'
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Length (cm)'>
                    <InputNumber
                      min={1}
                      value={packageDetails.length}
                      onChange={(value) => handleUpdatePackageDetails("length", value)}
                      className='w-full'
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Breadth (cm)'>
                    <InputNumber
                      min={1}
                      value={packageDetails.breadth}
                      onChange={(value) => handleUpdatePackageDetails("breadth", value)}
                      className='w-full'
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Height (cm)'>
                    <InputNumber
                      min={1}
                      value={packageDetails.height}
                      onChange={(value) => handleUpdatePackageDetails("height", value)}
                      className='w-full'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {step === 2 && (
            <div>
              <Title level={5}>Select Shipping Method</Title>
              <Text type='secondary'>Choose a shipping carrier to deliver your package.</Text>

              {isLoading ? (
                <div className='loading-container'>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  <span className='ml-2'>Loading shipping options...</span>
                </div>
              ) : (
                <>
                  {shippingServiceAbility.length === 0 ? (
                    <Empty
                      image={<AlertCircle className='text-warning' style={{ fontSize: 48 }} />}
                      description={
                        <div>
                          <Title level={5}>No shipping options available</Title>
                          <Text type='secondary'>
                            There are no shipping carriers available for this destination. Please try modifying the package details or
                            contact support.
                          </Text>
                        </div>
                      }
                    />
                  ) : (
                    <Radio.Group
                      onChange={(e) => handleSelectCourier(e.target.value)}
                      value={selectedCourier}
                      className='shipping-rates-group'>
                      <Space direction='horizontal' style={{ width: "100%", marginTop: 20, flexWrap: "wrap" }}>
                        {shippingServiceAbility.map((courier) => (
                          <Card key={courier.id} className={`courier-card ${selectedCourier === courier.id ? "selected" : ""}`}>
                            <Radio value={courier?.id}>
                              <div className='courier-info'>
                                <div>
                                  <Text strong>
                                    {courier.courier_name} - {appConstant.CURRENY_SYMBOL} {courier.rate.toFixed(2)}
                                  </Text>
                                  <Text type='secondary' className='delivery-info'>
                                    Estimated delivery: {courier.etd} days
                                  </Text>
                                </div>
                                <div className='courier-rate'>
                                  <Tag>₹{courier.rate.toFixed(2)}</Tag>
                                </div>
                              </div>
                            </Radio>
                          </Card>
                        ))}
                      </Space>
                    </Radio.Group>
                  )}
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <Title level={5}>Confirm Shipment</Title>
              <Text type='secondary'>Review shipment details before processing.</Text>

              {!shipmentCreated ? (
                <div style={{ marginTop: "20px" }}>
                  <Card className='info-card' title='Order Information' styles={{ header: { minHeight: "40px" } }}>
                    <Descriptions layout='vertical' column={{ xs: 1, sm: 2, xl: 4 }}>
                      <Descriptions.Item label='Order ID'>{orderId}</Descriptions.Item>
                      <Descriptions.Item label='Order Date'>{new Date().toLocaleDateString()}</Descriptions.Item>
                      <Descriptions.Item label='Customer'>
                        {orderDetails?.user?.username}
                        <br />
                        {orderDetails?.user?.email}
                      </Descriptions.Item>
                      <Descriptions.Item label='Items'>{orderDetails?.orderItems?.length} items</Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card className='info-card mt-4' title='Shipping Details' styles={{ header: { minHeight: "40px" } }}>
                    <Descriptions layout='vertical' column={{ xs: 1, sm: 2, xl: 4 }}>
                      <Descriptions.Item label='Shipping Address'>
                        {orderDetails?.billingAddress?.line1
                          ? `${orderDetails?.billingAddress?.line1} ${orderDetails?.billingAddress?.line2}`
                          : `${orderDetails?.billingAddress?.line1}  ${orderDetails?.billingAddress?.line2}`}
                        <br />
                        {`${orderDetails?.billingAddress?.city}, ${orderDetails?.billingAddress?.state} ${orderDetails?.billingAddress?.zip}`}
                      </Descriptions.Item>
                      <Descriptions.Item label='Package Details'>
                        {packageDetails.weight} kg • {packageDetails.length}x{packageDetails.breadth}x{packageDetails.height} cm
                      </Descriptions.Item>
                      <Descriptions.Item label='Shipping Method'>
                        {shippingServiceAbility.find((c) => c.id === selectedCourier)?.courier_name || "Not selected"}
                      </Descriptions.Item>
                      <Descriptions.Item label='Shipping Cost'>
                        ₹{shippingServiceAbility.find((c) => c.id === selectedCourier)?.rate.toFixed(2) || "0.00"}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </div>
              ) : (
                <Result
                  icon={<CheckCircle className='text-success' style={{ fontSize: 72 }} />}
                  status='success'
                  title='Shipment Created Successfully!'
                  subTitle='Your shipment has been created and the order is ready for pickup.'
                  extra={
                    <Card className='shipment-details'>
                      <Descriptions column={1}>
                        <Descriptions.Item label='Shipment ID'>{shipmentDetails.shipment_id}</Descriptions.Item>
                        <Descriptions.Item label='Order ID'>{shipmentDetails.order_id}</Descriptions.Item>
                        <Descriptions.Item label='Status'>{shipmentDetails.status}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  }
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='shiprocket-footer'>
          {step > 1 && !shipmentCreated ? (
            <Button onClick={handlePreviousStep}>Back</Button>
          ) : (
            <Button
              onClick={() => {
                navigate(`/store/${params.storeId}/orders`);
              }}>
              Cancel
            </Button>
          )}

          {!shipmentCreated ? (
            <Button
              type='primary'
              loading={isLoading}
              onClick={step < 3 ? handleNextStep : handleProcessOrder}
              disabled={isLoading || (step === 2 && !selectedCourier) || (step === 2 && shippingServiceAbility.length === 0)}>
              {step < 3 ? (
                <Space align='center'>
                  <span>Continue</span> <ArrowRightOutlined />
                </Space>
              ) : (
                "Process Shipment"
              )}
            </Button>
          ) : (
            <Button type='primary'>Close</Button>
          )}
        </div>
      </Card>
    </section>
  );
};

export default ShiprocketOrderShipment;
