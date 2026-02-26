import { createStyles } from "antd-style";
import { colors } from "@/theme/colors";

export const useStyles = createStyles(({ css, token }) => {
  return {
    pageContainer: css`
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 24px;
      background-color: ${token.colorBgContainer};
      min-height: 100vh;
    `,

    mainContent: css`
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    `,

    // Header styles
    header: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
    `,

    title: css`
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      color: ${token.colorText};
    `,

    subtitle: css`
      font-size: 14px;
      color: ${token.colorTextSecondary};
      margin: 4px 0 0 0;
    `,

    // Filters styles
    filtersCard: css`
      background-color: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorder};
    `,

    filtersRow: css`
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: flex-end;
    `,

    filterItem: css`
      flex: 1;
      min-width: 180px;

      .ant-form-item {
        margin-bottom: 0;
      }
    `,

    // Table styles
    tableCard: css`
      background-color: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorder};

      .ant-table {
        background-color: ${token.colorBgContainer};
      }

      .ant-table-cell {
        padding: 12px 16px;
      }
    `,

    selectedRow: css`
      background-color: ${token.colorPrimaryBg} !important;
      cursor: pointer;
    `,

    // Details panel styles
    detailsPanel: css`
      display: flex;
      flex-direction: column;
      gap: 16px;
    `,

    detailsCard: css`
      background-color: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorder};

      .ant-descriptions-item-label {
        font-weight: 600;
      }
    `,

    // Stats card styles
    statsCard: css`
      background-color: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorder};

      .ant-statistic-title {
        font-size: 12px;
        color: ${token.colorTextSecondary};
        margin-bottom: 8px;
      }

      .ant-statistic-content {
        font-size: 24px;
        font-weight: 600;
        color: ${token.colorPrimary};
      }
    `,

    // Actions card styles
    actionsCard: css`
      background-color: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorder};

      .ant-btn {
        border-radius: ${token.borderRadius}px;
      }
    `,

    // Responsive adjustments
    "@media (max-width: 768px)": {
      filtersRow: css`
        flex-direction: column;
      `,

      filterItem: css`
        width: 100%;
      `,

      mainContent: css`
        grid-template-columns: 1fr;
      `,

      detailsPanel: css`
        grid-column: 1;
      `,
    },
  };
});
