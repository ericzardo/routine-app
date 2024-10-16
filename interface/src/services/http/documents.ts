import { z } from "zod";
import Toast from "react-native-toast-message";

import api from "services/api";
import queryClient from "services/queryClient";

import handleError from "./handleError";

import { Document } from "types/user";

const UUIDSchema = z.string().uuid();
const nameSchema = z
  .string()
  .min(3, "Document name must be at least 3 characters")
  .max(24, { message: "Document name must have a maximum of 24 characters" });

const renameDocumentSchema = z.object({
  name: nameSchema,
});
const addFolderSchema = z.object({
  name: nameSchema,
  path: z.array(
    z
      .object({
        id: z.string().uuid(),
        name: z.string(),
        type: z.string(),
        modified: z.string(),
      })
      .optional(),
  ),
});

const moveDocumentSchema = z.object({
  profileId: z.string().uuid(),
  parentId: z.string().uuid().nullable(),
});

type UUID = z.infer<typeof UUIDSchema>;
type RenameDocumentData = z.infer<typeof renameDocumentSchema>;
type AddFolderData = z.infer<typeof addFolderSchema>;
type moveDocumentData = z.infer<typeof moveDocumentSchema>;

export const deleteDocument = async (profileId: UUID, documentId: UUID) => {
  try {
    UUIDSchema.parse(profileId);
    UUIDSchema.parse(documentId);

    const response = await api.delete<{ document: Document; message: string }>(
      `/${profileId}/documents/${documentId}`,
    );

    if (!response.data?.document) {
      throw new Error("Failed deleting document");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Document deleted successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const renameDocument = async (
  profileId: UUID,
  documentId: UUID,
  data: RenameDocumentData,
) => {
  try {
    UUIDSchema.parse(profileId);
    UUIDSchema.parse(documentId);
    renameDocumentSchema.parse(data);

    const response = await api.patch<{ document: Document; message: string }>(
      `/${profileId}/documents/${documentId}/rename`,
      data,
    );

    if (!response.data?.document) {
      throw new Error("Failed renaming document");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Document renamed successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const addFolder = async (profileId: UUID, data: AddFolderData) => {
  try {
    UUIDSchema.parse(profileId);
    addFolderSchema.parse(data);

    const response = await api.post<{ folder: Document; message: string }>(
      `${profileId}/documents/create`,
      data,
    );

    if (!response.data?.folder) {
      throw new Error("Failed creating folder");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Folder created successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};

export const moveDocument = async (
  documentId: UUID,
  data: moveDocumentData,
) => {
  try {
    UUIDSchema.parse(documentId);
    moveDocumentSchema.parse(data);

    const response = await api.post<{ document: Document; message: string }>(
      `/documents/${documentId}/move`,
      data,
    );

    if (!response.data?.document) {
      throw new Error("Failed moving document");
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });

    Toast.show({
      type: "success",
      text1: response.data?.message || "Document moved successfully!",
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: handleError(error) || "Something went wrong!",
    });
  }
};
