import React from "react";
import { Input, Button, Space, message } from "antd";
import { Search } from "lucide-react";

interface PreviewHeaderProps {
  url: string;
  onUrlChange: (url: string) => void;
  onLoadUrl: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ url, onUrlChange, onLoadUrl }) => {
  const handleUrlSubmit = () => {
    if (!url.trim()) {
      message.error("Please enter a valid URL");
      return;
    }
    onLoadUrl();
  };

  return (
    <header className='p-4 bg-white border-b border-gray-200'>
      <div className='max-w-6xl mx-auto'>
        <Space size='middle' className='w-full'>
          <Input
            size='large'
            placeholder='Enter website URL (e.g., https://example.com)'
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onPressEnter={handleUrlSubmit}
            prefix={<Search className='text-gray-400' size={18} />}
            className='flex-1'
          />
          <Button type='primary' size='large' onClick={handleUrlSubmit}>
            Preview
          </Button>
        </Space>
      </div>
    </header>
  );
};

export default PreviewHeader;
