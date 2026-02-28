"use client";

import { Skeleton, Empty } from "antd";
import { IPipelineMetrics } from "@/providers/dashboard/context";
import { useStyles } from "./style";

interface DashboardPipelineProps {
  pipelineMetrics?: IPipelineMetrics;
  isLoading: boolean;
}

const STAGE_NAMES: Record<number, string> = {
  1: "Lead",
  2: "Qualified",
  3: "Proposal",
  4: "Negotiation",
  5: "Closed Won",
  6: "Closed Lost",
};

export const DashboardPipeline = ({ pipelineMetrics, isLoading }: DashboardPipelineProps) => {
  const { styles } = useStyles();

  if (isLoading) {
    return (
      <div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (
    !pipelineMetrics ||
    !pipelineMetrics.stages ||
    !Array.isArray(pipelineMetrics.stages) ||
    pipelineMetrics.stages.length === 0
  ) {
    return <Empty description="No pipeline data available" />;
  }

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) return "$0.00M";
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  // Find max value for scaling bars - try both 'value' and 'totalValue' fields
  const maxValue = Math.max(
    ...pipelineMetrics.stages.map((s) => (s as any).totalValue || s.value || 0),
  );

  // Calculate total pipeline value from all stages (excluding Closed Won/Lost)
  const calculatedTotalValue = pipelineMetrics.stages
    .filter((s) => s.stage <= 4) // Only stages 1-4 (Lead, Qualified, Proposal, Negotiation)
    .reduce((sum, s) => sum + ((s as any).totalValue || s.value || 0), 0);

  return (
    <div>
      <div className={styles.barChartContainer}>
        {pipelineMetrics.stages.map((stage) => {
          // Support both 'value' and 'totalValue' field names from API
          const stageValue = (stage as any).totalValue || stage.value || 0;
          const barHeight = maxValue > 0 ? (stageValue / maxValue) * 100 : 10;

          // In your component, replace the barContainer/bar divs with this structure:
return (
  <div key={stage.stage} className={styles.barWrapper}>
    <div className={styles.barContainer}>
      <div 
        className={styles.bar}
        style={{ height: `${barHeight}%` }}
      />
      <div className={styles.barValue}>{formatCurrency(stageValue)}</div>
    </div>
    <div className={styles.barLabel}>
      {STAGE_NAMES[stage.stage] || `Stage ${stage.stage}`}
    </div>
    <div className={styles.barCount}>{stage.count ?? 0} opps</div>
  </div>
);
        })}
      </div>
      <div className={styles.pipelineSummary}>
        <div>
          Weighted Pipeline Value:{" "}
          {formatCurrency(
            (pipelineMetrics as any).weightedPipelineValue || pipelineMetrics.weightedValue,
          )}
        </div>
        <div>
          Total Pipeline Value: {formatCurrency(pipelineMetrics.totalValue || calculatedTotalValue)}
        </div>
      </div>
    </div>
  );
};
