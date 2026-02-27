import { createAction } from "redux-actions";
import { IContact, IContactsStateContext, IPaginationInfo } from "./context";

// Enum defining the type of actions that can be dispatched
export enum ContactsActionEnums {
  // Get all contacts
  getContactsPending = "GET_CONTACTS_PENDING",
  getContactsSuccess = "GET_CONTACTS_SUCCESS",
  getContactsError = "GET_CONTACTS_ERROR",

  // Get single contact
  getContactPending = "GET_CONTACT_PENDING",
  getContactSuccess = "GET_CONTACT_SUCCESS",
  getContactError = "GET_CONTACT_ERROR",

  // Get contacts by client
  getContactsByClientPending = "GET_CONTACTS_BY_CLIENT_PENDING",
  getContactsByClientSuccess = "GET_CONTACTS_BY_CLIENT_SUCCESS",
  getContactsByClientError = "GET_CONTACTS_BY_CLIENT_ERROR",

  // Create contact
  createContactPending = "CREATE_CONTACT_PENDING",
  createContactSuccess = "CREATE_CONTACT_SUCCESS",
  createContactError = "CREATE_CONTACT_ERROR",

  // Update contact
  updateContactPending = "UPDATE_CONTACT_PENDING",
  updateContactSuccess = "UPDATE_CONTACT_SUCCESS",
  updateContactError = "UPDATE_CONTACT_ERROR",

  // Set primary contact
  setPrimaryContactPending = "SET_PRIMARY_CONTACT_PENDING",
  setPrimaryContactSuccess = "SET_PRIMARY_CONTACT_SUCCESS",
  setPrimaryContactError = "SET_PRIMARY_CONTACT_ERROR",

  // Delete contact
  deleteContactPending = "DELETE_CONTACT_PENDING",
  deleteContactSuccess = "DELETE_CONTACT_SUCCESS",
  deleteContactError = "DELETE_CONTACT_ERROR",

  // Utility actions
  clearError = "CLEAR_ERROR",
  clearContact = "CLEAR_CONTACT",
}

// ============================================================================
// Get Contacts Actions
// ============================================================================
export const getContactsPending = createAction<IContactsStateContext>(
  ContactsActionEnums.getContactsPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getContactsSuccess = createAction<
  IContactsStateContext,
  { contacts: IContact[]; pagination?: IPaginationInfo }
>(ContactsActionEnums.getContactsSuccess, ({ contacts, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  contacts,
  pagination,
}));

export const getContactsError = createAction<IContactsStateContext, string>(
  ContactsActionEnums.getContactsError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Get Single Contact Actions
// ============================================================================
export const getContactPending = createAction<IContactsStateContext>(
  ContactsActionEnums.getContactPending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false }),
);

export const getContactSuccess = createAction<IContactsStateContext, IContact>(
  ContactsActionEnums.getContactSuccess,
  (contact: IContact) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contact,
  }),
);

export const getContactError = createAction<IContactsStateContext, string>(
  ContactsActionEnums.getContactError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Get Contacts By Client Actions
// ============================================================================
export const getContactsByClientPending = createAction<IContactsStateContext>(
  ContactsActionEnums.getContactsByClientPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getContactsByClientSuccess = createAction<
  IContactsStateContext,
  { contacts: IContact[] }
>(ContactsActionEnums.getContactsByClientSuccess, ({ contacts }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  contacts,
}));

export const getContactsByClientError = createAction<IContactsStateContext, string>(
  ContactsActionEnums.getContactsByClientError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Create Contact Actions
// ============================================================================
export const createContactPending = createAction<IContactsStateContext>(
  ContactsActionEnums.createContactPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const createContactSuccess = createAction<IContactsStateContext, IContact>(
  ContactsActionEnums.createContactSuccess,
  (contact: IContact) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contact,
  }),
);

export const createContactError = createAction<IContactsStateContext, string>(
  ContactsActionEnums.createContactError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Update Contact Actions
// ============================================================================
export const updateContactPending = createAction<IContactsStateContext>(
  ContactsActionEnums.updateContactPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const updateContactSuccess = createAction<IContactsStateContext, IContact>(
  ContactsActionEnums.updateContactSuccess,
  (contact: IContact) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contact,
  }),
);

export const updateContactError = createAction<IContactsStateContext, string>(
  ContactsActionEnums.updateContactError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Set Primary Contact Actions
// ============================================================================
export const setPrimaryContactPending = createAction<IContactsStateContext>(
  ContactsActionEnums.setPrimaryContactPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const setPrimaryContactSuccess = createAction<IContactsStateContext, IContact>(
  ContactsActionEnums.setPrimaryContactSuccess,
  (contact: IContact) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contact,
  }),
);

export const setPrimaryContactError = createAction<IContactsStateContext, string>(
  ContactsActionEnums.setPrimaryContactError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Delete Contact Actions
// ============================================================================
export const deleteContactPending = createAction<IContactsStateContext>(
  ContactsActionEnums.deleteContactPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const deleteContactSuccess = createAction<IContactsStateContext>(
  ContactsActionEnums.deleteContactSuccess,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    contact: undefined,
  }),
);

export const deleteContactError = createAction<IContactsStateContext, string>(
  ContactsActionEnums.deleteContactError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

// ============================================================================
// Utility Actions
// ============================================================================
export const clearError = createAction<IContactsStateContext>(
  ContactsActionEnums.clearError,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
  }),
);

export const clearContact = createAction<IContactsStateContext>(
  ContactsActionEnums.clearContact,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    contact: undefined,
  }),
);
