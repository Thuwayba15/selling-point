import { useState, useCallback } from "react";
import { App, Form } from "antd";
import { useNotesActions } from "@/providers/notes";
import { useRbac } from "@/hooks/useRbac";
import { INote, RelatedToType } from "@/providers/notes/context";
import { getAxiosInstance } from "@/lib/axios";

export type RelatedNotesTarget = {
  relatedToType: RelatedToType;
  relatedToId: string;
  title: string;
};

export const useWorkspaceNotes = (onRefresh: () => Promise<void>) => {
  const { message, modal } = App.useApp();
  const { can } = useRbac();
  const notesActions = useNotesActions();

  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [isRelatedNotesModalOpen, setIsRelatedNotesModalOpen] = useState(false);
  const [relatedNotesTarget, setRelatedNotesTarget] = useState<RelatedNotesTarget | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<INote[]>([]);
  const [isRelatedNotesLoading, setIsRelatedNotesLoading] = useState(false);
  const [selectedRelatedNote, setSelectedRelatedNote] = useState<INote | null>(null);
  const [isWorkspaceNoteFormOpen, setIsWorkspaceNoteFormOpen] = useState(false);
  const [workspaceNoteForm] = Form.useForm();
  const [editingWorkspaceNote, setEditingWorkspaceNote] = useState<INote | null>(null);
  const [isRelatedNoteFormOpen, setIsRelatedNoteFormOpen] = useState(false);
  const [relatedNoteForm] = Form.useForm();
  const [editingRelatedNote, setEditingRelatedNote] = useState<INote | null>(null);

  const loadRelatedNotes = useCallback(async (target: RelatedNotesTarget) => {
    setIsRelatedNotesLoading(true);
    try {
      const api = getAxiosInstance();
      const { data } = await api.get("/api/notes", {
        params: {
          relatedToType: target.relatedToType,
          relatedToId: target.relatedToId,
          pageNumber: 1,
          pageSize: 1000,
        },
      });
      setRelatedNotes((data?.items || data || []) as INote[]);
    } catch {
      setRelatedNotes([]);
      message.error("Failed to load related notes");
    } finally {
      setIsRelatedNotesLoading(false);
    }
  }, [message]);

  const openRelatedNotes = useCallback(
    async (target: RelatedNotesTarget) => {
      setSelectedRelatedNote(null);
      setRelatedNotesTarget(target);
      setIsRelatedNotesModalOpen(true);
      await loadRelatedNotes(target);
    },
    [loadRelatedNotes],
  );

  const closeRelatedNotes = useCallback(() => {
    setIsRelatedNotesModalOpen(false);
    setRelatedNotesTarget(null);
    setRelatedNotes([]);
    setSelectedRelatedNote(null);
  }, []);

  const deleteNote = useCallback(
    (note: INote | null, afterDelete?: () => Promise<void> | void) => {
      if (!note) return;
      if (!can("delete:note")) {
        message.error("You do not have permission to delete notes");
        return;
      }

      modal.confirm({
        title: "Delete Note",
        content: "Are you sure you want to delete this note?",
        okText: "Delete",
        okType: "danger",
        onOk: async () => {
          const success = await notesActions.deleteNote(note.id);
          if (!success) return;

          message.success("Note deleted successfully");
          await onRefresh();
          await Promise.resolve(afterDelete?.());
        },
      });
    },
    [can, notesActions, message, modal, onRefresh],
  );

  const handleCreateWorkspaceNote = useCallback(
    async (values: any, opportunityId: string) => {
      if (editingWorkspaceNote) {
        const success = await notesActions.updateNote(editingWorkspaceNote.id, {
          content: values.content,
        });
        if (!success) return;

        message.success("Note updated successfully");
        setEditingWorkspaceNote(null);
        setIsWorkspaceNoteFormOpen(false);
        workspaceNoteForm.resetFields();
        await onRefresh();
      } else {
        const success = await notesActions.createNote({
          content: values.content,
          relatedToType: RelatedToType.Opportunity,
          relatedToId: opportunityId,
        });
        if (!success) return;

        message.success("Note created successfully");
        setIsWorkspaceNoteFormOpen(false);
        workspaceNoteForm.resetFields();
        await onRefresh();
      }
    },
    [notesActions, message, onRefresh, workspaceNoteForm, editingWorkspaceNote],
  );

  const handleCreateRelatedNote = useCallback(
    async (values: any) => {
      if (!relatedNotesTarget) return;

      if (editingRelatedNote) {
        const success = await notesActions.updateNote(editingRelatedNote.id, {
          content: values.content,
        });
        if (!success) return;

        message.success("Note updated successfully");
        setEditingRelatedNote(null);
        setIsRelatedNoteFormOpen(false);
        relatedNoteForm.resetFields();
        await onRefresh();
        await loadRelatedNotes(relatedNotesTarget);
      } else {
        const success = await notesActions.createNote({
          content: values.content,
          relatedToType: relatedNotesTarget.relatedToType,
          relatedToId: relatedNotesTarget.relatedToId,
        });
        if (!success) return;

        message.success("Note created successfully");
        setIsRelatedNoteFormOpen(false);
        relatedNoteForm.resetFields();
        await onRefresh();
        await loadRelatedNotes(relatedNotesTarget);
      }
    },
    [notesActions, message, onRefresh, relatedNotesTarget, relatedNoteForm, loadRelatedNotes, editingRelatedNote],
  );

  const openWorkspaceNoteForm = useCallback(() => {
    setEditingWorkspaceNote(null);
    workspaceNoteForm.resetFields();
    setIsWorkspaceNoteFormOpen(true);
  }, [workspaceNoteForm]);

  const editWorkspaceNote = useCallback(
    (note: INote) => {
      setEditingWorkspaceNote(note);
      workspaceNoteForm.setFieldsValue({ content: note.content });
      setIsWorkspaceNoteFormOpen(true);
    },
    [workspaceNoteForm],
  );

  const closeWorkspaceNoteForm = useCallback(() => {
    setIsWorkspaceNoteFormOpen(false);
    setEditingWorkspaceNote(null);
    workspaceNoteForm.resetFields();
  }, [workspaceNoteForm]);

  const openRelatedNoteForm = useCallback(() => {
    setEditingRelatedNote(null);
    relatedNoteForm.resetFields();
    setIsRelatedNoteFormOpen(true);
  }, [relatedNoteForm]);

  const closeRelatedNoteForm = useCallback(() => {
    setIsRelatedNoteFormOpen(false);
    setEditingRelatedNote(null);
    relatedNoteForm.resetFields();
  }, [relatedNoteForm]);

  return {
    selectedNote,
    setSelectedNote,
    isRelatedNotesModalOpen,
    relatedNotesTarget,
    relatedNotes,
    isRelatedNotesLoading,
    selectedRelatedNote,
    setSelectedRelatedNote,
    isWorkspaceNoteFormOpen,
    workspaceNoteForm,
    editingWorkspaceNote,
    isRelatedNoteFormOpen,
    relatedNoteForm,
    editingRelatedNote,
    openRelatedNotes,
    closeRelatedNotes,
    deleteNote,
    handleCreateWorkspaceNote,
    handleCreateRelatedNote,
    openWorkspaceNoteForm,
    editWorkspaceNote,
    closeWorkspaceNoteForm,
    openRelatedNoteForm,
    closeRelatedNoteForm,
  };
};
