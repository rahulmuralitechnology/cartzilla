"use client";

import { useState, useEffect } from "react";
import { Card, Empty, Spin, Popconfirm, message, Row, Col, Button, Flex, Space, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

import { Link, useNavigate, useParams } from "react-router-dom";
import { BlogPost } from "../../../services/interfaces/blog";
import moment from "moment";
import blogService from "../../../services/blogService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ArrowLeft } from "lucide-react";

export default function BlogList() {
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const navigate = useNavigate();
  // State to store blog dat
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { storeId } = useParams() as { storeId: string };

  useEffect(() => {
    loadBlogs();
  }, [selectedStore?.id]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogService.getBlogPost(selectedStore?.id || "");
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error("Error loading blogs:", error);
      // message.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogService.deleteBlogPost(selectedStore?.id as string, id);
      message.success("Blog deleted successfully");
      loadBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className='loading-container'>
        <Spin size='large' />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className='bloomi5_page'>
        <Flex justify='space-between' align='center' style={{ marginBottom: 15 }}>
          <h2>Blogs</h2>
          <Space>
            <Button type='text' icon={<ArrowLeft />} onClick={() => navigate(-1)} className='back-button'>
              Go Back
            </Button>
          </Space>
        </Flex>
        <Empty description='No blogs found' image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button onClick={() => navigate(`/store/${storeId}/cms/page/create-blog`)} type='primary'>
            Create Now
          </Button>
        </Empty>
      </section>
    );
  }

  return (
    <section className='bloomi5_page'>
      <Flex justify='space-between' align='center' style={{ marginBottom: 15 }}>
        <h2>Blogs</h2>
        <Space>
          <Button type='text' icon={<ArrowLeft />} onClick={() => navigate(-1)} className='back-button'>
            Go Back
          </Button>
          {blogs.length > 0 && (
            <Button onClick={() => navigate(`/store/${storeId}/cms/page/create-blog`)} type='primary'>
              Create Now
            </Button>
          )}
        </Space>
      </Flex>
      <Row gutter={[24, 24]} className='blog-list'>
        {blogs.map((blog) => (
          <Col xs={24} sm={12} lg={8} key={blog.id}>
            <Card
              hoverable
              className='blog-card'
              title={
                <Space>
                  <h3>{blog.title}</h3>
                  {blog.isPublished ? <Tag color='success'>Published</Tag> : <Tag>Draft</Tag>}
                </Space>
              }
              cover={
                blog.coverImage ? (
                  <div className='blog-card-cover'>
                    <img alt={blog.title} src={blog.coverImage || "/placeholder.svg?height=200&width=400"} className='blog-card-image' />
                  </div>
                ) : (
                  <div className='blog-card-cover blog-card-cover-empty'>
                    <span>No cover image</span>
                  </div>
                )
              }
              actions={[
                <Link key='view' to={`/store/${storeId}/blog/${blog.id}`}>
                  <EyeOutlined /> View
                </Link>,
                <Link key='edit' to={`/store/${storeId}/blog/update/${blog.id}`}>
                  <EditOutlined /> Edit
                </Link>,
                <Popconfirm
                  key='delete'
                  title='Delete this blog?'
                  description='Are you sure you want to delete this blog post?'
                  onConfirm={() => handleDelete(blog.id)}
                  okText='Yes'
                  cancelText='No'>
                  <DeleteOutlined /> Delete
                </Popconfirm>,
              ]}>
              <Card.Meta
                title={blog.category}
                description={
                  <div className='blog-card-description'>
                    <p className='blog-card-summary'>{blog.summary}</p>
                    <p className='blog-card-date'>
                      {blog.updatedAt ? `Updated ${moment(blog.updatedAt).fromNow()}` : `Created ${moment(blog.createdAt).fromNow()}`}
                    </p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
