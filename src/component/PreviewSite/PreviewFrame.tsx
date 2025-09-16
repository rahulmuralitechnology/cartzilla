import React from "react";
import { Spin, Alert } from "antd";
import "./PreviewFrame.css";

interface PreviewFrameProps {
  url: string;
  viewport: { width: number; height: number };
  loading: boolean;
  error: string | null;
  onLoad: () => void;
  onError: () => void;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ url, viewport, loading, error, onLoad, onError }) => {
  return (
    <div className='preview-container'>
      <div className='preview-wrapper'>
        {loading && (
          <div className='loading-overlay'>
            <Spin size='large' tip='Loading preview...' />
          </div>
        )}

        {error && <Alert message='Error' description={error} type='error' showIcon className='error-message' />}

        <div
          className='preview-frame'
          style={{
            width: viewport.width,
            height: viewport.height,
            transform: viewport.width > window.innerWidth - 64 ? `scale(${(window.innerWidth - 64) / viewport.width})` : "none",
            transformOrigin: "top left",
          }}>
          {url && (
            <iframe
              src={url}
              width={viewport.width}
              height={viewport.height}
              onLoad={onLoad}
              onError={onError}
              style={{ border: "none" }}
              title='Website Preview'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;
