import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  pageContainer: css`
    padding: 24px;
  `,

  verticalSpace: css`
    width: 100%;
  `,

  cardDescription: css`
    color: ${token.colorTextSecondary};
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

  noMembers: css`
    color: ${token.colorTextTertiary};
  `,
}));
