import { handleActions } from "redux-actions";
import type { Action } from "redux-actions";

import { INITIAL_STATE, type IContactsStateContext } from "./context";
import {
  ContactsActionEnums,
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

export const contactsReducer = handleActions<
  IContactsStateContext,
  IContactsStateContext
>(
  {
    // Get contacts
    [ContactsActionEnums.getContactsPending]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.getContactsSuccess]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.getContactsError]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    // Get single contact
    [ContactsActionEnums.getContactPending]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.getContactSuccess]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.getContactError]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    // Get contacts by client
    [ContactsActionEnums.getContactsByClientPending]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.getContactsByClientSuccess]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.getContactsByClientError]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    // Create contact
    [ContactsActionEnums.createContactPending]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.createContactSuccess]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.createContactError]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    // Update contact
    [ContactsActionEnums.updateContactPending]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.updateContactSuccess]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.updateContactError]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    // Set primary contact
    [ContactsActionEnums.setPrimaryContactPending]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.setPrimaryContactSuccess]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.setPrimaryContactError]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    // Delete contact
    [ContactsActionEnums.deleteContactPending]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.deleteContactSuccess]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.deleteContactError]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    // Utility actions
    [ContactsActionEnums.clearError]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.clearContact]: (
      state: IContactsStateContext,
      action: Action<IContactsStateContext>
    ) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);
