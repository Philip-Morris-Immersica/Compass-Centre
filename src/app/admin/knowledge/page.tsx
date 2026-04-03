"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  listKnowledgeFiles,
  getKnowledgeFile,
  createKnowledgeFile,
  updateKnowledgeFile,
  deleteKnowledgeFile,
} from "../actions";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";

type FileRow = {
  id: string;
  filename: string;
  title: string;
  tags: string;
  sourceType: string;
  createdAt: Date;
  updatedAt: Date;
  contentLength: string;
};

type EditingFile = {
  id?: string;
  filename: string;
  title: string;
  tags: string;
  content: string;
  sourceType: string;
};

export default function KnowledgePage() {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [editing, setEditing] = useState<EditingFile | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const loadFiles = useCallback(() => {
    listKnowledgeFiles().then((rows) => {
      setFiles(
        rows.map((r) => ({
          ...r,
          contentLength: r.contentLength,
        }))
      );
    });
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  function handleNew() {
    setEditing({
      filename: "",
      title: "",
      tags: "[]",
      content: "",
      sourceType: "uploaded",
    });
  }

  function handleEdit(fileId: string) {
    startTransition(async () => {
      const file = await getKnowledgeFile(fileId);
      if (file) {
        setEditing({
          id: file.id,
          filename: file.filename,
          title: file.title,
          tags: file.tags,
          content: file.content,
          sourceType: file.sourceType,
        });
      }
    });
  }

  function handleDelete(fileId: string) {
    if (!confirm("Are you sure you want to delete this knowledge file?")) return;
    startTransition(async () => {
      await deleteKnowledgeFile(fileId);
      loadFiles();
    });
  }

  function handleSave() {
    if (!editing) return;
    startTransition(async () => {
      if (editing.id) {
        await updateKnowledgeFile(editing.id, {
          filename: editing.filename,
          title: editing.title,
          tags: editing.tags,
          content: editing.content,
        });
      } else {
        await createKnowledgeFile({
          filename: editing.filename,
          title: editing.title,
          tags: editing.tags,
          content: editing.content,
          sourceType: editing.sourceType,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setEditing(null);
      loadFiles();
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setEditing({
      filename: file.name.replace(/\.\w+$/, ".md"),
      title: file.name.replace(/\.\w+$/, ""),
      tags: "[]",
      content: text,
      sourceType: "uploaded",
    });
  }

  if (editing) {
    return (
      <div className="p-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {editing.id ? "Edit Knowledge File" : "New Knowledge File"}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={editing.filename}
              onChange={(e) => setEditing({ ...editing, filename: e.target.value })}
              placeholder="e.g. asylum.bg.md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="e.g. Asylum Information Bulgaria"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (JSON array)</Label>
          <Input
            id="tags"
            value={editing.tags}
            onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
            placeholder='["asylum", "refugees", "bulgaria"]'
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            rows={20}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">{editing.content.length} characters</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : editing.id ? "Update File" : "Create File"}
          </Button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {files.length} files stored in database
          </p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            <Upload className="h-4 w-4" />
            Upload File
            <input
              type="file"
              accept=".md,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <Button onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" /> New File
          </Button>
        </div>
      </div>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-mono text-sm">{file.filename}</TableCell>
              <TableCell>{file.title}</TableCell>
              <TableCell>{file.sourceType}</TableCell>
              <TableCell>{(file.contentLength.length / 1024).toFixed(1)} KB</TableCell>
              <TableCell>{new Date(file.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(file.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {files.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No knowledge files yet. Upload or create one to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
