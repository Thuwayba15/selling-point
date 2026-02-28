"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, Form, App } from "antd";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import { useContactsState, useContactsActions } from "@/providers/contacts";
import {
  ContactsHeader,
  ContactsFilters,
  ContactsTable,
  ContactDetails,
  ContactActions,
  ContactForm,
} from "@/components/contacts";
import { useStyles } from "@/components/contacts/style";
import { IContact } from "@/providers/contacts/context";
import type { ContactFormValues } from "@/types/forms";
import { fetchActiveClientsForDropdown, type IClientOption } from "@/utils/clients";

const ContactsPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { isPending, isLoadingDetails, isError, errorMessage, contacts, contact, pagination } =
    useContactsState();
  const {
    getContacts,
    getContact,
    createContact,
    updateContact,
    setPrimaryContact,
    deleteContact,
    clearError,
    clearContact,
  } = useContactsActions();

  // Local State
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [clients, setClients] = useState<IClientOption[]>([]);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Prevent double-fetching on mount
  const initializedRef = useRef(false);

  // Fetch active clients for dropdowns
  useEffect(() => {
    const loadClients = async () => {
      const activeClients = await fetchActiveClientsForDropdown();
      setClients(activeClients);
    };

    loadClients();
  }, []);

  // Initialize contacts on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      getContacts({ pageNumber: currentPage, pageSize });
    }
  }, []);

  // Handle contact selection change
  useEffect(() => {
    if (selectedContact) {
      getContact(selectedContact.id);
    }
  }, [selectedContact?.id]);

  // Handle errors
  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      clearError();
    }
  }, [isError, errorMessage]);

  // Handlers: Create Contact
  const handleCreateClick = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (values: ContactFormValues) => {
    const contactData = {
      ...values,
      isPrimaryContact: values.isPrimaryContact ?? false,
    };
    const success = await createContact(contactData);
    if (success) {
      message.success("Contact created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      // Refresh list
      await getContacts({
        searchTerm,
        clientId,
        pageNumber: currentPage,
        pageSize,
      });
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  // Handlers: Edit Contact
  const handleEdit = () => {
    if (!selectedContact) return;
    editForm.setFieldsValue(selectedContact);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: ContactFormValues) => {
    if (!selectedContact) return;

    const contactData = {
      ...values,
      isPrimaryContact: values.isPrimaryContact ?? false,
    };
    const success = await updateContact(selectedContact.id, contactData);
    if (success) {
      message.success("Contact updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      // Refresh
      await getContacts({
        searchTerm,
        clientId,
        pageNumber: currentPage,
        pageSize,
      });
      if (selectedContact.id === contact?.id) {
        await getContact(selectedContact.id);
      }
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  // Handlers: Delete Contact
  const handleDelete = async () => {
    if (!selectedContact) return;

    const success = await deleteContact(selectedContact.id);
    if (success) {
      message.success("Contact deleted successfully");
      setSelectedContact(null);
      clearContact();
      // Refresh list
      await getContacts({
        searchTerm,
        clientId,
        pageNumber: currentPage,
        pageSize,
      });
    }
  };

  // Handlers: Set Primary Contact
  const handleSetPrimary = async () => {
    if (!selectedContact) return;

    const success = await setPrimaryContact(selectedContact.id);
    if (success) {
      message.success("Primary contact updated successfully");
      // Refresh
      await getContacts({
        searchTerm,
        clientId,
        pageNumber: currentPage,
        pageSize,
      });
      await getContact(selectedContact.id);
    }
  };

  // Handlers: Contact Selection
  const handleSelectContact = (contact: IContact) => {
    setSelectedContact(contact);
  };

  // Handlers: Filters
  const handleApplyFilters = (filters: { searchTerm?: string; clientId?: string }) => {
    setSearchTerm(filters.searchTerm);
    setClientId(filters.clientId);
    setCurrentPage(1); // Reset to first page
    getContacts({
      ...filters,
      pageNumber: 1,
      pageSize,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm(undefined);
    setClientId(undefined);
    setCurrentPage(1);
    getContacts({
      pageNumber: 1,
      pageSize,
    });
  };

  // Handlers: Pagination
  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
    getContacts({
      searchTerm,
      clientId,
      pageNumber: page,
      pageSize: newPageSize,
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <ContactsHeader onCreateClick={handleCreateClick} />

        <ContactsFilters
          onApplyFilters={handleApplyFilters}
          onClear={handleClearFilters}
          clients={clients}
        />

        <ContactsTable
          contacts={contacts || []}
          loading={isPending}
          pagination={pagination}
          selectedContactId={selectedContact?.id}
          onSelectContact={handleSelectContact}
          onPaginationChange={handlePaginationChange}
        />

        {selectedContact && (
          <div className={styles.selectedRow}>
            <div className={styles.detailsPanel}>
              <ContactDetails contact={contact || null} loading={isLoadingDetails} />
            </div>
            <ContactActions
              contact={selectedContact}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
            />
          </div>
        )}

        {/* Create Modal */}
        <Modal
          title="Create Contact"
          open={isCreateModalOpen}
          onCancel={handleCreateCancel}
          footer={null}
          width={600}
        >
          <ContactForm
            form={createForm}
            onSubmit={handleCreateSubmit}
            loading={isPending}
            clients={clients}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Edit Contact"
          open={isEditModalOpen}
          onCancel={handleEditCancel}
          footer={null}
          width={600}
        >
          <ContactForm
            form={editForm}
            initialValues={selectedContact || undefined}
            onSubmit={handleEditSubmit}
            loading={isPending}
            clients={clients}
          />
        </Modal>
      </div>
    </div>
  );
};

export default withAuthGuard(ContactsPage);
