import { NotesActions } from "@/components/notes/NotesActions";
import { NotesTable } from "@/components/notes/NotesTable";
import { INote } from "@/providers/notes/context";

interface NotesTabProps {
  notes: INote[];
  isLoading: boolean;
  selectedNote: INote | null;
  onSelectNote: (note: INote | null) => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const NotesTab = ({
  notes,
  isLoading,
  selectedNote,
  onSelectNote,
  onAdd,
  onEdit,
  onDelete,
}: NotesTabProps) => {
  return (
    <>
      <NotesActions
        note={selectedNote}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={isLoading}
      />
      <NotesTable
        notes={notes}
        loading={isLoading}
        onSelectNote={onSelectNote}
        selectedNoteId={selectedNote?.id}
      />
    </>
  );
};
