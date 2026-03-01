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

  filtersCard: css`
    margin-bottom: ${token.marginLG}px;
    background-color: ${colors.light};

    :global(.ant-card-head) {
      background-color: ${colors.secondary};
    }

    :global(.ant-card-body) {
      background-color: ${colors.bgLayout};
    }
  `,

  reportCard: css`
    margin-bottom: ${token.marginLG}px;
    background-color: ${colors.light};

    :global(.ant-card-head) {
      background-color: ${colors.secondary};
    }

    :global(.ant-card-body) {
      background-color: ${colors.bgLayout};
    }

    :global(.ant-table),
    :global(.ant-table-container),
    :global(.ant-table-content),
    :global(.ant-table-cell),
    :global(.ant-table-thead > tr > th),
    :global(.ant-table-tbody > tr > td) {
      background-color: ${colors.bgLayout};
    }
  `,

  tabsContainer: css`
    .ant-tabs-nav {
      margin-bottom: ${token.marginMD}px;
    }
  `,

  emptyState: css`
    padding: ${token.paddingLG}px;
    text-align: center;
    color: ${token.colorTextSecondary};
  `,

  metricCard: css`
    text-align: center;
  `,

  metricValue: css`
    font-size: ${token.fontSizeHeading2}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorPrimary};
  `,

  metricLabel: css`
    font-size: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
    margin-top: ${token.marginXS}px;
  `,
}));

// Keep these for backwards compatibility if needed
export const reportsContainerStyle = { padding: "24px" };
export const reportsHeaderStyle = { marginBottom: "24px" };
export const filtersCardStyle = { marginBottom: "16px" };
export const tabsStyle = { marginTop: "16px" };
export const reportCardStyle = { marginBottom: "16px" };
export const emptyStateStyle = { padding: "48px", textAlign: "center" as const };
export const metricCardStyle = { textAlign: "center" as const };
export const metricValueStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1890ff",
};
export const metricLabelStyle = {
  fontSize: "14px",
  color: "#8c8c8c",
  marginTop: "8px",
};
