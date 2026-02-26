"use client";

import React from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Table,
  DatePicker,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IProposal, IProposalLineItem } from "@/providers/proposals/context";
import { useStyles } from "./style";

interface ProposalFormProps {
  form: FormInstance;
  initialValues?: Partial<IProposal>;
  loading?: boolean;
  onSubmit: (values: Partial<IProposal>, lineItems?: IProposalLineItem[]) => void;
  onCancel: () => void;
  opportunities?: Array<{ id: string; title: string }>;
  clients?: Array<{ id: string; name: string }>;
}

const STATUS_OPTIONS = [
  { label: "Draft", value: 1 },
  { label: "Submitted", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Approved", value: 4 },
];

const CURRENCY_OPTIONS = [
  { label: "ZAR", value: "ZAR" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
];

export const ProposalForm: React.FC<ProposalFormProps> = ({
  form,
  initialValues,
  loading,
  onSubmit,
  onCancel,
  opportunities = [],
  clients = [],
}) => {
  const { styles } = useStyles();
  const [lineItems, setLineItems] = React.useState<IProposalLineItem[]>(
    initialValues?.lineItems || []
  );
  const [isAddingLineItem, setIsAddingLineItem] = React.useState(false);
  const [lineItemForm] = Form.useForm();

  const handleAddLineItem = (values: any) => {
    const newLineItem: IProposalLineItem = {
      id: Math.random().toString(),
      productServiceName: values.productServiceName,
      description: values.description,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      discount: values.discount || 0,
      taxRate: values.taxRate || 0,
      total: (values.quantity * values.unitPrice * (1 - (values.discount || 0) / 100)) *
             (1 + (values.taxRate || 0) / 100),
    };

    setLineItems([...lineItems, newLineItem]);
    lineItemForm.resetFields();
    setIsAddingLineItem(false);
  };

  const handleRemoveLineItem = (itemId: string) => {
    setLineItems(lineItems.filter((item) => item.id !== itemId));
  };

  const handleFinish = (values: any) => {
    const proposalData: Partial<IProposal> = {
      title: values.title,
      clientId: values.clientId,
      opportunityId: values.opportunityId,
      status: typeof values.status === "string" ? parseInt(values.status, 10) : values.status || 1,
      description: values.description,
      currency: values.currency || "ZAR",
      validUntil: values.validUntil ? values.validUntil.toISOString() : undefined,
      ...(values.notes ? { notes: values.notes } : {}),
    };
    
    // Pass both proposal data and line items separately
    onSubmit(proposalData, lineItems);
  };

  const lineItemColumns: ColumnsType<IProposalLineItem> = [
    {
      title: "Product/Service",
      dataIndex: "productServiceName",
      key: "productServiceName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => `${price.toLocaleString()}`,
    },
    {
      title: "Discount %",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => `${discount}%`,
    },
    {
      title: "Tax %",
      dataIndex: "taxRate",
      key: "taxRate",
      render: (tax) => `${tax}%`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total.toLocaleString()}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveLineItem(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 1,
          currency: "ZAR",
          ...initialValues,
          validUntil: initialValues?.validUntil ? dayjs(initialValues.validUntil) : undefined,
        }}
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Proposal title" />
        </Form.Item>

        <Form.Item
          label="Client"
          name="clientId"
          rules={[{ required: true, message: "Client is required" }]}
        >
          <Select
            placeholder="Select a client"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={clients.map((client) => ({
              value: client.id,
              label: client.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Opportunity"
          name="opportunityId"
          rules={[{ required: true, message: "Opportunity is required" }]}
        >
          <Select
            placeholder="Select an opportunity"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={opportunities.map((opp) => ({
              value: opp.id,
              label: opp.title,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea rows={3} placeholder="Proposal description" />
        </Form.Item>

        <Form.Item
          label="Valid Until"
          name="validUntil"
        >
          <DatePicker className={styles.fullWidthControl} />
        </Form.Item>

        <Form.Item
          label="Currency"
          name="currency"
        >
          <Select placeholder="Select currency" options={CURRENCY_OPTIONS} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
        >
          <Select placeholder="Select status" options={STATUS_OPTIONS} disabled />
        </Form.Item>

        <Form.Item
          label="Notes"
          name="notes"
        >
          <Input.TextArea rows={2} placeholder="Additional notes" />
        </Form.Item>

        <Form.Item label=" ">
          <Space>
            <Button type="default" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Proposal
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <div className={styles.lineItemsSection}>
        <h3>Line Items</h3>
        <Table
          columns={lineItemColumns}
          dataSource={lineItems}
          rowKey="id"
          pagination={false}
          scroll={{ x: "max-content" }}
          size="small"
        />

        {!isAddingLineItem ? (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => setIsAddingLineItem(true)}
            className={styles.lineItemsAddButton}
          >
            Add Line Item
          </Button>
        ) : (
          <div className={styles.lineItemEditor}>
            <Form form={lineItemForm} layout="vertical" onFinish={handleAddLineItem}>
              <Form.Item
                label="Product/Service Name"
                name="productServiceName"
                rules={[{ required: true, message: "Product/Service name is required" }]}
              >
                <Input placeholder="e.g., Implementation, Support, Training" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
              >
                <Input.TextArea rows={2} placeholder="Additional description" />
              </Form.Item>

              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Quantity is required" }]}
              >
                <InputNumber min={1} placeholder="1" />
              </Form.Item>

              <Form.Item
                label="Unit Price"
                name="unitPrice"
                rules={[{ required: true, message: "Unit price is required" }]}
              >
                <InputNumber min={0} placeholder="0.00" step="0.01" />
              </Form.Item>

              <Form.Item label="Discount %" name="discount">
                <InputNumber min={0} max={100} placeholder="0" />
              </Form.Item>

              <Form.Item label="Tax %" name="taxRate">
                <InputNumber min={0} max={100} placeholder="0" />
              </Form.Item>

              <Space>
                <Button onClick={() => setIsAddingLineItem(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Add Item
                </Button>
              </Space>
            </Form>
          </div>
        )}
      </div>
    </>
  );
};
