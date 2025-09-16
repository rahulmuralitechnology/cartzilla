import { Card, Col, Flex, Row, Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { RootState } from "../../store/types/store";

function PieChartView() {
  const { stats } = useSelector((state: RootState) => state.dashboard);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill='white' textAnchor={x > cx ? "start" : "end"} dominantBaseline='central'>
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  if (!stats?.storesPerClient) {
    return <></>;
  }

  return (
    <>
      <Col xs={24} lg={6}>
        <Card title='Number of Stores per Client'>
          <ResponsiveContainer width='100%' height={290}>
            <PieChart style={{ maxWidth: 280 }}>
              <Pie
                data={stats?.storesPerClient?.map((s) => ({ name: s.username, value: s.numberOfStores }))}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill='#8884d8'
                dataKey='value'>
                {stats?.storesPerClient?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} lg={6}>
        <Card title='Number of Products per Client'>
          <ResponsiveContainer width='100%' height={290}>
            <PieChart style={{ maxWidth: 240 }}>
              <Pie
                data={stats?.storesPerClient.map((s) => ({ name: s.username, value: s.numberOfProducts }))}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill='#8884d8'
                dataKey='value'>
                {stats?.storesPerClient.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </>
  );
}

export default PieChartView;
