"use client";

import { useState, useEffect } from "react";
import { Button, Form, Input, message, Card, Select, Flex, Space, Switch } from "antd";
import "../../../styles/BlogsPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { BlogPost } from "../../../services/interfaces/blog";
import blogService from "../../../services/blogService";
import { ArrowLeft } from "lucide-react";
import UploadInput from "../../common/UploadInput";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
const { Option } = Select;

const categories = ["Technology", "Travel", "Food", "Lifestyle", "Business", "Health", "Education", "Entertainment"];

export default function BlogEditor() {
  const { selectedStore } = useSelector((root: RootState) => root.store);

  const router = useNavigate();
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams() as { blogId: string; storeId: string };
  const isEditMode = !!params.blogId;

  useEffect(() => {
    if (isEditMode) {
      loadBlogData();
    }
  }, [params.blogId]);

  const loadBlogData = async () => {
    try {
      setInitialLoading(true);
      const result = await blogService.getBlogPostById(params.blogId!);
      const blog = result.data.blog;

      if (blog) {
        form.setFieldsValue({
          title: blog.title,
          summary: blog.summary,
          category: blog.category,
          coverImage: blog.coverImage,
          isPublished: blog.isPublished,
        });

        setContent(blog.content);

        if (blog.coverImage) {
          setCoverImageUrl(blog.coverImage);
        }
      } else {
        message.error("Blog post not found");
        router(`/store/${params.storeId}/blogs`);
      }
    } catch (error) {
      console.error("Error loading blog data:", error);
      message.error("Failed to load blog data");
    } finally {
      setInitialLoading(false);
    }
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Combine form values with the rich text content
      const blogData: BlogPost = {
        ...values,
        content,
      };

      if (params.blogId) {
        await blogService.updateBlogPost({ ...blogData, storeId: selectedStore?.id }, params.blogId);
      } else {
        await blogService.saveBlogPost({ ...blogData, storeId: selectedStore?.id });
      }

      message.success(`Blog post ${isEditMode ? "updated" : "created"} successfully!`);

      // Redirect to blog list
      router(`/store/${params.storeId}/blogs`);
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} blog post:`, error);
      message.error(`Failed to ${isEditMode ? "update" : "create"} blog post`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);

    // Clear the coverImageUrl if the file is removed
    if (fileList.length === 0) {
      setCoverImageUrl(null);
    }
  };

  if (initialLoading) {
    return (
      <div className='loading-container'>
        <Card className='editor-loading-card'>
          <div className='editor-loading'>
            <Button type='primary' loading>
              Loading...
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <section className='bloomi5_page'>
      <Flex justify='space-between' align='center' style={{ marginBottom: 15 }}>
        <h2>Create Blog</h2>
        <Space>
          <Button type='text' icon={<ArrowLeft />} onClick={() => navigate(-1)} className='back-button'>
            Go Back
          </Button>
          <Space>
            <Button onClick={() => router("/blog")}>Cancel</Button>
            <Button type='primary' onClick={() => form.submit()} loading={loading}>
              {isEditMode ? "Update" : "Save"} Blog
            </Button>
          </Space>
        </Space>
      </Flex>
      <Card className='blog-editor-card'>
        <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ category: "Technology" }}>
          <Form.Item name='title' label='Blog Title' rules={[{ required: true, message: "Please enter a title" }]}>
            <Input placeholder='Enter blog title' size='large' />
          </Form.Item>

          <Form.Item name='summary' label='Summary' rules={[{ required: true, message: "Please enter a summary" }]}>
            <Input.TextArea placeholder='Write a brief summary of your blog post' rows={3} />
          </Form.Item>

          <Form.Item name='category' label='Category' rules={[{ required: true, message: "Please select a category" }]}>
            <Select placeholder='Select a category'>
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Content' required rules={[{ required: true, message: "Please enter content" }]}>
            <div className='quill-editor-container'>
              <ReactQuill
                theme='snow'
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder='Write your blog content here...'
              />
            </div>
          </Form.Item>
          <Space align='start' size='large'>
            <Form.Item name='coverImage' label='Cover Image'>
              <UploadInput
                imageUrl={form.getFieldValue("coverImage")}
                onUploadRes={(file) => {
                  form.setFieldValue("coverImage", file.response?.data.url || URL.createObjectURL(file.originFileObj as Blob));
                }}
              />
            </Form.Item>

            <Form.Item name='isPublished' label='Publish'>
              <Switch checked={form.getFieldValue("isPublished")} onChange={(checked) => form.setFieldValue("isPublished", checked)} />
            </Form.Item>
          </Space>
        </Form>
      </Card>
    </section>
  );
}
