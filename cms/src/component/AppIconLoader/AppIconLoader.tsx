import { FC } from "react";
import "./AppIconLoader.scss";

const AppIconLoader: FC<{ width?: number | string; height?: number | string }> = ({ width = 50, height = 50 }) => {
  return (
    <div className='app-icon-loader' style={{ width, height }}>
      <div></div>
    </div>
  );
};

export default AppIconLoader;
