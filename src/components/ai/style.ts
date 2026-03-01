import { createStyles } from "antd-style";
import { colors } from "@/theme/colors";

export const useStyles = createStyles(({ token, css }) => ({
  // Smart Automation Dashboard Styles
  container: css`
    padding: ${token.paddingSM}px;
    background-color: #f4ebdb;
    min-height: 100vh;

    @media (max-width: 768px) {
      padding: ${token.paddingXS}px;
    }
  `,

  header: css`
    margin-bottom: ${token.marginLG}px;
    text-align: center;
  `,

  title: css`
    color: #2c3e50;
    margin-bottom: ${token.marginXS}px;
  `,

  subtitle: css`
    color: ${token.colorTextSecondary};
  `,

  section: css`
    margin-bottom: ${token.marginLG}px;
  `,

  topSection: css`
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      margin-bottom: ${token.marginMD}px;
    }
  `,

  middleSection: css`
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      margin-bottom: ${token.marginMD}px;
    }
  `,

  card: css`
    height: 100%;
  `,

  quickActionsCard: css`
    height: 100%;
    background-color: ${colors.white};

    & .ant-card-head {
      background-color: ${colors.shell};
      color: ${token.colorTextLightSolid};
    }

    & .ant-card-body {
      background-color: ${colors.white};
    }
  `,

  keyMetricsCard: css`
    height: 100%;
    background-color: ${colors.white};

    & .ant-card-head {
      background-color: ${colors.shell};
      color: ${token.colorTextLightSolid};
    }

    & .ant-card-body {
      background-color: ${colors.white};
    }
  `,

  metricsContainer: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
    align-items: center;
  `,

  metricItem: css`
    width: 100%;
    text-align: center;
  `,

  metricLabel: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
  `,

  metricValue: css`
    font-weight: bold;
    font-size: 16px;
  `,

  pipelineValue: css`
    color: #1890ff;
  `,

  activeOppsValue: css`
    color: #52c41a;
  `,

  conversionRateValue: css`
    color: #faad14;
  `,

  avgDealSizeValue: css`
    color: #722ed1;
  `,

  followUpsCard: css`
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

    @media (max-width: 992px) {
      margin-bottom: ${token.marginLG}px;
    }
  `,

  tasksCard: css`
    background-color: ${colors.primary};
    margin-bottom: ${token.marginLG}px;

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

  scrollableTable: css`
    overflow-x: auto;
    overflow-y: auto;
  `,

  compactTable: css`
    .ant-table {
      font-size: 12px;
    }

    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 4px 8px;
    }
  `,

  buttonContainer: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
  `,

  quickActionButton: css`
    border-radius: ${token.borderRadius}px;
    font-weight: ${token.fontWeightStrong};

    &.ant-btn-primary {
      background-color: ${colors.shell};
      border-color: ${colors.shell};
      color: ${colors.white};
    }

    &.ant-btn-default {
      border-color: ${colors.shell};
      color: ${colors.shell};
      background-color: ${colors.white};
    }
  `,

  bottomAnalyticsScroll: css`
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  `,

  bottomAnalyticsRow: css`
    display: flex;
    gap: ${token.marginLG}px;
    min-width: 820px;
    align-items: stretch;

    @media (max-width: 768px) {
      min-width: 760px;
      gap: ${token.margin}px;
    }
  `,

  pipelineCard: css`
    flex: 1;
    min-width: 380px;
    background-color: ${colors.white};

    & .ant-card-head {
      background-color: ${colors.shell};
      color: ${token.colorTextLightSolid};
    }

    & .ant-card-body {
      background-color: ${colors.white};
      height: 340px;
      overflow: hidden;
    }
  `,

  salesPerformanceCard: css`
    flex: 1;
    min-width: 380px;
    background-color: ${colors.white};

    & .ant-card-head {
      background-color: ${colors.shell};
      color: ${token.colorTextLightSolid};
    }

    & .ant-card-body {
      background-color: ${colors.white};
      height: 340px;
      overflow: auto;
    }
  `,

  pipelineGraphScroll: css`
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  `,

  pipelineBars: css`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: ${token.marginSM}px;
    height: 100%;
    min-width: 520px;
  `,

  pipelineBarItem: css`
    flex: 1;
    min-width: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${token.marginXS}px;
  `,

  pipelineBarTrack: css`
    height: 160px;
    width: 100%;
    max-width: 48px;
    background-color: ${token.colorFillTertiary};
    border-radius: ${token.borderRadiusSM}px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  `,

  pipelineBarFill: css`
    width: 100%;
    border-radius: ${token.borderRadiusSM}px ${token.borderRadiusSM}px 0 0;
    transition: height 0.3s ease;
    min-height: 4px;
  `,

  pipelineBarLabel: css`
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorText};
    text-align: center;
  `,

  pipelineBarCount: css`
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextSecondary};
  `,

  pipelineBarValue: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
  `,

  salesMetricsGrid: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${token.margin}px;
  `,

  emailContentContainer: css`
    margin-top: ${token.marginSM}px;
  `,

  emailSubject: css`
    margin-bottom: ${token.marginMD}px;
  `,

  emailContent: css`
    margin-top: ${token.marginSM}px;
  `,

  characterCount: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
    margin-top: ${token.marginXS}px;
    display: block;
  `,

  // Additional inline styles that need to be converted
  marginLeft: css`
    margin-left: 8px;
  `,

  fullWidth: css`
    width: 100%;
  `,

  extraSmallText: css`
    font-size: 12px;
  `,

  marginRight: css`
    margin-right: 8px;
  `,

  flexEnd: css`
    width: 100%;
    justify-content: flex-end;
  `,

  spaceBetween: css`
    width: 100%;
    justify-content: space-between;
  `,

  // DashboardWidgets Styles
  widgetsContainer: css`
    padding: 24px;
    background: ${token.colorBgLayout};
    min-height: 100vh;
  `,

  widgetsHeader: css`
    margin-bottom: 24px;
    color: ${token.colorText};
  `,

  widgetsCard: css`
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: ${token.boxShadowTertiary};
    margin-bottom: ${token.marginMD}px;
  `,

  insight: css`
    padding: ${token.paddingSM}px ${token.paddingMD}px;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
  `,

  insightTitle: css`
    color: ${token.colorText};
    margin-bottom: ${token.marginSM}px;
  `,

  insightDescription: css`
    color: ${token.colorTextSecondary};
    margin-bottom: ${token.marginXS}px;
  `,

  insightValue: css`
    margin-top: ${token.marginXS}px;
  `,

  loading: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `,

  // AIAssistant Styles
  chatWindow: css`
    position: fixed;
    right: 24px;
    bottom: 90px;
    width: 380px;
    height: 600px;
    z-index: 1000;
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 1px solid ${token.colorBorder};
    display: flex;
    flex-direction: column;

    @media (max-width: 480px) {
      width: calc(100vw - 32px);
      height: calc(100vh - 120px);
      right: 16px;
      bottom: 80px;
    }
  `,
  chatHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  `,

  floatButton: css`
    position: fixed;
    right: 24px;
    bottom: 24px;
  `,

  avatar: css`
    background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBorder} 100%);
  `,

  closeButton: css`
    &:hover {
      background-color: ${token.colorErrorBg};
      color: ${token.colorError};
    }
  `,

  clearButton: css`
    font-size: 11px;
    height: auto;
    padding: 2px 8px;

    &:hover {
      color: ${token.colorPrimary};
    }
  `,

  messagesContainer: css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: ${token.paddingSM}px;
    background: ${token.colorBgContainer};
    display: flex;
    flex-direction: column;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${token.colorBorder};
      border-radius: 2px;
    }
  `,

  welcomeMessage: css`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  `,

  welcomeContent: css`
    text-align: center;
    max-width: 280px;
  `,

  welcomeIcon: css`
    font-size: 48px;
    color: ${token.colorPrimary};
    margin-bottom: ${token.marginMD}px;
  `,

  suggestions: css`
    margin-top: ${token.marginXL}px;
    text-align: left;
  `,

  suggestionButtons: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
    margin-top: ${token.marginMD}px;
  `,

  suggestionButton: css`
    text-align: left;
    height: auto;
    padding: 8px 12px;
    white-space: normal;
    font-size: 12px;

    &:hover {
      border-color: ${token.colorPrimary};
      color: ${token.colorPrimary};
    }
  `,

  messagesList: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
    width: 100%;
    padding: ${token.paddingXS}px;
  `,

  message: css`
    display: flex;
    gap: ${token.marginSM}px;
    align-items: flex-start;
    width: 100%;
  `,

  messageAvatar: css`
    flex-shrink: 0;
  `,

  messageContent: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 70%;
    font-size: 14px;
    line-height: 1.4;

    .user & {
      align-items: flex-end;
    }

    p {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    ul {
      margin: 4px 0;
      padding-left: 16px;

      li {
        margin-bottom: 4px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    strong {
      font-weight: 600;
      color: ${token.colorPrimary};
    }

    em {
      font-style: italic;
    }
  `,

  messageBubble: css`
    padding: 10px 14px;
    border-radius: 12px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    word-wrap: break-word;

    .user & {
      background: linear-gradient(
        135deg,
        ${token.colorPrimary} 0%,
        ${token.colorPrimaryBorder} 100%
      );
      border-color: ${token.colorPrimary};
      color: white;
    }

    .assistant & {
      background: ${token.colorBgContainer};
      border-color: ${token.colorBorder};
    }
  `,

  messageTime: css`
    font-size: 10px;
    opacity: 0.7;
  `,

  inputArea: css`
    padding: ${token.paddingSM}px;
    border-top: 1px solid ${token.colorBorder};
    background: ${token.colorBgContainer};
    flex-shrink: 0;
  `,

  messageInput: css`
    .ant-input {
      border-radius: 20px;
      border: 1px solid ${token.colorBorder};

      &:focus {
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
      }
    }
  `,

  sendButton: css`
    border-radius: 0 20px 20px 0;
    height: 32px;

    &:disabled {
      opacity: 0.6;
    }
  `,

  user: css`
    flex-direction: row-reverse;
  `,

  assistant: css`
    flex-direction: row;
  `,

  // SmartAutomation styles converted to antd-style
  smartContainer: css`
    padding: 24px;
    background: ${token.colorBgLayout};
    min-height: 100vh;
  `,

  smartHeader: css`
    margin-bottom: 24px;
    color: ${token.colorText};
  `,

  smartTitle: css`
    color: ${token.colorText};
    margin-bottom: 16px;
  `,

  smartCard: css`
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: ${token.boxShadowTertiary};
    margin-bottom: 16px;
  `,

  smartCardHeader: css`
    background: ${token.colorPrimary};
    padding: ${token.paddingSM}px ${token.paddingMD}px;
    border-radius: ${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0;
    color: ${token.colorWhite};
  `,

  smartCardBody: css`
    padding: ${token.paddingMD}px;
  `,

  smartButton: css`
    margin-right: 8px;
  `,

  smartTag: css`
    display: inline-block;
    padding: 2px 6px;
    border-radius: ${token.borderRadius}px;
    font-size: 12px;
    font-weight: 500;
  `,

  smartList: css`
    .ant-list-item {
      padding: 8px 0;
      border-bottom: 1px solid ${token.colorBorder};
    }
  `,

  smartText: css`
    color: ${token.colorText};
    line-height: 1.5;
  `,

  smartTextSecondary: css`
    color: ${token.colorTextSecondary};
  `,

  smartLoading: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `,

  smartModal: css`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.5);
    padding: 24px;
    border-radius: ${token.borderRadiusLG}px;
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
  `,

  smartDivider: css`
    margin: 16px 0;
  `,
}));
