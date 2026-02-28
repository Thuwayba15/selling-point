import { createStyles } from "antd-style";

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

  workspaceToolbarRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.margin}px;
    margin-bottom: ${token.margin}px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  `,

  workspaceViewSelect: css`
    min-width: 180px;
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
    align-items: flex-end;
  `,

  tableCard: css`
    margin-bottom: ${token.marginLG}px;
  `,

  tableRow: css`
    cursor: pointer;
  `,

  selectedRow: css`
    display: flex;
    gap: ${token.marginLG}px;
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,

  detailsPanel: css`
    flex: 2;
  `,

  detailsCard: css`
    height: 100%;
  `,

  actionsCard: css`
    flex: 1;
    min-width: 300px;

    @media (max-width: 768px) {
      min-width: 100%;
    }
  `,

  actionsStack: css`
    width: 100%;
  `,

  fullWidthControl: css`
    width: 100%;
  `,

  insightsRow: css`
    display: flex;
    gap: ${token.marginLG}px;
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,

  insightCard: css`
    flex: 1;
  `,

  emptyState: css`
    color: ${token.colorTextSecondary};
    padding: ${token.paddingSM}px 0;
  `,

  primaryTag: css`
    margin-left: ${token.marginXS}px;
  `,

  sectionSpacing: css`
    margin-bottom: ${token.marginLG}px;
  `,

  chartPlaceholder: css`
    height: 320px;
  `,
}));
