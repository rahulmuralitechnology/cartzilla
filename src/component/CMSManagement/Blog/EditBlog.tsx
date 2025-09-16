import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import BlogEditor from "./BlogEditor";
import { Link, useParams } from "react-router-dom";

export default function EditBlogPage() {
  const { id } = useParams() as { id: string };
  return (
    <div className='container'>
      <div className='page-header'>
        <Link to='/blog'>
          <Button icon={<ArrowLeftOutlined />}>Back to Blogs</Button>
        </Link>
        <h1 className='page-title'>Edit Blog Post</h1>
      </div>

      <BlogEditor  />
    </div>
  );
}
