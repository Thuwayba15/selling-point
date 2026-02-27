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
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: ${token.boxShadowTertiary};
    overflow: hidden;
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
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: ${token.boxShadowTertiary};
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
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: ${token.boxShadowTertiary};
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

  layoutGrid: css`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: ${token.marginLG}px;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  `,

  leftColumn: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginLG}px;
  `,

  rightColumn: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginLG}px;
  `,

  tabsContainer: css`
    .ant-tabs-nav {
      margin-bottom: ${token.marginMD}px;
    }
  `,
}));
