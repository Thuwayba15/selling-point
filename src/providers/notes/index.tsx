"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import {
  INITIAL_STATE,
  INote,
  RelatedToType,
  NotesActionContext,
  NotesStateContext,
} from "./context";
import { NotesReducer } from "./reducer";
import {
  getNotesPending,
  getNotesSuccess,
  getNotesError,
  getNotePending,
  getNoteSuccess,
  getNoteError,
  createNotePending,
  createNoteSuccess,
  createNoteError,
  updateNotePending,
  updateNoteSuccess,
  updateNoteError,
  deleteNotePending,
  deleteNoteSuccess,
  deleteNoteError,
  clearError as clearErrorAction,
  clearNote as clearNoteAction,
} from "./actions";

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(NotesReducer, INITIAL_STATE);
  const api = getAxiosInstance();

  // ============================================================================
  // Get Notes (with filters)
  // GET /api/notes
  // ============================================================================
  const getNotes = async (params?: {
    relatedToType?: RelatedToType;
    relatedToId?: string;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    dispatch(getNotesPending());
    try {
      const response = await api.get("/api/notes", { params });
      const data = response.data;
      dispatch(
        getNotesSuccess({
          notes: data.items || data,
          pagination: {
            currentPage: data.currentPage ?? data.pageNumber ?? params?.pageNumber ?? 1,
            pageSize: data.pageSize ?? params?.pageSize ?? 10,
            totalCount: data.totalCount ?? 0,
            totalPages: data.totalPages ?? 0,
          },
        }),
      );
    } catch (error: unknown) {
      dispatch(getNotesError(getErrorMessage(error, "Failed to fetch notes")));
    }
  };

  // ============================================================================
  // Get Single Note
  // GET /api/notes/{id}
  // ============================================================================
  const getNote = async (id: string) => {
    dispatch(getNotePending());
    try {
      const response = await api.get(`/api/notes/${id}`);
      dispatch(getNoteSuccess(response.data));
    } catch (error: unknown) {
      dispatch(getNoteError(getErrorMessage(error, "Failed to fetch note")));
    }
  };

  // ============================================================================
  // Create Note
  // POST /api/notes
  // ============================================================================
  const createNote = async (note: Partial<INote>) => {
    dispatch(createNotePending());
    try {
      const response = await api.post("/api/notes", note);
      dispatch(createNoteSuccess(response.data));
    } catch (error: unknown) {
      dispatch(createNoteError(getErrorMessage(error, "Failed to create note")));
    }
  };

  // ============================================================================
  // Update Note
  // PUT /api/notes/{id}
  // ============================================================================
  const updateNote = async (id: string, note: Partial<INote>) => {
    dispatch(updateNotePending());
    try {
      const response = await api.put(`/api/notes/${id}`, note);
      dispatch(updateNoteSuccess(response.data));
    } catch (error: unknown) {
      dispatch(updateNoteError(getErrorMessage(error, "Failed to update note")));
    }
  };

  // ============================================================================
  // Delete Note
  // DELETE /api/notes/{id}
  // ============================================================================
  const deleteNote = async (id: string) => {
    dispatch(deleteNotePending());
    try {
      await api.delete(`/api/notes/${id}`);
      dispatch(deleteNoteSuccess());
    } catch (error: unknown) {
      dispatch(deleteNoteError(getErrorMessage(error, "Failed to delete note")));
    }
  };

  // ============================================================================
  // Utility Actions
  // ============================================================================
  const clearError = () => {
    dispatch(clearErrorAction());
  };

  const clearNote = () => {
    dispatch(clearNoteAction());
  };

  return (
    <NotesStateContext.Provider value={state}>
      <NotesActionContext.Provider
        value={{
          getNotes,
          getNote,
          createNote,
          updateNote,
          deleteNote,
          clearError,
          clearNote,
        }}
      >
        {children}
      </NotesActionContext.Provider>
    </NotesStateContext.Provider>
  );
};

export const useNotesState = () => {
  const context = useContext(NotesStateContext);
  if (!context) {
    throw new Error("useNotesState must be used within a NotesProvider");
  }
  return context;
};

export const useNotesActions = () => {
  const context = useContext(NotesActionContext);
  if (!context) {
    throw new Error("useNotesActions must be used within a NotesProvider");
  }
  return context;
};
