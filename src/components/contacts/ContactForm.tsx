"use client";

import { Form, Input, Button, Select, Switch } from "antd";
import type { FormInstance } from "antd";
import { IContact } from "@/providers/contacts/context";

interface ContactFormProps {
  form: FormInstance;
  initialValues?: Partial<IContact>;
  onSubmit: (values: any) => void;
  loading: boolean;
  clients?: Array<{ id: string; name: string }>;
}

export const ContactForm = ({
  form,
  initialValues,
  onSubmit,
  loading,
  clients = [],
}: ContactFormProps) => {
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="clientId"
        label="Client"
        rules={[{ required: true, message: "Please select a client" }]}
      >
        <Select
          placeholder="Select client"
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
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: "Please enter first name" }]}
      >
        <Input placeholder="Enter first name" />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: "Please enter last name" }]}
      >
        <Input placeholder="Enter last name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="contact@example.com" />
      </Form.Item>

      <Form.Item name="phoneNumber" label="Phone Number">
        <Input placeholder="+27 11 123 4567" />
      </Form.Item>

      <Form.Item name="position" label="Position">
        <Input placeholder="e.g., CEO, Manager" />
      </Form.Item>

      <Form.Item
        name="isPrimaryContact"
        label="Primary Contact"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={handleSubmit} loading={loading} block>
          {initialValues?.id ? "Update Contact" : "Create Contact"}
        </Button>
      </Form.Item>
    </Form>
  );
};
