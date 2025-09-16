import React, { useEffect } from "react";
import { Avatar, Button, message, Space, Table, Tag } from "antd";
import { TemplateType } from "../../services/interfaces/common";
import TemplateForm from "./TemplateForm";
import { Template } from "../../services/interfaces/template";
import templateService from "../../services/templateService";
import moment from "moment";
import { Edit } from "lucide-react";
import { EditFilled } from "@ant-design/icons";

const TemplateList: React.FC = ({}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [template, setTemplate] = React.useState<Template | null>(null);
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const columns: any = [
    {
      title: "Image",
      dataIndex: "previewImage",
      key: "previewImage",
      render: (previewImage: string) => <Avatar shape='square' size='small' src={previewImage} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "templateType",
      key: "templateType",
      render: (type: TemplateType) => <Tag color={type === TemplateType.webapp ? "blue" : "orange"}>{type?.toUpperCase()}</Tag>,
    },
    {
      title: "Latest Version",
      dataIndex: "latestVersion",
      key: "latestVersion",
      align: "right",
    },
    // {
    //   title: "Current Version",
    //   dataIndex: "currentVersion",
    //   key: "currentVersion",
    // },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <Tag color={isActive ? "success" : "error"}>{isActive ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date, record: Template) => moment(record.createdAt).format("DD/MM/YYYY"),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Template) => (
        <Space size='middle'>
          <Button
            type='text'
            size='small'
            onClick={() => {
              setIsOpen(true);
              setTemplate(record);
            }}>
            <EditFilled />
          </Button>
        </Space>
      ),
    },
  ];

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const reuselt = await templateService.getAllTemplates();
      setTemplates(reuselt.data.templates);
      setLoading(false);
    } catch (error: any) {
      message.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [refresh]);

  return (
    <section>
      <div>
        <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: "15px" }}>
          <h2>Theme List</h2>
          <Button type='primary' onClick={() => setIsOpen(true)}>
            Create Theme
          </Button>
        </Space>
        <Table columns={columns} dataSource={templates} rowKey='id' />
      </div>

      <TemplateForm
        initialValues={template}
        onRefresh={() => setRefresh(!refresh)}
        isOpen={isOpen}
        onCloseModal={() => {
          setIsOpen(false);
          setTemplate(null);
        }}
      />
    </section>
  );
};

export default TemplateList;
