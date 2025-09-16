import { Button, Flex, Form, message, Popconfirm, Table, Tabs, Tag } from "antd";
import React, { FC, useEffect, useState } from "react";
import "../../styles/CodeSnippets.scss";
import AddCodeSnippetsForm from "../../component/CodeSnippets/AddCodeSnippetsForm";
import { CodeSnippets } from "../../services/interfaces/CodeSnippets";
import siteConfigService from "../../services/siteConfigService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { set } from "lodash";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import RobotsTxtManager from "./RobotTxtCode";

const CodeSnippetsPage: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippets[]>([]);
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const [selectedScript, setSelectedScript] = useState<CodeSnippets | null>(null);
  const [refreh, setRefreh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("1"); // Add tab state
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const value = await form.validateFields();
      if (selectedScript) {
        setCodeSnippets(codeSnippets.map((item) => (item.id === selectedScript.id ? value : item)));
        await siteConfigService.saveCustomScript(
          selectedStore?.id as string,
          codeSnippets.map((item) => (item.id === selectedScript.id ? value : item))
        );
        message.success("Code snippet updated successfully");
      } else {
        setCodeSnippets([...codeSnippets, value]);
        await siteConfigService.saveCustomScript(selectedStore?.id as string, [
          ...codeSnippets,
          { ...value, id: new Date().getTime().toString() },
        ]);
        message.success("Code snippet added successfully");
      }
      setIsModalVisible(false);
      setLoading(false);
      setRefreh(!refreh);
      form.resetFields();
      setSelectedScript(null);
    } catch (error: any) {
      setLoading(false);

      if (error?.errorFields?.length) {
        message.error("Fields are missing");
      } else {
        message.error(error.message);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedScript(null);
    form.resetFields();
  };

  const onDeleteCodeSnippet = async (id: string) => {
    try {
      setLoading(true);
      const newCodeSnippets = codeSnippets.filter((item) => item.id !== id);
      setCodeSnippets(newCodeSnippets);
      await siteConfigService.saveCustomScript(selectedStore?.id as string, newCodeSnippets);
      setLoading(false);
      message.success("Code snippet deleted successfully");
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "snippetType",
      key: "snippetType",
    },
    {
      title: "Status",
      dataIndex: "snippetStatus",
      key: "snippetStatus",
      render: (status: string) => <Tag color={status === "active" ? "green" : "red"}>{status?.toUpperCase()}</Tag>,
    },
    {
      title: "Location",
      dataIndex: "injectLocation",
      key: "injectLocation",
    },
    // {
    //   title: "Last Modified",
    //   dataIndex: "lastModified",
    //   key: "lastModified",
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: CodeSnippets) => (
        <>
          <span
            onClick={() => {
              setSelectedScript(record);
              setIsModalVisible(true);
            }}
            style={{ marginRight: 8, cursor: "pointer" }}>
            <EditFilled />
          </span>

          <Popconfirm
            title={`Are you sure want to delete?`}
            onConfirm={() => {
              onDeleteCodeSnippet(record.id);
            }}
            okText='Yes'
            cancelText='No'>
            <Button danger type='text'>
              <DeleteFilled />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const getCustomScripts = async (id: string) => {
    try {
      setListLoading(true);
      const data = await siteConfigService.getCustomScript(id);
      setCodeSnippets(data.data.scripts);
      setListLoading(false);
    } catch (error: any) {
      setListLoading(false);
      console.log(error);
      // message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedStore?.id) {
      getCustomScripts(selectedStore?.id);
    }
  }, [selectedStore?.id, refreh]);
  return (
    <section className='bloomi5_page code_snippet_page'>
      <Flex justify='space-between' align='middle' style={{ marginBottom: "15px" }}>
        <h2>Code Snippets</h2>
      </Flex>
      <Tabs
        tabBarExtraContent={
          tab !== "7" && (
            <Button type='primary' onClick={showModal}>
              Add New
            </Button>
          )
        }
        defaultActiveKey='1'
        type='card'
        activeKey={tab}
        onChange={(key: string) => setTab(key)}
        tabBarStyle={{ marginBottom: 0 }}>
        <Tabs.TabPane tab='All' key='1'>
          <Table loading={listLoading} dataSource={codeSnippets} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Analytics' key='2'>
          <Table dataSource={codeSnippets.filter((item) => item.snippetType === "Analytics")} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Marketing' key='3'>
          <Table dataSource={codeSnippets.filter((item) => item.snippetType === "Marketing")} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Functionality' key='4'>
          <Table dataSource={codeSnippets.filter((item) => item.snippetType === "Functionality")} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Custom' key='5'>
          <Table dataSource={codeSnippets.filter((item) => item.snippetType === "Custom")} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Recent' key='6'>
          <Table dataSource={codeSnippets} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='RobotTxt' key='7'>
          <RobotsTxtManager storeId={selectedStore?.id} />
        </Tabs.TabPane>
      </Tabs>
      <AddCodeSnippetsForm
        loading={loading}
        selectedScript={selectedScript}
        isOpen={isModalVisible}
        handleCancel={handleCancel}
        handleOk={handleOk}
        formInstance={form}
      />
    </section>
  );
};

export default CodeSnippetsPage;
