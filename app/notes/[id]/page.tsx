"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface Page {
  id: number;
  page_number: number;
  background_type: string;
  background_url: string | null;
}

interface Note {
  id: number;
  title: string;
  pages: Page[];
}

export default function NoteViewerPage() {
  const { id } = useParams(); // Get ID from URL
  const { authFetch } = useAuth();
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await authFetch(`/notes/${id}`);
        if (!res.ok) throw new Error("Failed to load note");
        const data = await res.json();
        setNote(data);
      } catch (err) {
        setError("Note not found or unauthorized");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetchNote();
  }, [id, authFetch]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-500 text-center p-10">{error}</div>;
  if (!note) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold">{note.title}</h1>
      
      {/* Render Pages */}
      <div className="space-y-8 w-full max-w-4xl">
        {note.pages.map((page) => (
          <div key={page.id} className="relative w-full aspect-[1/1.41] bg-white shadow-lg rounded-lg overflow-hidden border">
            
            {/* Page Number */}
            <span className="absolute bottom-2 right-4 text-gray-400 text-sm">
              Page {page.page_number}
            </span>

            {/* Background Image (If PDF) */}
            {page.background_type === "image" && page.background_url && (
              // Note: We use the backend URL + the static path
              <img 
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${page.background_url}`} 
                alt={`Page ${page.page_number}`}
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            )}
            
            {/* Blank Styles */}
            {page.background_type === "ruled" && (
              <div className="w-full h-full" style={{ backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "100% 2rem" }} />
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}