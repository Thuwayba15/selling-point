"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, Form, App as AntdApp } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useReportsState, useReportsActions } from "@/providers/reports";
import { useUsersState, useUsersActions } from "@/providers/users";
import { useStyles } from "@/components/reports/style";
import {
  ReportsHeader,
  ReportsFilters,
  OpportunitiesReportTable,
  SalesByPeriodReport,
} from "@/components/reports";
import type { OpportunityStage, GroupBy } from "@/providers/reports/context";
import dayjs from "dayjs";

const ReportsPage = () => {
  const { styles } = useStyles();
  const { message } = AntdApp.useApp();
  const reportsState = useReportsState();
  const reportsActions = useReportsActions();
  const usersState = useUsersState();
  const usersActions = useUsersActions();

  const [opportunitiesForm] = Form.useForm();
  const [salesForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("opportunities");

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      usersActions.getUsers();
    }
  }, [usersActions]);

  const ownerOptions = (usersState.users || []).map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const handleOpportunitiesSearch = useCallback(async () => {
    try {
      const values = opportunitiesForm.getFieldsValue();
      const params: {
        startDate?: string;
        endDate?: string;
        stage?: OpportunityStage;
        ownerId?: string;
      } = {};

      if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
        params.startDate = values.dateRange[0].toISOString();
        params.endDate = values.dateRange[1].toISOString();
      }

      if (values.stage) {
        params.stage = values.stage;
      }

      if (values.ownerId) {
        params.ownerId = values.ownerId;
      }

      await reportsActions.getOpportunitiesReport(params);
      message.success("Opportunities report generated");
    } catch (error) {
      message.error("Failed to generate opportunities report");
    }
  }, [opportunitiesForm, reportsActions]);

  const handleSalesSearch = useCallback(async () => {
    try {
      const values = salesForm.getFieldsValue();
      const params: {
        startDate?: string;
        endDate?: string;
        groupBy?: GroupBy;
      } = {};

      if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
        params.startDate = values.dateRange[0].toISOString();
        params.endDate = values.dateRange[1].toISOString();
      }

      if (values.groupBy) {
        params.groupBy = values.groupBy;
      }

      await reportsActions.getSalesByPeriodReport(params);
      message.success("Sales by period report generated");
    } catch (error) {
      message.error("Failed to generate sales report");
    }
  }, [salesForm, reportsActions]);

  const handleOpportunitiesClear = () => {
    opportunitiesForm.resetFields();
  };

  const handleSalesClear = () => {
    salesForm.resetFields();
  };

  const tabItems = [
    {
      key: "opportunities",
      label: "Opportunities Report",
      children: (
        <div>
          <ReportsFilters
            form={opportunitiesForm}
            onSearch={handleOpportunitiesSearch}
            onClear={handleOpportunitiesClear}
            loading={reportsState.isPending}
            showOpportunityFilters
            ownerOptions={ownerOptions}
          />
          <OpportunitiesReportTable
            data={reportsState.opportunitiesReport}
            loading={reportsState.isPending}
          />
        </div>
      ),
    },
    {
      key: "sales",
      label: "Sales by Period",
      children: (
        <div>
          <ReportsFilters
            form={salesForm}
            onSearch={handleSalesSearch}
            onClear={handleSalesClear}
            loading={reportsState.isPending}
            showSalesFilters
          />
          <SalesByPeriodReport
            data={reportsState.salesByPeriod}
            loading={reportsState.isPending}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.tabsContainer}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuthGuard(ReportsPage, { allowedRoles: ["Admin", "SalesManager"] });
