import React, { useDebugValue, useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Spin, Alert, Flex, Button, message, Space } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Store, Package, Grid, RefreshCcw } from "lucide-react";
import { RootState } from "../../store/types/store";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardData, setLoading } from "../../store/reducers/dashboardSlice";
import dashboardService from "../../services/dashboardService";
import roleConfig from "../../config/roleConfig";
import { useParams } from "react-router-dom";
import NewStoreDashboard from "./NewStoreDashboard";

const StoreAnalytics: React.FC = () => {
  const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const [refresh, setRefresh] = useState<boolean>(false);

  const dispatch = useDispatch();

  const getStoreStats = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setDashboardData(null));
    try {
      const response = await dashboardService.getStoreStats(id);
      dispatch(setDashboardData(response.data.stats));
    } catch (error) {
      console.log("Failed to fetch stats", error);
      message.error("Failed to fetch stats");
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getStoreStats(selectedStore?.id);
    }
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
    <div style={{ padding: "24px" }}>
      <Flex justify='space-between' align='middle' style={{ marginBottom: "15px" }}>
        <h2>Dashboard</h2>
        <Button type='text' icon={<RefreshCcw />} onClick={() => setRefresh(!refresh)} />
      </Flex>

      <NewStoreDashboard
        totalCustomers={stats.totalClients}
        totalOrders={stats.totalOrders as number}
        totalOrderRevenue={stats.totalOrderRevenue as number}
        deliveredOrderCount={stats.deliveredOrderCount as number}
      />
    </div>
  );
};

export default StoreAnalytics;
