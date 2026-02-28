"use client";

import type { ReactNode } from "react";
import { useContext, useMemo, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

import {
  INITIAL_STATE,
  ContactsStateContext,
  ContactsActionsContext,
  type IContact,
  type IContactsActionContext,
} from "./context";

import { contactsReducer } from "./reducer";
import {
  getContactsPending,
  getContactsSuccess,
  getContactsError,
  getContactPending,
  getContactSuccess,
  getContactError,
  getContactsByClientPending,
  getContactsByClientSuccess,
  getContactsByClientError,
  createContactPending,
  createContactSuccess,
  createContactError,
  updateContactPending,
  updateContactSuccess,
  updateContactError,
  setPrimaryContactPending,
  setPrimaryContactSuccess,
  setPrimaryContactError,
  deleteContactPending,
  deleteContactSuccess,
  deleteContactError,
  clearError,
  clearContact,
} from "./actions";

export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(contactsReducer, INITIAL_STATE);

  const actions = useMemo<IContactsActionContext>(() => {
    // Get all contacts with optional filters
    const getContacts = async (params?: {
      clientId?: string;
      searchTerm?: string;
      isActive?: boolean;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      dispatch(getContactsPending());

      try {
        const api = getAxiosInstance();
        // Contacts API supports isActive filtering; default to active contacts only
        const { data } = await api.get("/api/contacts", {
          params: { ...params, isActive: params?.isActive ?? true },
        });

        const activeContacts = (data.items || []).filter(
          (contact: IContact) => contact.isActive !== false,
        );

        dispatch(
          getContactsSuccess({
            contacts: activeContacts,
            pagination: {
              currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
              pageSize: data.pageSize ?? params?.pageSize ?? 10,
              totalCount: data.totalCount ?? 0,
              totalPages: data.totalPages ?? 0,
            },
          }),
        );
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch contacts");
        dispatch(getContactsError(message));
      }
    };

    // Get contacts by client ID
    const getContactsByClient = async (clientId: string) => {
      dispatch(getContactsByClientPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/contacts/by-client/${clientId}`);
        const activeContacts = (data || []).filter((contact: IContact) => contact.isActive !== false);

        dispatch(getContactsByClientSuccess({ contacts: activeContacts }));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch client contacts");
        dispatch(getContactsByClientError(message));
      }
    };

    // Get a single contact by ID
    const getContact = async (id: string) => {
      dispatch(getContactPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.get(`/api/contacts/${id}`);

        dispatch(getContactSuccess(data));
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to fetch contact");
        dispatch(getContactError(message));
      }
    };

    // Create a new contact
    const createContact = async (
      contact: Omit<IContact, "id" | "createdAt" | "updatedAt" | "clientName">,
    ): Promise<boolean> => {
      dispatch(createContactPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.post("/api/contacts", contact);

        dispatch(createContactSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to create contact");
        dispatch(createContactError(message));
        return false;
      }
    };

    // Update an existing contact
    const updateContact = async (id: string, contact: Partial<IContact>): Promise<boolean> => {
      dispatch(updateContactPending());

      try {
        const api = getAxiosInstance();
        const payload = {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          position: contact.position,
          isPrimaryContact: contact.isPrimaryContact ?? false,
          isActive: contact.isActive ?? true,
        };

        const { data } = await api.put(`/api/contacts/${id}`, payload);

        dispatch(updateContactSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to update contact");
        dispatch(updateContactError(message));
        return false;
      }
    };

    // Set a contact as primary
    const setPrimaryContact = async (id: string): Promise<boolean> => {
      dispatch(setPrimaryContactPending());

      try {
        const api = getAxiosInstance();
        const { data } = await api.put(`/api/contacts/${id}/set-primary`);

        dispatch(setPrimaryContactSuccess(data));
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Failed to set primary contact");
        dispatch(setPrimaryContactError(message));
        return false;
      }
    };

    // Delete a contact
    const deleteContact = async (id: string): Promise<boolean> => {
      dispatch(deleteContactPending());

      try {
        const api = getAxiosInstance();
        await api.delete(`/api/contacts/${id}`);

        dispatch(deleteContactSuccess());
        return true;
      } catch (error: unknown) {
        const maybeError = error as {
          response?: {
            status?: number;
            data?: {
              detail?: string;
              title?: string;
            };
          };
        };

        const status = maybeError.response?.status;
        const apiDetail = maybeError.response?.data?.detail || maybeError.response?.data?.title;

        let message = getErrorMessage(error, "Failed to delete contact");

        if (status === 403) {
          message =
            apiDetail ||
            "You do not have permission to delete contacts. Allowed roles: Admin, SalesManager, BusinessDevelopmentManager.";
        }

        if (status === 404) {
          message = apiDetail || "Contact not found or already deleted.";
        }

        dispatch(deleteContactError(message));
        return false;
      }
    };

    return {
      getContacts,
      getContactsByClient,
      getContact,
      createContact,
      updateContact,
      setPrimaryContact,
      deleteContact,
      clearError: () => dispatch(clearError()),
      clearContact: () => dispatch(clearContact()),
    };
  }, []);

  return (
    <ContactsStateContext.Provider value={state}>
      <ContactsActionsContext.Provider value={actions}>{children}</ContactsActionsContext.Provider>
    </ContactsStateContext.Provider>
  );
};

export const useContactsState = () => {
  const ctx = useContext(ContactsStateContext);
  if (!ctx) throw new Error("useContactsState must be used within ContactsProvider");
  return ctx;
};

export const useContactsActions = () => {
  const ctx = useContext(ContactsActionsContext);
  if (!ctx) throw new Error("useContactsActions must be used within ContactsProvider");
  return ctx;
};
