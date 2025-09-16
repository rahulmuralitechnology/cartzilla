"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
// import "./AddCustomDomain.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { DomainType } from "./AddCustomDomain";

interface DNSRecord {
  key: string;
  type: string;
  name: string;
  value: string;
  proxyStatus: string;
  ttl: string;
}

export default function DNSTable({
  customeDomain,
  ipAddress,
  domainType,
}: {
  customeDomain: string;
  ipAddress: string;
  domainType: DomainType;
}) {
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const columns: ColumnsType<DNSRecord> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: `Name (${domainType})`,
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      width: 200,
      key: "value",
    },
    {
      title: "Proxy status",
      dataIndex: "proxyStatus",
      key: "proxyStatus",
    },
    {
      title: "TTL",
      dataIndex: "ttl",
      key: "ttl",
    },
  ];

  const data: DNSRecord[] = [
    {
      key: "1",
      type: "A",
      name: domainType === DomainType.DOMAIN ? `${customeDomain} or @` : `${customeDomain.split(".")[0]}`,
      value: ipAddress,
      proxyStatus: "off",
      ttl: "Auto",
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}
