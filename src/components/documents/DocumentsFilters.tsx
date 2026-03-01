"use client";

import React from "react";
import { Button, Card, Col, Form, Row, Select, Space } from "antd";
import type { FormInstance } from "antd";
import type { DocumentCategory, RelatedToType } from "@/providers/documents/context";

const CATEGORY_OPTIONS = [
  { value: 1, label: "Proposal" },
  { value: 2, label: "Contract" },
  { value: 3, label: "Presentation" },
  { value: 4, label: "RFP" },
  { value: 5, label: "Other" },
];

const RELATED_TO_OPTIONS = [
  { value: 1, label: "Client" },
  { value: 2, label: "Opportunity" },
  { value: 3, label: "Proposal" },
  { value: 4, label: "Contract" },
];

interface DocumentsFiltersProps {
  form: FormInstance;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
  relatedToType?: RelatedToType;
  clientOptions?: Array<{ value: string; label: string }>;
  opportunityOptions?: Array<{ value: string; label: string }>;
  proposalOptions?: Array<{ value: string; label: string }>;
  contractOptions?: Array<{ value: string; label: string }>;
}

export const DocumentsFilters: React.FC<DocumentsFiltersProps> = ({
  form,
  onApplyFilters,
  onClearFilters,
  loading = false,
  relatedToType,
  clientOptions = [],
  opportunityOptions = [],
  proposalOptions = [],
  contractOptions = [],
}) => {
  const getRelatedToIdOptions = () => {
    if (!relatedToType) return [];
    switch (relatedToType) {
      case 1:
        return clientOptions;
      case 2:
        return opportunityOptions;
      case 3:
        return proposalOptions;
      case 4:
        return contractOptions;
      default:
        return [];
    }
  };

  return (
    <Card title="Filters" style={{ marginBottom: 16 }}>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item label="Category" name="category">
              <Select placeholder="Select category" options={CATEGORY_OPTIONS} allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Related To Type" name="relatedToType">
              <Select
                placeholder="Select type"
                options={RELATED_TO_OPTIONS}
                allowClear
                onChange={() => form.setFieldValue("relatedToId", undefined)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Related To" name="relatedToId">
              {!relatedToType ? (
                <Select placeholder="Select type first" disabled />
              ) : (
                <Select
                  placeholder="Select entity"
                  options={getRelatedToIdOptions()}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Space>
        <Button type="primary" onClick={onApplyFilters} loading={loading}>
          Apply Filters
        </Button>
        <Button onClick={onClearFilters} loading={loading}>
          Clear Filters
        </Button>
      </Space>
    </Card>
  );
};
