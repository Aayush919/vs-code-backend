import mongoose from "mongoose";

export interface IFile extends mongoose.Document {
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  content?: string;
  isExpanded?: boolean;
  created: string;
  modified: string;
}

const fileSchema = new mongoose.Schema<IFile>({
  name: { type: String, required: true },
  type: { type: String, enum: ["file", "folder"], required: true },
  parentId: { type: String, default: null },
  content: { type: String },
  isExpanded: { type: Boolean },
  created: { type: String, default: () => new Date().toISOString() },
  modified: { type: String, default: () => new Date().toISOString() },
});

export const FileModel = mongoose.model<IFile>("File", fileSchema);
