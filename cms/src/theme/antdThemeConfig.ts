import { DEFAULT_THEME } from "./defaultTheme";
import { ThemeSchema } from "./themeTypes";

export const themeColors = {
  dark: {
    bgPrimary: "#2c2c2c",
    bgSecondary: "#242424",
    fontPrimary: "#fff",
    fontSecondary: "#b9b9b9",
    colorSplit: "#454545",
    bgTertiary: "#131313",
  },
  light: {
    bgPrimary: "#ab4bfe",
    bgSecondary: "#A96CEA",
    fontPrimary: "#AB4BFE",
    fontSecondary: "#b9b9b9",
    colorSplit: "#454545",
    bgTertiary: "#131313",
  },
};
// export const getIconTheme = (
//   theme: Theme,
//   brand?: IBrandConfig
// ): { bgColor: string; brandColor: string; fontColor: string } => {
//   switch (theme) {
//     case "dark":
//       return {
//         bgColor: themeColors.dark.bgPrimary,
//         fontColor: themeColors.dark.fontSecondary,
//         brandColor: brand?.brandColor || "blue",
//       };
//     case "light":
//       return {
//         bgColor: "#fff",
//         fontColor: "#666",
//         brandColor: brand?.brandColor || "blue",
//       };
//     default:
//       return {
//         bgColor: "#fff",
//         fontColor: "#666",
//         brandColor: brand?.brandColor || "blue",
//       };
//   }
// };

const antThemeConfig = (siteConfig: ThemeSchema) => {
  return {
    token: {
      borderRadius: 8,
      colorText: siteConfig.brand?.brandColor,
      colorPrimary: `${siteConfig.brand?.brandColor}`,
      // colorSplit: "#888",
      // hoverBorderColor: `${siteConfig.brand?.brandColor}`,
      // // activeBorderColor: `${siteConfig.brand?.brandColor}`,
      // colorBorderSecondary: "#f0f0f078  ",
      colorTextDisabled: "#585e92",
      // colorTextDescription: "#000",
    },
    components: {
      // Layout: {
      //   bodyBg: "#f5f5f5",
      // },

      Button: {
        borderColorDisabled: "#b5aee4",
        textTextColor: "#fff",
        shadowColor: "transparent",
      },

      Steps: {
        iconFontSize: 30,
      },

      // Badge: {
      //   colorInfo: `${siteConfig.brand?.brandColor}`,
      // },
      // Progress: {
      //   remainingColor: "#666",
      //   defaultColor: `${siteConfig.brand?.brandColor}`,
      // },
      // Tree: {
      //   nodeSelectedBg: "#fff",
      //   directoryNodeSelectedBg: "#fff",
      //   directoryNodeSelectedColor: "#000",
      // },
      // Modal: {
      //   contentBg: "#fff",
      //   headerBg: "#fff",
      // },
      // Menu: {
      //   itemColor: "#666",
      //   itemActiveBg: "#eee",
      //   itemSelectedBg: "#eee",
      //   itemSelectedColor: "#000",
      //   itemBg: "#fff",
      // },
      // Divider: {
      //   colorSplit: "#d9d9d9",
      // },
      // Statistic: {
      //   contentFontSize: 12,
      //   titleFontSize: 12,
      //   marginXXS: 0,
      //   colorTextDescription: "#000",
      // },
      // Popover: {
      //   colorBgElevated: "#fff",

      //   boxShadowSecondary: "0 4px 4px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      // },
      Radio: {
        buttonSolidCheckedActiveBg: DEFAULT_THEME.brand.brandColor,
        buttonSolidCheckedBg: DEFAULT_THEME.brand.brandColor,
        buttonBg: "transparent",
        buttonColor: "#000",
      },
      // Sider: {
      //   color: "#666",
      // },
      Card: {
        paddingLG: 20,
        // colorBorderSecondary: "#654ea3",
        actionsBg: "#505285",
        extraColor: "#fff",
      },
      // Carousel: {
      //   colorBgContainer: `${siteConfig.brand?.brandColor}`,
      // },
      Form: {
        labelColor: "#000",
      },

      Input: {
        activeBG: "#f5f2f2",
      },
      // Dropdown: {
      //   colorPrimary: "#666",
      //   controlItemBgActive: "#EEE",
      //   controlItemBgActiveHover: "#dcdcdc",
      // },
      // Tag: {
      //   defaultBg: "#eee",
      //   defaultColor: "#888",
      // },

      // Tabs: {
      //   inkBarColor: "#000",
      //   itemColor: "#666",
      //   itemActiveColor: "#000",
      //   itemSelectedColor: "#000",
      //   itemHoverColor: "#000",
      // },
      // Drawer: {
      //   zIndexPopup: 1001,
      //   padding: 10,
      //   footerPaddingInline: 20,
      //   footerPaddingBlock: 10,
      //   paddingLG: 20,
      //   colorSplit: "#eee",
      // },
      Collapse: {
        headerBg: siteConfig.brand?.brandColor,
      },
      Segmented: {
        itemSelectedBg: siteConfig.brand?.brandColor,
        trackBg: "#a2a1dc",
        controlPaddingHorizontal: 30,
        marginSM: 10,
        itemColor: "#fff",
        itemSelectedColor: "#fff",
        itemHoverColor: "#fff",
      },
    },
  };
};

export default antThemeConfig;
