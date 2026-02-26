
import { createStyles, css } from "antd-style";
import { colors } from "@/theme/colors";
import { antdTheme } from "@/theme/theme";

export const useStyles = createStyles({
  layout: css`
    display: flex;
    min-height: 100vh;
    background: ${colors.shell};
    padding: 54px;
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `,
  left: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: right;
    align-items: flex-start;
    padding: 126px 48px;
    background: ${colors.bgLayout};
    border-radius: 12px 0 0 12px;
    @media (max-width: 900px) {
      border-radius: 12px 12px 0 0;
      padding: 48px 24px;
    }
  `,
  right: css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${colors.lightGreen};
    border-radius: 0 12px 12px 0;
    padding: 20px;
    @media (max-width: 900px) {
      border-radius: 0 0 12px 12px;
      padding: 24px 12px;
    }
  `,
  card: css`
    width: 100%;
    max-width: 400px;
    border-radius: 14px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    padding: 40px 36px;
    background: ${colors.white};

    .ant-card-body {
      padding: 0 !important;
    }
    @media (max-width: 600px) {
      padding: 24px 8px;
      max-width: 100%;
    }
  `,

  brandTitle: css`
    font-size: 5.5rem;
    font-weight: 100;
    line-height: 1.05;
    margin: 0 0 16px 0;
    color: ${colors.white};
    letter-spacing: -0.02em;

    .dot {
      display: inline-block;
      width: 26px;
      height: 26px;
      background: ${colors.shell};
      border-radius: 50%;
      margin-left: 15px;
      vertical-align: bottom;
      position: relative;
      top: -10px;
    }
    @media (max-width: 600px) {
      font-size: 2.5rem;
    }
  `,

  cardTitle: css`
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 24px 0;
    color: ${colors.black};
    letter-spacing: -0.01em;
    @media (max-width: 600px) {
      font-size: 1.3rem;
    }
  `,

  subtitle: css`
    font-size: 1.3rem;
    font-style: italic;
    color: ${colors.subtitle};
    margin: 0;
    font-weight: 400;
  `,

  formLabel: css`
    font-size: 0.82rem;
    font-weight: 500;
    color: #444;
  `,

  input: css`
    border-radius: 6px;
    font-size: 0.9rem;
    height: 36px;
    border-color: ${colors.border};

    &:hover {
      border-color: ${colors.darkGreen};
    }

    &:focus,
    &.ant-input-focused {
      border-color: ${colors.darkGreen};
      box-shadow: 0 0 0 2px rgba(30, 58, 47, 0.12);
    }
  `,

  button: css`
    margin-top: 8px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    height: 40px;
    background: ${colors.shell};
    border-color: ${colors.shell};
    color: ${colors.white};
    letter-spacing: 0.01em;

    &:hover,
    &:focus {
      background: ${colors.buttonHover} !important;
      border-color: ${colors.buttonHover} !important;
      color: ${colors.white} !important;
    }
  `,

  registerNote: css`
    font-size: 0.82rem;
    color: ${colors.gray};
    text-align: center;
    margin-top: 16px;
  `,

  link: css`
    color: ${colors.shell};
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: ${colors.buttonHover};
    }
  `,
});