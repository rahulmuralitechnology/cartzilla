"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Empty,
  Tooltip,
  Badge,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  DownloadOutlined,
  CalendarOutlined,
  FormOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import SectionModal from "./SectionModal";
import "./CreatedSectionList.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import roleConfig from "../../config/roleConfig";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Section {
  id: string;
  title: string;
  description?: string;
  schema: any;
  formData: any;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export default function CreatedSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const { user } = useSelector((root: RootState) => root.user);
  const { selectedStore } = useSelector((root: RootState) => root.store);
  const navigate = useNavigate();

  // Mock data - In real app, this would come from API
  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockSections: Section[] = [
          {
            id: "1",
            title: "User Registration Form",
            description: "Complete user registration with validation",
            schema: { type: "object", properties: {} },
            formData: { firstName: "John", lastName: "Doe", email: "john@example.com" },
            status: "active",
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-20T14:45:00Z",
          },
          {
            id: "2",
            title: "Customer Feedback Survey",
            description: "Collect customer satisfaction data",
            schema: { type: "object", properties: {} },
            formData: { rating: 5, feedback: "Great service!" },
            status: "active",
            createdAt: "2024-01-10T09:15:00Z",
            updatedAt: "2024-01-18T16:20:00Z",
          },
          {
            id: "3",
            title: "Employee Onboarding",
            description: "New employee information collection",
            schema: { type: "object", properties: {} },
            formData: {},
            status: "draft",
            createdAt: "2024-01-22T11:00:00Z",
            updatedAt: "2024-01-22T11:00:00Z",
          },
          {
            id: "4",
            title: "Event Registration",
            description: "Conference registration form",
            schema: { type: "object", properties: {} },
            formData: { name: "Alice Smith", company: "Tech Corp" },
            status: "archived",
            createdAt: "2023-12-05T08:30:00Z",
            updatedAt: "2024-01-05T12:00:00Z",
          },
        ];

        setSections(mockSections);
        setFilteredSections(mockSections);
      } catch (error) {
        message.error("Failed to load sections");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Filter sections based on search and status
  useEffect(() => {
    let filtered = sections;

    if (searchTerm) {
      filtered = filtered.filter(
        (section) =>
          section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((section) => section.status === statusFilter);
    }

    setFilteredSections(filtered);
  }, [sections, searchTerm, statusFilter]);

  const handleView = (section: Section) => {
    setSelectedSection(section);
    setModalMode("view");
    setModalVisible(true);
  };

  const handleEdit = (section: Section) => {
    setSelectedSection(section);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSections(sections.filter((section) => section.id !== id));
      message.success("Section deleted successfully");
    } catch (error) {
      message.error("Failed to delete section");
    }
  };

  const handleStatusChange = async (id: string, newStatus: Section["status"]) => {
    try {
      const updatedSections = sections.map((section) =>
        section.id === id ? { ...section, status: newStatus, updatedAt: new Date().toISOString() } : section
      );
      setSections(updatedSections);
      message.success("Status updated successfully");
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const getStatusColor = (status: Section["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Section> = [
    {
      title: "Form Details",
      key: "details",
      render: (_, record) => (
        <div className='section-details'>
          <div className='section-title'>{record.title}</div>
          {record.description && <div className='section-description'>{record.description}</div>}
        </div>
      ),
      width: "40%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Section["status"], record) => (
        <Select value={status} onChange={(newStatus) => handleStatusChange(record.id, newStatus)} className='status-select' size='small'>
          <Option value='active'>
            <Badge status='success' text='Active' />
          </Option>
          <Option value='draft'>
            <Badge status='warning' text='Draft' />
          </Option>
          <Option value='archived'>
            <Badge status='default' text='Archived' />
          </Option>
        </Select>
      ),
      width: "15%",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className='date-info'>
          <CalendarOutlined />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      width: "15%",
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => (
        <div className='date-info'>
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      width: "15%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size='small'>
          <Tooltip title='View Details'>
            <Button type='text' icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title='Edit Section'>
            <Button type='text' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title='Download Data'>
            <Button type='text' icon={<DownloadOutlined />} />
          </Tooltip>
          <Popconfirm
            title='Are you sure you want to delete this section?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'>
            <Tooltip title='Delete Section'>
              <Button type='text' danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: "15%",
    },
  ];

  return (
    <div className='sections-page'>
      {/* Sections Table */}
      <Card className='table-card' styles={{ body: { padding: "0" } }} bordered={false}>
        {filteredSections.length === 0 && !loading ? (
          <Empty description='No sections found' image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: "60px 0" }}>
            <Button type='primary' icon={<PlusOutlined />} href='/'>
              Create Your First Section
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredSections}
            rowKey='id'
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} sections`,
              style: { padding: "0 20px" },
            }}
            className='sections-table'
            scroll={{ x: 1000 }}
          />
        )}
      </Card>

      {/* Section Modal */}
      <SectionModal
        visible={modalVisible}
        section={selectedSection}
        mode={modalMode}
        onClose={() => {
          setModalVisible(false);
          setSelectedSection(null);
        }}
        onSave={(updatedSection) => {
          setSections(sections.map((s) => (s.id === updatedSection.id ? updatedSection : s)));
          setModalVisible(false);
          message.success("Section updated successfully");
        }}
      />
    </div>
  );
}
