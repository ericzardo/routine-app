import { useState, useCallback, FC, Fragment } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useProfile } from "context/ProfileContext";
import { addFolder } from "services/http/documents";

import Modal from "@components/ui/Modal";
import IconLabel from "@components/common/IconLabel";

import { Document } from "types/user";
import InputModal from "@components/modals/Input";

const addDocumentSchema = z.object({
  name: z
    .string()
    .min(3, "Document name must be at least 3 characters")
    .max(24, { message: "Document name must have a maximum of 24 characters" }),
});

type addDocumentFormData = z.infer<typeof addDocumentSchema>;

interface AddDocumentProps {
  onClose: () => void;
  path: Document[];
}

const AddDocument: FC<AddDocumentProps> = ({ onClose, path }) => {
  const { profile } = useProfile();

  const { control, handleSubmit } = useForm<addDocumentFormData>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: {
      name: "",
    },
  });

  const [isAddFolderModalOpen, setAddFolderModalOpen] =
    useState<boolean>(false);
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOepn] =
    useState<boolean>(false);

  const handleAddFolderModal = useCallback(() => {
    setAddFolderModalOpen(prev => !prev);
  }, []);

  const handleUploadDocumentModal = useCallback(() => {
    setIsUploadDocumentModalOepn(prev => !prev);
  }, []);

  const handleAddFolder = useCallback(() => {
    if (!profile) return;

    handleSubmit(async data => {
      await addFolder(profile.id, { ...data, path });

      onClose();
    })();
  }, [onClose, handleSubmit, profile, path]);

  const handleUpload = useCallback(() => {
    console.log("After user select files and docs>>> \n");
    const data = {
      path,
      documents: [],
    };
    console.log(JSON.stringify(data));
  }, [path]);

  return (
    <Fragment>
      <Modal onClose={onClose}>
        <IconLabel
          icon="CloudUpload"
          label="Upload documents"
          onPress={handleUploadDocumentModal}
        />
        <IconLabel
          icon="FolderPlus"
          label="Create Folder"
          onPress={handleAddFolderModal}
        />
      </Modal>

      {isAddFolderModalOpen && (
        <InputModal
          title="Add Folder"
          withHeader="save"
          placeholder="Folder Name"
          onSave={handleAddFolder}
          onClose={handleAddFolderModal}
          control={control}
          inputName="name"
        />
      )}

      {isUploadDocumentModalOpen && (
        <Modal onClose={handleUploadDocumentModal}>
          <IconLabel
            icon="Images"
            label="Videos and Photos"
            onPress={handleUpload}
          />
          <IconLabel icon="Ellipsis" label="Search" onPress={handleUpload} />
        </Modal>
      )}
    </Fragment>
  );
};

export default AddDocument;
