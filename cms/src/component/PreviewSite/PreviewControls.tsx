import React from "react";
import { Radio, Space, InputNumber } from "antd";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { ViewportPreset } from "../../services/interfaces/previewSite";

const presets: ViewportPreset[] = [
  { name: "Desktop", width: 1920, height: 1080, icon: "Monitor" },
  { name: "Tablet", width: 768, height: 1024, icon: "Tablet" },
  { name: "Mobile", width: 375, height: 667, icon: "Smartphone" },
];

interface ViewportControlsProps {
  viewport: { width: number; height: number };
  onViewportChange: (width: number, height: number) => void;
}

const ViewportControls: React.FC<ViewportControlsProps> = ({ viewport, onViewportChange }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Monitor":
        return <Monitor size={16} />;
      case "Tablet":
        return <Tablet size={16} />;
      case "Smartphone":
        return <Smartphone size={16} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Space direction='horizontal' size='large' className='preview-container-page'>
        <Radio.Group
          buttonStyle='solid'
          block
          optionType='button'
          value={presets.find((p) => p.width === viewport.width && p.height === viewport.height)?.name || "custom"}
          onChange={(e) => {
            const preset = presets.find((p) => p.name === e.target.value);
            if (preset) {
              onViewportChange(preset.width, preset.height);
            }
          }}>
          {presets.map((preset) => (
            <Radio.Button key={preset.name} value={preset.name}>
              <Space>
                {getIcon(preset.icon)}
                {preset.name}
              </Space>
            </Radio.Button>
          ))}
        </Radio.Group>

        <Space>
          <InputNumber
            addonBefore='W'
            value={viewport.width}
            onChange={(value) => onViewportChange(value || 1920, viewport.height)}
            min={320}
            max={1920}
          />
          <InputNumber
            addonBefore='H'
            value={viewport.height}
            onChange={(value) => onViewportChange(viewport.width, value || 1080)}
            min={320}
            max={1080}
          />
        </Space>
      </Space>
    </div>
  );
};

export default ViewportControls;
