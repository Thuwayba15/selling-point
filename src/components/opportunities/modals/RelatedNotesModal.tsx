import { Modal, Button, Space } from "antd";
import { NotesTable } from "@/components/notes/NotesTable";
import { INote } from "@/providers/notes/context";
import { RelatedNotesTarget } from "@/hooks/useWorkspaceNotes";

interface RelatedNotesModalProps {
  open: boolean;
  target: RelatedNotesTarget | null;
  notes: INote[];
  loading: boolean;
  selectedNote: INote | null;
  onSelectNote: (note: INote | null) => void;
  onAdd: () => void;
  onEdit: (note: INote) => void;
  onDelete: (note: INote | null) => void;
  onClose: () => void;
  canDelete: boolean;
}

export const RelatedNotesModal = ({
  open,
  target,
  notes,
  loading,
  selectedNote,
  onSelectNote,
  onAdd,
  onEdit,
  onDelete,
  onClose,
  canDelete,
}: RelatedNotesModalProps) => {
  return (
    <Modal
      title={`Notes - ${target?.title || ""}`}
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space>
          <Button type="primary" onClick={onAdd}>
            Add Note
          </Button>
          {selectedNote && (
            <>
              <Button onClick={() => onEdit(selectedNote)}>Edit</Button>
              {canDelete && (
                <Button danger onClick={() => onDelete(selectedNote)}>
                  Delete
                </Button>
              )}
            </>
          )}
        </Space>

        <NotesTable
          notes={notes}
          loading={loading}
          onSelectNote={onSelectNote}
          selectedNoteId={selectedNote?.id}
        />
      </Space>
    </Modal>
  );
};
