import React, { useDebugValue, useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Spin, Alert, Flex, Button, message } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Store, Package, Grid, RefreshCcw } from "lucide-react";
import { RootState } from "../../store/types/store";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardData, setLoading } from "../../store/reducers/dashboardSlice";
import dashboardService from "../../services/dashboardService";
import PieChartView from "./PieChart";

const Analytics: React.FC = () => {
  const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [refresh, setRefresh] = useState<boolean>(false);
  const dispatch = useDispatch();

  const getDashboardStat = async () => {
    dispatch(setLoading(true));
    dispatch(setDashboardData(null));
    try {
      const response = await dashboardService.getDashboardStats();
      dispatch(setDashboardData(response.data.stats));
    } catch (error) {
      message.error("Failed to fetch stats");
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    getDashboardStat();
  }, [refresh]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className='bloomi5_page' style={{ padding: "24px" }}>
      <Flex justify='space-between' align='middle'>
        <h1 style={{ fontSize: "24px", marginBottom: "24px" }}>Admin Dashboard</h1>
        <Button type='text' icon={<RefreshCcw />} onClick={() => setRefresh(!refresh)} />
      </Flex>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title='Total Clients' value={stats.totalClients} prefix={<Users size={20} style={{ marginRight: "8px" }} />} />
          </Card>
        </Col>
        {stats?.storesPerClient && (
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title='Total Stores ' value={stats.storeCount} prefix={<Store size={20} style={{ marginRight: "8px" }} />} />
            </Card>
          </Col>
        )}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title='Total Products' value={stats.totalProducts} prefix={<Package size={20} style={{ marginRight: "8px" }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title='Total Categories' value={stats.totalCategories} prefix={<Grid size={20} style={{ marginRight: "8px" }} />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <PieChartView />
        <Col xs={24} lg={12}>
          <Card title='Client Growth'>
            <div style={{ height: "290px", width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={stats.clientGrowthData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='count' fill='#1890ff' name='Clients' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
