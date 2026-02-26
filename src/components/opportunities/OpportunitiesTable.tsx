"use client";

import { Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { Opportunity } from "../../domains/opportunities/types";

type Props = {
  rows: Opportunity[];
  loading: boolean;
  page: number; // UI page (1-based)
  pageSize: number;
  totalCount: number;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const formatMoney = (value: number, currency: string) => {
  if (!Number.isFinite(value)) return "";
  return `${currency || ""} ${value.toLocaleString()}`.trim();
};

const formatPercent = (value: number) => (Number.isFinite(value) ? `${value}%` : "");

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export const OpportunitiesTable = ({
  rows,
  loading,
  page,
  pageSize,
  totalCount,
  onPaginationChange,
}: Props) => {
  const columns: ColumnsType<Opportunity> = [
    { title: "TITLE", dataIndex: "title", key: "title" },
    { title: "CLIENT", dataIndex: "clientName", key: "clientName" },
    {
      title: "STAGE",
      dataIndex: "stageName",
      key: "stageName",
      render: (v: string) => (v ? <Tag>{v}</Tag> : ""),
    },
    {
      title: "ESTIMATED VALUE",
      key: "estimatedValue",
      render: (_v, r) => formatMoney(r.estimatedValue, r.currency),
    },
    {
      title: "PROBABILITY",
      dataIndex: "probability",
      key: "probability",
      render: (v: number) => formatPercent(v),
    },
    {
      title: "EXPECTED CLOSE",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      render: (v: string) => formatDate(v),
    },
    { title: "OWNER", dataIndex: "ownerName", key: "ownerName" },
  ];

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total: totalCount,
    showSizeChanger: true,
    onChange: (p, ps) => onPaginationChange(p, ps),
  };

  return (
    <Table<Opportunity>
      rowKey={(r) => r.id}
      loading={loading}
      columns={columns}
      dataSource={rows}
      pagination={pagination}
    />
  );
};