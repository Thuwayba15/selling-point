import { handleActions } from "redux-actions";
import { INITIAL_STATE, INotesStateContext } from "./context";
import { NotesActionEnums } from "./actions";

export const NotesReducer = handleActions<INotesStateContext, INotesStateContext>(
  {
    [NotesActionEnums.getNotesPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.getNotesSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.getNotesError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [NotesActionEnums.getNotePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.getNoteSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.getNoteError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [NotesActionEnums.createNotePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.createNoteSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.createNoteError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [NotesActionEnums.updateNotePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.updateNoteSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.updateNoteError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [NotesActionEnums.deleteNotePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.deleteNoteSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.deleteNoteError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [NotesActionEnums.clearError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [NotesActionEnums.clearNote]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE,
);
