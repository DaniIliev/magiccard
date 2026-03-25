"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Eye, ArrowLeft, Loader2, Share } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopBarProps {
  cardId: string;
  initialTitle: string;
}

export default function TopBar({ cardId, initialTitle }: TopBarProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  
  const { elements, background, audioUrl, globalEffect } = useEditorStore();

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      await api.put(`/cards/${cardId}`, {
        title,
        elements,
        background,
        audioUrl,
        globalEffect,
        ...(publish ? { isPublished: true } : {})
      });
      if (publish) {
        alert("Card published successfully!");
      }
    } catch (error) {
      console.error("Failed to save", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="h-4 w-px bg-slate-200" />
        <Input 
          className="h-8 max-w-[200px] border-transparent hover:border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-500 font-medium"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Card Title"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
          {saving && <><Loader2 className="h-3 w-3 animate-spin"/> Saving...</>}
        </span>
        <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={saving} className="bg-white">
          <Save className="h-4 w-4 mr-2" /> Save Draft
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.open(`/view/${cardId}`, '_blank')} className="bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50">
          <Eye className="h-4 w-4 mr-2" /> Preview
        </Button>
        <Button size="sm" onClick={() => handleSave(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
          <Share className="h-4 w-4 mr-2" /> Publish
        </Button>
      </div>
    </div>
  );
}
