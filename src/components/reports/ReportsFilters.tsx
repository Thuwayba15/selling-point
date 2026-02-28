"use client";

import React from "react";
import { Card, Form, DatePicker, Select, Button, Space, Row, Col } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import type { OpportunityStage, GroupBy } from "@/providers/reports/context";
import { filtersCardStyle } from "./style";

const { RangePicker } = DatePicker;

const STAGE_OPTIONS = [
  { value: 1, label: "Lead" },
  { value: 2, label: "Qualified" },
  { value: 3, label: "Proposal" },
  { value: 4, label: "Negotiation" },
  { value: 5, label: "Closed Won" },
  { value: 6, label: "Closed Lost" },
];

const GROUP_BY_OPTIONS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

interface ReportsFiltersProps {
  form: any;
  onSearch: () => void;
  onClear: () => void;
  loading?: boolean;
  showOpportunityFilters?: boolean;
  showSalesFilters?: boolean;
  ownerOptions?: Array<{ value: string; label: string }>;
}

export const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  form,
  onSearch,
  onClear,
  loading = false,
  showOpportunityFilters = false,
  showSalesFilters = false,
  ownerOptions = [],
}) => {
  return (
    <Card title="Filters" style={filtersCardStyle}>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Date Range" name="dateRange">
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {showOpportunityFilters && (
            <>
              <Col span={6}>
                <Form.Item label="Stage" name="stage">
                  <Select
                    placeholder="Select stage"
                    options={STAGE_OPTIONS}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Owner" name="ownerId">
                  <Select
                    placeholder="Select owner"
                    options={ownerOptions}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            </>
          )}

          {showSalesFilters && (
            <Col span={6}>
              <Form.Item label="Group By" name="groupBy">
                <Select
                  placeholder="Select grouping"
                  options={GROUP_BY_OPTIONS}
                //   initialValue="month"
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row>
          <Col span={24}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
                loading={loading}
              >
                Generate Report
              </Button>
              <Button icon={<ClearOutlined />} onClick={onClear}>
                Clear
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
