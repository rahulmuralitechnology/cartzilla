import React, { useEffect, useState } from "react";
import { Card, Table, Tag } from "antd";
import { IRequestCustomTheme } from "../../services/interfaces/common";
import appService from "../../services/appService";

const columns = [
  {
    title: "Business Name",
    dataIndex: "businessName",
    key: "businessName",
  },
  {
    title: "Additional Info",
    dataIndex: "additionalInfo",
    key: "additionalInfo",
  },
  {
    title: "References",
    dataIndex: "references",
    key: "references",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Store Category",
    dataIndex: "storeCategory",
    key: "storeCategory",
    render: (text: string) => {
      if (text === "webapp") {
        return <Tag color='blue'>Web App</Tag>;
      } else {
        return <Tag color='green'>Website</Tag>;
      }
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => new Date(text).toLocaleString().split(", ")[0],
  },
];

const ListRequestTheme: React.FC = () => {
  const [requestedThemes, setRequestedThemes] = useState<IRequestCustomTheme[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getRequestThemes = async () => {
    setLoading(true);
    try {
      const result = await appService.getRequestTheme();
      setRequestedThemes(result.data.reverse());
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequestThemes();
  }, []);
  return (
    <Card title='Requested Theme' bodyStyle={{ padding: 0 }}>
      <Table loading={loading} dataSource={requestedThemes} columns={columns} rowKey='id' />
    </Card>
  );
};

export default ListRequestTheme;
