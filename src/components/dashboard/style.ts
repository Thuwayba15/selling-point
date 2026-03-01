import { createStyles } from "antd-style";
import { colors } from "@/theme/colors";

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    padding: ${token.paddingSM}px;
    background-color: ${token.colorBgLayout};
    min-height: 100vh;

    @media (max-width: 768px) {
      padding: ${token.paddingXS}px;
    }
  `,

  content: css`
    max-width: 1400px;
    margin: 0 auto;
  `,

  header: css`
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      margin-bottom: ${token.marginMD}px;
    }
  `,

  title: css`
    margin: 0;
    font-size: ${token.fontSizeHeading2}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    font-style: italic;

    @media (max-width: 768px) {
      font-size: ${token.fontSizeHeading3}px;
    }
  `,

  section: css`
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      margin-bottom: ${token.marginMD}px;
    }
  `,

  sectionTitle: css`
    margin-bottom: ${token.marginMD}px;
    font-size: ${token.fontSizeHeading4}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
  `,

  kpiGrid: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.margin}px;
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      gap: ${token.marginSM}px;
      margin-bottom: ${token.marginMD}px;
    }
  `,

  salesPerformanceSection: css`
    margin-bottom: ${token.marginXL}px;

    @media (max-width: 768px) {
      margin-bottom: ${token.marginLG}px;
    }
  `,

  salesPerformanceCard: css`
    background-color: ${colors.primary};

    & .ant-card-head {
      background-color: ${colors.shell};
      color: ${token.colorTextLightSolid};
    }

    & .ant-card-body {
      background-color: ${colors.white};
    }
  `,

  card: css`
    padding: ${token.padding}px;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadius}px;
    border: 1px solid ${token.colorBorder};
    flex: 0 0 auto;
    min-width: 200px;
    max-width: 250px;

    @media (max-width: 768px) {
      padding: ${token.paddingSM}px;
      min-width: 150px;
      max-width: 200px;
    }
  `,

  cardTitle: css`
    font-size: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
    margin-bottom: ${token.marginSM}px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `,

  cardValue: css`
    font-size: ${token.fontSizeHeading3}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};

    @media (max-width: 768px) {
      font-size: ${token.fontSizeHeading4}px;
    }
  `,

  pipelineGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${token.margin}px;
    max-width: 50vw; /* Limit to half the viewport width */

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: ${token.marginSM}px;
      max-width: 100%; /* Full width on mobile */
    }
  `,

  pipelineStage: css`
    padding: ${token.padding}px;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadius}px;
    border: 1px solid ${token.colorBorder};
    text-align: center;
  `,

  stageName: css`
    font-size: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
    margin-bottom: ${token.marginSM}px;
    font-weight: ${token.fontWeightStrong};
  `,

  stageCount: css`
    font-size: ${token.fontSizeHeading3}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    margin-bottom: ${token.marginXS}px;
  `,

  stageValue: css`
    font-size: ${token.fontSize}px;
    color: ${token.colorPrimary};
    font-weight: ${token.fontWeightStrong};
  `,

  table: css`
    width: 100%;
  `,

  tableHeader: css`
    padding: ${token.paddingSM}px;
    background-color: ${token.colorBgLayout};
    border-bottom: 1px solid ${token.colorBorder};
    font-weight: ${token.fontWeightStrong};

    @media (max-width: 768px) {
      padding: ${token.paddingXS}px;
      font-size: ${token.fontSizeSM}px;
    }
  `,

  tableRow: css`
    padding: ${token.paddingSM}px;
    border-bottom: 1px solid ${token.colorBorder};

    @media (max-width: 768px) {
      padding: ${token.paddingXS}px;
      font-size: ${token.fontSizeSM}px;
    }

    &:hover {
      background-color: ${token.colorBgLayout};
    }
  `,

  loadingContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
  `,

  errorContainer: css`
    padding: ${token.padding}px;
    background-color: ${token.colorErrorBg};
    border: 1px solid ${token.colorErrorBorder};
    border-radius: ${token.borderRadius}px;
    color: ${token.colorError};
    margin-bottom: ${token.marginMD}px;
  `,

  gridContainer: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: ${token.margin}px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: ${token.marginSM}px;
    }
  `,

  barChartContainer: css`
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    height: 300px;
    padding: ${token.padding}px;
    gap: ${token.marginSM}px;
    width: max-content;

    @media (max-width: 768px) {
      height: 250px;
      padding: ${token.paddingSM}px;
      gap: ${token.marginXS}px;
    }
  `,

  barChartScroll: css`
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  `,

  barContainer: css`
    width: 100%;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    align-items: center;
  `,

  barWrapper: css`
    flex: 0 0 80px; /* Increased from 70px for better spacing */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${token.marginXS}px;
    min-width: 80px;
    max-width: 140px;
  `,

  bar: css`
    width: 32px;
    background: linear-gradient(180deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBorder} 100%);
    border-radius: ${token.borderRadius}px ${token.borderRadius}px 0 0;
    transition: height 0.3s ease;
    min-height: 4px;
    max-width: 100%;
  `,
  barValue: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorPrimary};
    text-align: center;
    margin-top: ${token.marginXS}px;

    @media (max-width: 768px) {
      font-size: 11px;
    }
  `,

  barLabel: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    text-align: center;
    word-break: break-word;

    @media (max-width: 768px) {
      font-size: 11px;
    }
  `,

  barCount: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
    text-align: center;
  `,

  pipelineSummary: css`
    margin-top: ${token.marginLG}px;
    padding-top: ${token.paddingMD}px;
    border-top: 1px solid ${token.colorBorder};
    display: flex;
    justify-content: space-around;
    gap: ${token.margin}px;
    text-align: center;
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSize}px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: ${token.marginSM}px;
      font-size: ${token.fontSizeSM}px;
    }
  `,

  fullWidth: css`
    width: 100%;
  `,

  spaceBetweenSections: css`
    margin-top: 2rem;
  `,

  totalActivityCard: css`
    margin-top: 1rem;
  `,

  chartGrid: css`
    display: flex;
    gap: ${token.marginXL}px;
    align-items: flex-start;
    justify-content: center;
    min-width: 800px; /* Ensure minimum width for both charts */
    width: 100%; /* Take full available width */

    @media (max-width: 768px) {
      flex-direction: column;
      gap: ${token.marginLG}px;
      min-width: auto; /* Remove min-width constraint on mobile */
    }
  `,

  dashboardLayout: css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Three columns: KPIs/Pipeline, Activities, Sales */
    gap: ${token.marginXL}px;
    align-items: start;

    @media (max-width: 1400px) {
      grid-template-columns: 1fr 1fr; /* Two columns on medium screens */
      gap: ${token.marginLG}px;
    }

    @media (max-width: 1200px) {
      grid-template-columns: 1fr; /* Single column on small screens */
      gap: ${token.marginLG}px;
    }
  `,

  kpiRow: css`
    display: flex;
    justify-content: stretch;
    margin-bottom: ${token.marginXL}px;

    @media (max-width: 768px) {
      margin-bottom: ${token.marginLG}px;
    }
  `,

  mainContentLayout: css`
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns: Pipeline, Activities */
    gap: ${token.marginXL}px;
    margin-bottom: ${token.marginXL}px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr; /* Single column on mobile */
      gap: ${token.marginLG}px;
      margin-bottom: ${token.marginLG}px;
    }
  `,

  leftMainColumn: css`
    display: flex;
    flex-direction: column;
  `,

  rightMainColumn: css`
    display: flex;
    flex-direction: column;
  `,

  salesRow: css`
    display: flex;
    justify-content: stretch;

    @media (max-width: 768px) {
      margin-bottom: ${token.marginLG}px;
    }
  `,

  chartsScrollContainer: css`
    display: flex;
    gap: ${token.marginXL}px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: ${token.marginLG}px 0;
    margin-bottom: ${token.marginXL}px;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;

    @media (max-width: 768px) {
      gap: ${token.marginLG}px;
      padding: ${token.marginMD}px 0;
      margin-bottom: ${token.marginLG}px;
    }
  `,

  chartCard: css`
    flex: 0 0 auto;
    min-width: 350px;
    max-width: 450px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    padding: ${token.paddingLG}px;

    @media (max-width: 768px) {
      min-width: 300px;
      max-width: 350px;
      padding: ${token.paddingMD}px;
    }
  `,

  leaderboardSection: css`
    margin-bottom: ${token.marginXL}px;

    @media (max-width: 768px) {
      margin-bottom: ${token.marginLG}px;
    }
  `,

  leaderboardContent: css`
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSizeLG}px;
  `,

  chartTitle: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    margin: 0;
    text-align: center;
  `,

  pieChart: css`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    @media (max-width: 768px) {
      width: 150px;
      height: 150px;
    }
  `,

  legendContainer: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginXS}px;
    margin-top: ${token.marginMD}px;
  `,

  legendItem: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    font-size: ${token.fontSize}px;
  `,

  legendColor: css`
    width: 16px;
    height: 16px;
    border-radius: 2px;
    flex-shrink: 0;
  `,

  legendLabel: css`
    flex: 1;
    color: ${token.colorText};
  `,

  legendValue: css`
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorTextSecondary};
  `,
}));
