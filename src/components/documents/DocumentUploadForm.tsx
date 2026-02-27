"use client";

import React from "react";
import { Form, Input, Modal, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import type { DocumentCategory, RelatedToType } from "@/providers/documents/context";

const { Dragger } = Upload;

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

interface DocumentUploadFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any, file: File) => Promise<void>;
  form: any;
  loading?: boolean;
  relatedToType?: RelatedToType;
  clientOptions?: Array<{ value: string; label: string }>;
  opportunityOptions?: Array<{ value: string; label: string }>;
  proposalOptions?: Array<{ value: string; label: string }>;
  contractOptions?: Array<{ value: string; label: string }>;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  open,
  onCancel,
  onSubmit,
  form,
  loading = false,
  relatedToType,
  clientOptions = [],
  opportunityOptions = [],
  proposalOptions = [],
  contractOptions = [],
}) => {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

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

  const handleSubmit = async () => {
    try {
      // Check file first
      if (!selectedFile) {
        throw new Error("Please select a file to upload");
      }

      // Validate form fields
      const values = await form.validateFields();

      // Call parent submission handler
      await onSubmit(values, selectedFile);
      setFileList([]);
      setSelectedFile(null);
      form.resetFields();
    } catch (error) {
      console.error("Upload form error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  };

  const handleCancel = () => {
    setFileList([]);
    setSelectedFile(null);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Upload Document"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Upload"
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="File" required>
          <Dragger
            fileList={fileList}
            beforeUpload={(file) => {
              setFileList([
                {
                  uid: "-1",
                  name: file.name,
                  status: "done",
                  originFileObj: file,
                } as UploadFile,
              ]);
              setSelectedFile(file);
              return false; // Prevent auto upload
            }}
            onRemove={() => {
              setFileList([]);
              setSelectedFile(null);
            }}
            maxCount={1}
            accept="*/*"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Maximum file size: 50 MB</p>
          </Dragger>
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category" options={CATEGORY_OPTIONS} />
        </Form.Item>

        <Form.Item
          label="Related To Type"
          name="relatedToType"
          rules={[{ required: true, message: "Please select related to type" }]}
        >
          <Select
            placeholder="Select type"
            options={RELATED_TO_OPTIONS}
            onChange={() => form.setFieldValue("relatedToId", undefined)}
          />
        </Form.Item>

        <Form.Item
          label="Related To"
          name="relatedToId"
          rules={[{ required: true, message: "Please select related entity" }]}
        >
          {!relatedToType ? (
            <Select placeholder="Select type first" disabled />
          ) : (
            <Select
              placeholder="Select entity"
              options={getRelatedToIdOptions()}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          )}
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Enter document description (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
