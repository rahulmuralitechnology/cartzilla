"use client";

import { useState, useEffect } from "react";
import { Spin, Tag, message, Typography, Button, Flex, Space } from "antd";

import { BlogPost } from "../../../services/interfaces/blog";
import moment from "moment";
import blogService from "../../../services/blogService";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const { Title, Paragraph } = Typography;

export default function BlogViewer() {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { blogId } = useParams() as { blogId: string };

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const result = await blogService.getBlogPostById(blogId);
        setBlog(result.data.blog);
      } catch (error) {
        console.error("Error loading blog:", error);
        message.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className='loading-container'>
        <Spin size='large' />
      </div>
    );
  }

  if (!blog) {
    return <div>No blog found.</div>;
  }

  return (
    <section className='bloomi5_page'>
      <Flex justify='space-between' align='center' style={{ marginBottom: 15 }}>
        <h2>View Blog</h2>
        <Space>
          <Button type='text' icon={<ArrowLeft />} onClick={() => navigate(-1)} className='back-button'>
            Go Back
          </Button>
        </Space>
      </Flex>
      <article className='blog-article'>
        {blog.coverImage && (
          <div className='blog-cover'>
            <img src={blog.coverImage || "/placeholder.svg?height=400&width=800"} alt={blog.title} className='blog-cover-image' />
          </div>
        )}

        <Title level={1} className='blog-title'>
          {blog.title}
        </Title>

        <div className='blog-meta'>
          <Tag color='blue'>{blog.category}</Tag>
          <span className='blog-date'>
            {blog.updatedAt ? `Updated ${moment(blog.updatedAt).fromNow()}` : `Created ${moment(blog.createdAt).fromNow()}`}
          </span>
        </div>

        <div className='blog-summary'>
          <Title level={4}>Summary</Title>
          <Paragraph>{blog.summary}</Paragraph>
        </div>

        <div className='blog-content' dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </section>
  );
}
