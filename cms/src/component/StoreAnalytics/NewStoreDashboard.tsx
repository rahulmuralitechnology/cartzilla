import { Card, Row, Col, Typography, Button } from "antd";
import { Area } from "@ant-design/plots";
import { Pie } from "@ant-design/plots";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import "./dashboard.scss";
import { FC } from "react";
import { formatIndianCurrency } from "../../services/utils";
import appConstant from "../../services/appConstant";

const { Title, Text } = Typography;

const NewStoreDashboard: FC<{ totalCustomers: number; totalOrders: number; totalOrderRevenue: number; deliveredOrderCount: number }> = ({
  totalCustomers,
  totalOrders,
  totalOrderRevenue,
  deliveredOrderCount,
}) => {
  // Data for the donut chart
  const targetData = [
    { type: "Weekly Targets", value: 2359 },
    { type: "Monthly targets", value: 6438 },
    { type: "Remaining", value: 4079 },
  ];

  const userHitData = [
    { date: "2023-01", value: 200 },
    { date: "2023-02", value: 180 },
    { date: "2023-03", value: 250 },
    { date: "2023-04", value: 400 },
    { date: "2023-05", value: 350 },
    { date: "2023-06", value: 420 },
    { date: "2023-07", value: 600 },
    { date: "2023-08", value: 550 },
    { date: "2023-09", value: 500 },
    { date: "2023-10", value: 350 },
    { date: "2023-11", value: 500 },
    { date: "2023-12", value: 400 },
    { date: "2024-01", value: 300 },
    { date: "2024-02", value: 200 },
  ];

  // Donut chart configuration
  const donutConfig = {
    data: targetData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    legend: false,
    color: ["#4ECDC4", "#6C7A89", "#F0F3F8"],
    label: {
      type: "inner",
      offset: "-30%",
      content: "",
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    statistic: {
      title: false,
      content: false,
    },
  };

  // Line chart configuration
  const lineConfig = {
    data: userHitData,
    xField: "date",
    yField: "value",
    smooth: true,
    line: {
      color: "#4ECDC4",
    },
    areaStyle: {
      fill: "l(270) 0:#4ECDC40A 1:#4ECDC4",
    },
    xAxis: {
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v: any) => `${v}`,
      },
    },
  };

  return (
    <div className='dashboard-container'>
      <Row gutter={[16, 16]}>
        {/* Target Section */}
        <Col xs={24} lg={12}>
          <Card className='dashboard-card'>
            <Title level={5} className='card-title'>
              Target
            </Title>
            <div className='donut-chart-container'>
              <Pie {...donutConfig} />
            </div>
            <div className='target-legend'>
              <div className='legend-item'>
                <span className='legend-dot weekly'></span>
                <Text className='legend-text'>Weekly Targets</Text>
                <Text className='legend-value'>{appConstant.CURRENY_SYMBOL} 2,359</Text>
              </div>
              <div className='legend-item'>
                <span className='legend-dot monthly'></span>
                <Text className='legend-text'>Monthly targets</Text>
                <Text className='legend-value'>{appConstant.CURRENY_SYMBOL} 6,438</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* User Hit Section */}
        <Col xs={24} lg={12}>
          <Card className='dashboard-card'>
            <Title level={5} className='card-title'>
              User Hit
            </Title>
            <div className='line-chart-container'>
              <Area {...lineConfig} />
            </div>
            <div className='user-hit-legend'>
              <div className='legend-item'>
                <span className='legend-dot monthly-visitors'></span>
                <Text className='legend-text'>Monthly Unique Visitors Summary</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Metrics Cards */}
        <Col xs={24} sm={12} lg={6}>
          <Card className='metric-card'>
            <div className='metric-header'>
              <div>
                <Text className='metric-title'>Total Revenue</Text>
                <Text className='metric-subtitle'>(Last 30 Days)</Text>
              </div>
              <div className='metric-icon revenue-icon'>
                <span>💰</span>
              </div>
            </div>
            <Title level={3} className='metric-value'>
              {formatIndianCurrency(totalOrderRevenue)}
            </Title>
            <Text className='metric-comparison positive'>
              <ArrowUpOutlined /> Revenue up (previous 30 days)
            </Text>
            <Button type='link' className='details-button'>
              Full Details
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='metric-card'>
            <div className='metric-header'>
              <div>
                <Text className='metric-title'>Total Order</Text>
                <Text className='metric-subtitle'>(Last 30 Days)</Text>
              </div>
              <div className='metric-icon order-icon'>
                <span>📦</span>
              </div>
            </div>
            <Title level={3} className='metric-value'>
              {totalOrders}
            </Title>
            <Text className='metric-comparison negative'>
              <ArrowDownOutlined /> Order down (previous 30 days)
            </Text>
            <Button type='link' className='details-button'>
              Full Details
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='metric-card'>
            <div className='metric-header'>
              <div>
                <Text className='metric-title'>New Customers</Text>
                <Text className='metric-subtitle'>(Last 30 Days)</Text>
              </div>
              <div className='metric-icon customers-icon'>
                <span>👥</span>
              </div>
            </div>
            <Title level={3} className='metric-value'>
              {totalCustomers}
            </Title>
            <Text className='metric-comparison positive'>
              <ArrowUpOutlined /> Customer up (previous 30 days)
            </Text>
            <Button type='link' className='details-button'>
              Full Details
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='metric-card'>
            <div className='metric-header'>
              <div>
                <Text className='metric-title'>Total Delivery</Text>
                <Text className='metric-subtitle'>(Last 30 Days)</Text>
              </div>
              <div className='metric-icon delivery-icon'>
                <span>🚚</span>
              </div>
            </div>
            <Title level={3} className='metric-value'>
              {deliveredOrderCount}
            </Title>
            <Text className='metric-comparison positive'>
              <ArrowUpOutlined /> Delivery up (previous 30 days)
            </Text>
            <Button type='link' className='details-button'>
              Full Details
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default NewStoreDashboard;
