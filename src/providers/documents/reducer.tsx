"use client";

import { handleActions } from "redux-actions";
import type { Action } from "redux-actions";

import { INITIAL_STATE, type IDocumentsStateContext } from "./context";
import { DocumentsActionEnums } from "./actions";

export const DocumentsReducer = handleActions<IDocumentsStateContext, IDocumentsStateContext>(
  {
    [DocumentsActionEnums.getDocumentsPending]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.getDocumentsSuccess]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.getDocumentsError]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.getDocumentPending]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.getDocumentSuccess]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.getDocumentError]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.uploadDocumentPending]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.uploadDocumentSuccess]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.uploadDocumentError]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.deleteDocumentPending]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.deleteDocumentSuccess]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.deleteDocumentError]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.clearError]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.clearDocument]: (
      state: IDocumentsStateContext,
      action: Action<IDocumentsStateContext>
    ) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);
