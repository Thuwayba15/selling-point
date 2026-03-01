"use client";

import React from "react";
import { useStyles } from "./style";

interface ReportsHeaderProps {
  title: string;
  subtitle?: string;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({ title, subtitle }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
};
