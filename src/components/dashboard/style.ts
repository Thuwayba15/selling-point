import { createStyles } from "antd-style";

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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${token.margin}px;
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: ${token.marginSM}px;
    }
  `,

  card: css`
    padding: ${token.padding}px;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadius}px;
    border: 1px solid ${token.colorBorder};

    @media (max-width: 768px) {
      padding: ${token.paddingSM}px;
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

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: ${token.marginSM}px;
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
    justify-content: space-around;
    height: 300px;
    padding: ${token.padding}px;
    gap: ${token.marginSM}px;

    @media (max-width: 768px) {
      height: 250px;
      padding: ${token.paddingSM}px;
      gap: ${token.marginXS}px;
    }
  `,

  barContainer: css`
    width: 100%;
    height: 220px; /* fixed height so % works */
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* bars grow upward */
    position: relative;
  `,

  barWrapper: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${token.marginXS}px;
    min-width: 60px;
  `,

  bar: css`
    width: 100%;
    background: linear-gradient(180deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBorder} 100%);
    border-radius: ${token.borderRadius}px ${token.borderRadius}px 0 0;
    transition: height 0.3s ease;
    min-height: 4px; /* shows a sliver even for 0-value bars */

    &:hover {
      opacity: 0.8;
    }
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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: ${token.marginLG}px;
    margin-bottom: ${token.marginLG}px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,

  chartCard: css`
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    padding: ${token.paddingLG}px;
    display: flex;
    flex-direction: column;
    gap: ${token.marginMD}px;
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
