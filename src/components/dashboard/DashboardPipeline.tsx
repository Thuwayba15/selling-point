"use client";

import React, { ReactElement } from "react";
import { Skeleton, Empty } from "antd";
import { IPipelineMetrics, IStageMetrics } from "@/providers/dashboard/context";
import { formatCurrency } from "@/utils/currency";
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

  // Calculate max stage value for bar scaling (logarithmic)
  const maxValue = Math.max(...pipelineMetrics.stages.map((s: IStageMetrics) => s.value || 0));

  // Calculate total pipeline value from open stages (1-4)
  const calculatedTotalValue = pipelineMetrics.stages
    .filter((s: IStageMetrics) => s.stage <= 4)
    .reduce((sum: number, s: IStageMetrics) => sum + (s.value || 0), 0);

  const renderStageBar = (stage: IStageMetrics): ReactElement => {
    const stageValue = stage.value || 0;
    
    // Use logarithmic scale to handle large value differences (e.g., ClosedWon being 2B while others are in thousands)
    // Add 1 to avoid log(0), scale between 20% minimum and 100% maximum
    const logValue = stageValue > 0 ? Math.log10(stageValue + 1) : 0;
    const maxLogValue = Math.log10(maxValue + 1);
    const barHeight = maxLogValue > 0 ? 20 + ((logValue / maxLogValue) * 80) : 20;

    return (
      <div key={stage.stage} className={styles.barWrapper}>
        <div className={styles.barContainer}>
          <div
            className={styles.bar}
            style={{
              height: `${barHeight}%`,
            }}
          />
          <div className={styles.barValue}>{formatCurrency(stageValue)}</div>
        </div>
        <div className={styles.barLabel}>{STAGE_NAMES[stage.stage] || `Stage ${stage.stage}`}</div>
        <div className={styles.barCount}>{stage.count ?? 0} opps</div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.barChartContainer}>{pipelineMetrics.stages.map(renderStageBar)}</div>
      <div className={styles.pipelineSummary}>
        <div>
          Weighted Pipeline Value: {formatCurrency(pipelineMetrics.weightedValue)}
        </div>
        <div>Total Pipeline Value: {formatCurrency(pipelineMetrics.totalValue || calculatedTotalValue)}</div>
      </div>
    </div>
  );
};
