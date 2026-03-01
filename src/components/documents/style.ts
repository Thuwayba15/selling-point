import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    padding: ${token.padding}px;
  `,
  headerCard: css`
    margin-bottom: ${token.margin}px;
  `,
  filtersCard: css`
    margin-bottom: ${token.margin}px;
  `,
  actionsCard: css`
    margin-bottom: ${token.margin}px;
  `,
  tableCard: css`
    margin-bottom: ${token.margin}px;
  `,
  detailsCard: css`
    margin-bottom: ${token.margin}px;
  `,
}));
