"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function CreateNotePage() {
  const router = useRouter();
  const { authFetch } = useAuth();
  
  const [mode, setMode] = useState<"blank" | "upload">("blank");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("plain");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Always use FormData (It handles both text and files)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("back_type", category);

      // 2. Only append file if we are in upload mode AND file exists
      if (mode === "upload" && file) {
        formData.delete("back_type");
        formData.append("back_type", "image");

        if (title.trim() === "") {
          const inferredTitle = file.name.replace(/\.[^/.]+$/, "");
          formData.delete("title");
          formData.set("title", inferredTitle);
        }

        formData.append("file", file);
      } else if (mode === "upload" && !file) {
        throw new Error("Please select a PDF file.");
      } else if (mode === "blank" && !title.trim()) {
        throw new Error("Please enter a title.");
      }

      // 3. Single API Call
      const res = await authFetch("/notes", {
        method: "POST",
        body: formData, 
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create note");
      }

      const data = await res.json();
      router.push(`/notes/${data.id}`);
    
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[var(--bg-main)] relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/20 blur-[120px]" />

      <Card className="w-full max-w-md space-y-6 bg-card/80 backdrop-blur-md border-border p-8 shadow-xl">
        
        {/* Header & Toggle */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-text-main">
            {mode === "upload" ? "Upload Document" : "New Notebook"}
          </h1>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/50 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("blank")}
              className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                mode === "blank" 
                  ? "bg-card text-primary shadow-sm" 
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              <FileText size={16} /> Create Blank
            </button>
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                mode === "upload" 
                  ? "bg-card text-primary shadow-sm" 
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              <Upload size={16} /> Upload PDF
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title Input (Shared) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-muted">Title</label>
            <Input
              type="text"
              placeholder={mode === "upload" ? "e.g. Lecture 1 Slides (Optional)" : "e.g. Machine Learning Notes"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-secondary/30"
            />
          </div>

          {/* Upload Specific Input */}
          {mode === "upload" && (
            <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
              <label className="text-sm font-medium text-text-muted">PDF File</label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full cursor-pointer rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm text-text-main file:mr-4 file:rounded-full file:border-0 file:bg-main/10 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-primary hover:file:bg-main/20"
                />
              </div>
            </div>
          )}

          {/* Blank Specific Input (Category) */}
          {mode === "blank" && (
            <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                <label className="text-sm font-medium text-text-muted">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40 [&>option]:bg-slate-900 [&>option]:text-white">
                    <option value="plain">Plain</option>
                    <option value="ruled">Ruled</option>
                    <option value="grid">Grid</option>
                </select>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Submit Button */}
          <Button 
            className="w-full py-6 text-base font-semibold shadow-lg shadow-primary/20" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
            ) : (
              mode === "upload" ? "Upload & Create" : "Create Notebook"
            )}
          </Button>

        </form>
      </Card>
    </div>
  );
};