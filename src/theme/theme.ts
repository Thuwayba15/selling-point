import type { ThemeConfig } from "antd";

import { colors } from "./colors";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorInfo: colors.primary,

    colorBgLayout: colors.bgLayout,
    colorBgContainer: colors.bgContainer,

    colorText: colors.text,
    colorTextSecondary: colors.textSecondary,

    borderRadius: 10,
    fontSize: 14,
  },
  components: {
    Layout: {
      headerBg: colors.shell,
      siderBg: colors.shell,
      bodyBg: colors.bgLayout,
    },
    Menu: {
      darkItemBg: colors.shell,
      darkItemColor: colors.shellText,
      darkItemHoverBg: colors.shellHover,
      darkItemHoverColor: colors.shellText,

      darkItemSelectedBg: colors.shellSelected,
      darkItemSelectedColor: colors.shellText,

      itemBorderRadius: 10,
    },
    Button: {
      borderRadius: 10,
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
};
