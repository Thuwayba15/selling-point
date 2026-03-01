import { createStyles } from "antd-style";
import { colors } from "@/theme/colors";

export const useStyles = createStyles(({ token, css }) => ({
  pageContainer: css`
    padding: ${token.paddingSM}px;
    background-color: ${token.colorBgLayout};
    min-height: 100vh;

    @media (max-width: 768px) {
      padding: ${token.paddingXS}px;
    }
  `,

  mainContent: css`
    max-width: 1400px;
    margin: 0 auto;
  `,

  header: css`
    margin-bottom: ${token.marginLG}px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${token.margin}px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  `,

  headerText: css`
    flex: 1;
  `,

  title: css`
    margin: 0;
    font-size: ${token.fontSizeHeading2}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    font-style: italic;
  `,

  subtitle: css`
    margin: ${token.marginXS}px 0 0;
    font-size: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
  `,

  cardSection: css`
    margin-bottom: ${token.marginLG}px;
    background-color: ${colors.light};

    :global(.ant-card-head) {
      background-color: ${colors.secondary};
    }

    :global(.ant-card-body) {
      background-color: ${colors.bgLayout};
    }
  `,

  cardDescription: css`
    color: ${token.colorTextSecondary};
    margin: 0;
  `,

  tableCard: css`
  margin-bottom: ${token.marginLG}px;
  background-color: ${colors.primary};

  & .ant-card-head {
    background-color: ${colors.shell};
    color: ${token.colorTextLightSolid};
  }

  & .ant-card-body {
    background-color: ${colors.white};
  }

  & .ant-table,
  & .ant-table-container,
  & .ant-table-content,
  & .ant-table-cell,
  & .ant-table-thead > tr > th,
  & .ant-table-tbody > tr > td {
    background-color: ${colors.white} !important;
  }
`,

  noMembers: css`
    color: ${token.colorTextSecondary};
    text-align: center;
    padding: ${token.paddingLG}px 0;
  `,

  successMessage: css`
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    text-align: center;
  `,

  successTitle: css`
    font-size: 16px;
    color: #52c41a;
    margin-bottom: 8px;
    font-weight: 500;
  `,

  successText: css`
    color: ${token.colorTextSecondary};
    margin: 0;
  `,

  roleLabel: css`
    margin-bottom: 10px;
  `,

  linkContainer: css`
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    word-break: break-all;
    font-size: 12px;
    font-family: monospace;
  `,

  backupLinkText: css`
    color: ${token.colorTextSecondary};
    font-size: 13px;
    margin-bottom: 12px;
  `,
}));
