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
  `,

  filtersRow: css`
    display: flex;
    gap: ${token.margin}px;
    flex-wrap: wrap;
    align-items: flex-end;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: ${token.marginSM}px;
    }
  `,

  filterItem: css`
    flex: 1;
    min-width: 200px;

    @media (max-width: 768px) {
      width: 100%;
      min-width: 100%;
    }
  `,

  filtersActions: css`
    display: flex;
    gap: ${token.marginXS}px;
  `,

  tableCard: css`
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

  inlineFiltersBar: css`
    margin-bottom: ${token.marginLG}px;
    background-color: ${colors.light};
    padding: ${token.padding}px;
    border-radius: ${token.borderRadius}px;
  `,

  inlineFiltersForm: css`
    display: flex;
    gap: ${token.margin}px;
    align-items: flex-end;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: ${token.marginSM}px;
    }
  `,

  inlineFilterItem: css`
    margin-bottom: 0;
  `,

  inlineFilterActionsItem: css`
    margin-bottom: 0;
    margin-left: auto;
  `,

  tableRow: css`
    cursor: pointer;
  `,

  highlightedRow: css`
    cursor: pointer;
    background-color: ${token.colorPrimaryBg} !important;

    &:hover {
      background-color: ${token.colorPrimaryBgHover} !important;
    }
  `,

  detailsCard: css`
    margin-bottom: ${token.marginLG}px;
  `,

  detailsSection: css`
    margin-bottom: ${token.marginLG}px;
  `,

  detailsTitle: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: ${token.fontWeightStrong};
    margin-bottom: ${token.marginSM}px;
    color: ${token.colorText};
  `,

  detailRow: css`
    display: flex;
    padding: ${token.paddingXS}px 0;
    border-bottom: 1px solid ${token.colorBorderSecondary};

    &:last-child {
      border-bottom: none;
    }
  `,

  detailLabel: css`
    flex: 0 0 180px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorTextSecondary};
  `,

  detailValue: css`
    flex: 1;
    color: ${token.colorText};
  `,

  actionsCard: css`
    margin-bottom: ${token.marginLG}px;
  `,

  actionButton: css`
    width: 100%;
    margin-bottom: ${token.marginXS}px;
  `,

  emptyState: css`
    text-align: center;
    padding: ${token.paddingLG}px;
    color: ${token.colorTextSecondary};
  `,

  tabsContainer: css`
    .ant-tabs-nav {
      margin-bottom: ${token.marginMD}px;
    }
  `,
}));
