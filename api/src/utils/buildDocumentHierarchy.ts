import { Document as PrismaDocument } from "@prisma/client";

type Document = PrismaDocument & { content: Document[] };

const buildDocumentHierarchy = (documents: Document[]) => {
  const map = new Map<string, Document>();
  const root: Document[] = [];

  documents.forEach((doc) => {
    if (doc) {
      map.set(doc.id, { ...doc, content: [] });
    }
  });

  documents.forEach((doc) => {
    if (doc) {
      if (doc.parentId) {
        const parent = map.get(doc.parentId);
        if (parent) {
          const currentDoc = map.get(doc.id);
          if (currentDoc) {
            parent.content.push(currentDoc);
          }
        }
      } else {
        const currentDoc = map.get(doc.id);
        if (currentDoc) {
          root.push(currentDoc);
        }
      }
    }
  });

  return root;
}

export default buildDocumentHierarchy;
