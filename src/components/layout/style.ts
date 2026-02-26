import { createStyles, css } from "antd-style";
import { colors } from "@/theme/colors";
import '../../app/globals.css';

export const useStyles = createStyles({
  shell: css`
    min-height: 100vh;
  `,
  sider: css`
    background: ${colors.shell};
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    .ant-menu {
      background: ${colors.shell};
      border-right: none;
    }
  `,
  siderLogo: css`
    padding: 20px;
    color: ${colors.bgLayout};
    font-size: 1.85rem;
    font-weight: 100;
    font-family: "Inter", sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 1px solid ${colors.bgLayout};
  `,
  siderLogoDot: css`
    display: inline-block;
    width: 16px;
    height: 16px;
    background: ${colors.bgLayout};
    border-radius: 50%;
    margin-left: 2px;
    margin-top: 8px;
  `,
  contentArea: css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `,
  header: css`
    height: 88px;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${colors.primary};
    color: ${colors.bgLayout};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    @media (max-width: 768px) {
      padding: 0 16px;
    }
  `,
  headerTitle: css`
    font-size: 2.35rem;
    font-weight: 200;
    color: ${colors.shellText};
    font-family: "Inter", sans-serif;
    margin: 0;
    min-width: 0;
  `,
  headerRight: css`
    display: flex;
    align-items: center;
    gap: 20px;
    @media (max-width: 768px) {
      gap: 12px;
    }
  `,
  userIcon: css`
    font-size: 1.25rem;
    color: ${colors.shellText};
  `,
  logoutIcon: css`
    font-size: 1.25rem;
    color: ${colors.shellText};
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  `,
  main: css`
    padding: 24px;
    background: ${colors.bgLayout};
    flex: 1;
    @media (max-width: 768px) {
      padding: 16px;
    }
  `,
  page: css`
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  `,
  userMenuContent: css`
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    padding: 16px;
  `,
  userMenuTextStrong: css`
    font-size: 14px;
  `,
  userMenuTextSecondary: css`
    font-size: 12px;
  `,
  userMenuDivider: css`
    margin: 12px 0;
  `,
});