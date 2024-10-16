import { FC, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useProfile } from "context/ProfileContext";
import { renameDocument, deleteDocument } from "services/http/documents";

import Modal from "@components/ui/Modal";
import InputModal from "@components/modals/Input";
import IconLabel from "@components/common/IconLabel";

import MoveDocument from "./Move";
import DeleteItem from "@components/modals/Delete";

import { Document } from "types/user";

const documentSchema = z.object({
  name: z.string().min(3, "Document name is required"),
});

type documentFormData = z.infer<typeof documentSchema>;

interface DocumentActionsProps {
  document: Document;
  onClose: () => void;
}

const DocumentActions: FC<DocumentActionsProps> = ({ document, onClose }) => {
  const { profile } = useProfile();

  const [action, setAction] = useState<"rename" | "move" | "delete" | null>(
    null,
  );

  const { control, handleSubmit } = useForm<documentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: document.name,
    },
  });

  const handleDelete = useCallback(async () => {
    if (!profile) return;
    await deleteDocument(profile.id, document.id);

    onClose();
  }, [document.id, profile, onClose]);

  const handleRename = useCallback(() => {
    if (!profile) return;
    handleSubmit(async data => {
      await renameDocument(profile?.id, document.id, data);

      onClose();
    })();
  }, [handleSubmit, document.id, profile, onClose]);

  return (
    <Modal onClose={onClose}>
      {action === null && (
        <>
          <IconLabel
            icon="Pencil"
            label="Rename"
            onPress={() => setAction("rename")}
          />
          <IconLabel
            icon="FileInput"
            label="Move"
            onPress={() => setAction("move")}
          />
          <IconLabel
            icon="Trash"
            label="Delete"
            onPress={() => setAction("delete")}
            color="red"
          />
        </>
      )}
      {action === "rename" && (
        <InputModal
          title="Rename"
          label="New name"
          placeholder={document.name}
          control={control}
          inputName="name"
          onClose={onClose}
          onSave={handleRename}
          withHeader="save"
        />
      )}
      {action === "move" && (
        <MoveDocument document={document} onClose={onClose} />
      )}
      {action === "delete" && (
        <DeleteItem
          item={document}
          label={`Are you sure you want to delete this ${document.type.toLowerCase()}?`}
          onClose={onClose}
          onDelete={handleDelete}
        />
      )}
    </Modal>
  );
};

export default DocumentActions;
