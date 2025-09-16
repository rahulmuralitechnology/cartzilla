import React, { useState } from "react";
import { Content } from "antd/es/layout/layout";
import PreviewFrame from "./PreviewFrame";
import { IframeState } from "../../services/interfaces/previewSite";
import ViewportControls from "./PreviewControls";
import { RootState } from "../../store/types/store";
import { useSelector } from "react-redux";

const PreviewSite = () => {
  const { selectedStore } = useSelector((root: RootState) => root.store);
  const [state, setState] = useState<IframeState>({
    url: `https://${selectedStore?.domain}`,
    loading: false,
    error: null,
    viewport: {
      width: 768,
      height: 1024,
    },
  });

  const handleUrlChange = (newUrl: string) => {
    setState((prev) => ({ ...prev, url: newUrl }));
  };

  const handleLoadUrl = () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));
  };

  const handleIframeLoad = () => {
    setState((prev) => ({ ...prev, loading: false, error: null }));
  };

  const handleIframeError = () => {
    setState((prev) => ({
      ...prev,
      loading: false,
      error: "Failed to load the website. Please check the URL and try again.",
    }));
  };

  const handleViewportChange = (width: number, height: number) => {
    setState((prev) => ({
      ...prev,
      viewport: { width, height },
    }));
  };

  return (
    <section>
      <div style={{ marginBottom: 20 }}>
        <ViewportControls viewport={state.viewport} onViewportChange={handleViewportChange} />
      </div>
      <Content>
        <PreviewFrame
          url={state.url}
          viewport={state.viewport}
          loading={state.loading}
          error={state.error}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </Content>
    </section>
  );
};

export default PreviewSite;
