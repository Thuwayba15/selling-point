import { createAction } from "redux-actions";
import { INote, INotesStateContext, IPaginationInfo } from "./context";

export enum NotesActionEnums {
  getNotesPending = "GET_NOTES_PENDING",
  getNotesSuccess = "GET_NOTES_SUCCESS",
  getNotesError = "GET_NOTES_ERROR",

  getNotePending = "GET_NOTE_PENDING",
  getNoteSuccess = "GET_NOTE_SUCCESS",
  getNoteError = "GET_NOTE_ERROR",

  createNotePending = "CREATE_NOTE_PENDING",
  createNoteSuccess = "CREATE_NOTE_SUCCESS",
  createNoteError = "CREATE_NOTE_ERROR",

  updateNotePending = "UPDATE_NOTE_PENDING",
  updateNoteSuccess = "UPDATE_NOTE_SUCCESS",
  updateNoteError = "UPDATE_NOTE_ERROR",

  deleteNotePending = "DELETE_NOTE_PENDING",
  deleteNoteSuccess = "DELETE_NOTE_SUCCESS",
  deleteNoteError = "DELETE_NOTE_ERROR",

  clearError = "CLEAR_ERROR",
  clearNote = "CLEAR_NOTE",
}

export const getNotesPending = createAction<INotesStateContext>(
  NotesActionEnums.getNotesPending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const getNotesSuccess = createAction<
  INotesStateContext,
  { notes: INote[]; pagination?: IPaginationInfo }
>(NotesActionEnums.getNotesSuccess, ({ notes, pagination }) => ({
  isPending: false,
  isLoadingDetails: false,
  isSuccess: true,
  isError: false,
  notes,
  pagination,
}));

export const getNotesError = createAction<INotesStateContext, string>(
  NotesActionEnums.getNotesError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

export const getNotePending = createAction<INotesStateContext>(
  NotesActionEnums.getNotePending,
  () => ({ isPending: false, isLoadingDetails: true, isSuccess: false, isError: false }),
);

export const getNoteSuccess = createAction<INotesStateContext, INote>(
  NotesActionEnums.getNoteSuccess,
  (note: INote) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    note,
  }),
);

export const getNoteError = createAction<INotesStateContext, string>(
  NotesActionEnums.getNoteError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

export const createNotePending = createAction<INotesStateContext>(
  NotesActionEnums.createNotePending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const createNoteSuccess = createAction<INotesStateContext, INote>(
  NotesActionEnums.createNoteSuccess,
  (note: INote) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    note,
  }),
);

export const createNoteError = createAction<INotesStateContext, string>(
  NotesActionEnums.createNoteError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

export const updateNotePending = createAction<INotesStateContext>(
  NotesActionEnums.updateNotePending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const updateNoteSuccess = createAction<INotesStateContext, INote>(
  NotesActionEnums.updateNoteSuccess,
  (note: INote) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    note,
  }),
);

export const updateNoteError = createAction<INotesStateContext, string>(
  NotesActionEnums.updateNoteError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

export const deleteNotePending = createAction<INotesStateContext>(
  NotesActionEnums.deleteNotePending,
  () => ({ isPending: true, isLoadingDetails: false, isSuccess: false, isError: false }),
);

export const deleteNoteSuccess = createAction<INotesStateContext>(
  NotesActionEnums.deleteNoteSuccess,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: true,
    isError: false,
    note: undefined,
  }),
);

export const deleteNoteError = createAction<INotesStateContext, string>(
  NotesActionEnums.deleteNoteError,
  (errorMessage: string) => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  }),
);

export const clearError = createAction<INotesStateContext>(
  NotesActionEnums.clearError,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    errorMessage: undefined,
  }),
);

export const clearNote = createAction<INotesStateContext>(
  NotesActionEnums.clearNote,
  () => ({
    isPending: false,
    isLoadingDetails: false,
    isSuccess: false,
    isError: false,
    note: undefined,
  }),
);
