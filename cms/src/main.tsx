import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import "./index.css";
import "./App.scss";
import { store } from "./store";
import { ConfigProvider, Segmented } from "antd";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import antThemeConfig from "./theme/antdThemeConfig";
import { DEFAULT_THEME } from "./theme/defaultTheme";

import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

createRoot(document.getElementById("root")!).render(
  // <ConfigProvider theme={antThemeConfig(DEFAULT_THEME) as any}>
  <ConfigProvider
    theme={
      {
        token: {
          colorPrimary: "#664EA3",
          borderRadius: 4,
          colorBorderSecondary: "#f0f0f078",
        },
        components: {
          Button: {
            colorPrimary: "#664EA3",
          },
          Segmented: {
            itemSelectedBg: "#664EA3",
            trackBg: "#a2a1dc",
            controlPaddingHorizontal: 30,
            itemColor: "#fff",

            itemSelectedColor: "#fff",
            itemHoverColor: "#fff",
          },
        },
      } as any
    }>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ConfigProvider>
);

// token: {
//   colorPrimary: "#664EA3",
//   borderRadius: 10,
//   colorBorderSecondary: "#f0f0f078",
// },
