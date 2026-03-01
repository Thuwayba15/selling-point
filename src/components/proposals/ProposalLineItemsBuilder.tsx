"use client";

import { useMemo, useState } from "react";
import { Button, Input, InputNumber, Space, Table } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { calculateProposalTotals } from "@/utils/proposal";
import { useStyles } from "./style";

export interface ICreateProposalLineItem {
  tempId: string;
  productServiceName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

interface ProposalLineItemsBuilderProps {
  lineItems: ICreateProposalLineItem[];
  onChange: (items: ICreateProposalLineItem[]) => void;
  currency: string;
}

export const ProposalLineItemsBuilder = ({
  lineItems,
  onChange,
  currency,
}: ProposalLineItemsBuilderProps) => {
  const { styles } = useStyles();
  const [isAddingLineItem, setIsAddingLineItem] = useState(false);
  const [formValues, setFormValues] = useState<Partial<ICreateProposalLineItem>>({
    quantity: 1,
    discount: 0,
    taxRate: 0,
  });

  const totals = useMemo(() => calculateProposalTotals(lineItems), [lineItems]);

  const handleAddLineItem = () => {
    if (!formValues.productServiceName || formValues.unitPrice === undefined || formValues.unitPrice <= 0) {
      return;
    }

    const nextItem: ICreateProposalLineItem = {
      tempId: crypto.randomUUID(),
      productServiceName: formValues.productServiceName,
      description: formValues.description,
      quantity: formValues.quantity || 1,
      unitPrice: formValues.unitPrice,
      discount: formValues.discount || 0,
      taxRate: formValues.taxRate || 0,
    };

    onChange([...lineItems, nextItem]);
    setFormValues({ quantity: 1, discount: 0, taxRate: 0 });
    setIsAddingLineItem(false);
  };

  const handleRemoveLineItem = (tempId: string) => {
    onChange(lineItems.filter((item) => item.tempId !== tempId));
  };

  const lineItemColumns: ColumnsType<ICreateProposalLineItem> = [
    {
      title: "Product/Service",
      dataIndex: "productServiceName",
      key: "productServiceName",
      render: (value: string | undefined) => value || "—",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value: string | undefined) => value || "—",
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
      render: (value: number) => `${currency} ${value.toLocaleString()}`,
    },
    {
      title: "Discount %",
      dataIndex: "discount",
      key: "discount",
      render: (value: number) => `${value}%`,
    },
    {
      title: "Tax %",
      dataIndex: "taxRate",
      key: "taxRate",
      render: (value: number) => `${value}%`,
    },
    {
      title: "Line Total",
      key: "lineTotal",
      render: (_, item) => {
        const subtotal = item.quantity * item.unitPrice;
        const discountAmount = subtotal * (item.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = afterDiscount * (item.taxRate / 100);
        const total = afterDiscount + taxAmount;

        return `${currency} ${total.toLocaleString()}`;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveLineItem(item.tempId)}
        />
      ),
    },
  ];

  return (
    <div className={styles.lineItemsSection}>
      <h3 className={styles.lineItemsHeader}>Line Items</h3>

      <Table
        columns={lineItemColumns}
        dataSource={lineItems}
        rowKey="tempId"
        pagination={false}
        scroll={{ x: "max-content" }}
        size="small"
      />

      {lineItems.length > 0 && (
        <div className={styles.summarySection}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Subtotal:</span>
            <span className={styles.summaryValue}>
              {currency} {totals.subtotal.toLocaleString()}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Tax:</span>
            <span className={styles.summaryValue}>
              {currency} {totals.tax.toLocaleString()}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={`${styles.summaryLabel} ${styles.totalAmount}`}>Total:</span>
            <span className={`${styles.summaryValue} ${styles.totalAmount}`}>
              {currency} {totals.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

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
          <div className={styles.lineItemFieldGroup}>
            <label className={styles.lineItemFieldLabel}>
              Product/Service Name
            </label>
            <Input
              placeholder="e.g., Implementation, Support, Training"
              value={formValues.productServiceName || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, productServiceName: e.target.value })
              }
            />
          </div>

          <div className={styles.lineItemFieldGroup}>
            <label className={styles.lineItemFieldLabel}>
              Description
            </label>
            <Input.TextArea
              rows={2}
              placeholder="Additional description"
              value={formValues.description || ""}
              onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
            />
          </div>

          <div className={styles.lineItemFieldGroup}>
            <label className={styles.lineItemFieldLabel}>
              Quantity
            </label>
            <InputNumber
              min={1}
              className={styles.fullWidthControl}
              value={formValues.quantity || 1}
              onChange={(value) => setFormValues({ ...formValues, quantity: value || 1 })}
            />
          </div>

          <div className={styles.lineItemFieldGroup}>
            <label className={styles.lineItemFieldLabel}>
              Unit Price
            </label>
            <InputNumber
              min={0}
              step={0.01}
              className={styles.fullWidthControl}
              value={formValues.unitPrice || 0}
              onChange={(value) => setFormValues({ ...formValues, unitPrice: value || 0 })}
            />
          </div>

          <div className={styles.lineItemFieldGroup}>
            <label className={styles.lineItemFieldLabel}>
              Discount %
            </label>
            <InputNumber
              min={0}
              max={100}
              className={styles.fullWidthControl}
              value={formValues.discount || 0}
              onChange={(value) => setFormValues({ ...formValues, discount: value || 0 })}
            />
          </div>

          <div className={styles.lineItemFieldGroup}>
            <label className={styles.lineItemFieldLabel}>
              Tax %
            </label>
            <InputNumber
              min={0}
              max={100}
              className={styles.fullWidthControl}
              value={formValues.taxRate || 0}
              onChange={(value) => setFormValues({ ...formValues, taxRate: value || 0 })}
            />
          </div>

          <Space>
            <Button onClick={() => setIsAddingLineItem(false)}>Cancel</Button>
            <Button type="primary" onClick={handleAddLineItem}>
              Add Item
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};
