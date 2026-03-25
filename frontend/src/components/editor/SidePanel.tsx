"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Type, Image as ImageIcon, Sparkles, Palette, Wand2, Music } from "lucide-react";
import api from "@/lib/api";

export default function SidePanel({ className }: { className?: string }) {
  const { addElement, setBackground, selectedElementId, elements, updateElement, globalEffect, setGlobalEffect, audioUrl, setAudio } = useEditorStore();
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
  const [textInput, setTextInput] = useState("Add a heading");
  const [uploading, setUploading] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const handleAddText = () => {
    addElement({
      type: 'text',
      content: textInput,
      x: 100,
      y: 100,
      style: { fontSize: '24px', color: '#000000', fontWeight: 'bold' }
    });
  };

  const handleAddSticker = (emoji: string) => {
    addElement({
      type: 'sticker',
      content: emoji,
      x: 150,
      y: 150,
      style: { fontSize: '64px' }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      addElement({
        type: 'image',
        content: data.url,
        x: 50,
        y: 50,
        width: 200
      });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAudio(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAudio(data.url);
    } catch (error) {
      console.error("Audio upload failed", error);
    } finally {
      setUploadingAudio(false);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white shadow-lg ${className}`}>
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg text-slate-800">Design Tools</h2>
      </div>

      <Tabs defaultValue="add" className="w-full flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 w-full rounded-none h-14 bg-slate-50 border-b">
          <TabsTrigger value="add" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"><Type className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"><ImageIcon className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="stickers" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"><Sparkles className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="bg" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"><Palette className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"><Wand2 className="h-5 w-5" /></TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="add" className="space-y-4 m-0">
            <div className="space-y-2">
              <Label>Add Text</Label>
              <Input value={textInput} onChange={(e) => setTextInput(e.target.value)} />
              <Button onClick={handleAddText} className="w-full bg-indigo-600 hover:bg-indigo-700">Add to Canvas</Button>
            </div>

            {selectedElement && selectedElement.type === 'text' && (
              <div className="pt-6 border-t mt-6 space-y-4 animate-in slide-in-from-bottom-2">
                <Label>Edit Selected Text</Label>
                <textarea 
                  className="w-full border p-2 rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                  value={selectedElement.content}
                  onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Color</Label>
                    <Input 
                      type="color" 
                      value={selectedElement.style?.color as string || "#000000"} 
                      onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, color: e.target.value }})}
                      className="h-10 p-1 w-full shrink-0 rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Size</Label>
                    <Input 
                      type="number" 
                      value={parseInt(selectedElement.style?.fontSize as string) || 24} 
                      onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontSize: `${e.target.value}px` }})}
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="space-y-4 m-0">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden">
                <Input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10" />
                <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500 font-medium z-0">
                  {uploading ? "Uploading..." : "Click to upload image"}
                </span>
              </div>
            </div>
            
            {selectedElement && selectedElement.type === 'image' && (
              <div className="pt-6 border-t mt-6 space-y-4 animate-in slide-in-from-bottom-2">
                <Label>Image Controls</Label>
                <div className="space-y-1">
                  <Label className="text-xs">Width (px)</Label>
                  <Input 
                    type="number" 
                    value={selectedElement.width || 200} 
                    onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stickers" className="space-y-4 m-0">
            <div className="grid grid-cols-3 gap-2">
              {['🎉', '🎂', '🥳', '❤️', '🎈', '✨', '🎁', '🌹', '🥂', '🍾', '💍', '🕊️'].map((emoji) => (
                <button 
                  key={emoji}
                  onClick={() => handleAddSticker(emoji)}
                  className="h-16 bg-slate-50 border border-slate-200 rounded-xl text-3xl hover:bg-slate-100 hover:border-slate-300 hover:scale-105 transition-all flex items-center justify-center shadow-sm"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bg" className="space-y-6 m-0">
            <div className="space-y-3">
              <Label>Solid Colors</Label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  '#ffffff', '#f8fafc', '#f1f5f9', '#ffe4e6', '#fecdd3', 
                  '#dbeafe', '#bfdbfe', '#e0e7ff', '#c7d2fe', '#fef3c7',
                  '#ffedd5', '#dcfce7', '#f3e8ff', '#fae8ff', '#0f172a'
                ].map(color => (
                  <button 
                    key={color} 
                    onClick={() => setBackground(color)}
                    className="w-full pt-[100%] rounded-md shadow-sm border border-slate-200 hover:scale-110 transition-transform"
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Gradients</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'linear-gradient(to right, #ff7e5f, #feb47b)',
                  'linear-gradient(to right, #6a11cb, #2575fc)',
                  'linear-gradient(to right, #ffb199, #ff0844)',
                  'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',
                  'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
                  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
                ].map((grad, i) => (
                  <button 
                    key={i} 
                    onClick={() => setBackground(grad)}
                    className="w-full h-16 rounded-md shadow-sm border border-slate-200 hover:scale-105 transition-transform"
                    style={{ background: grad }}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6 m-0">
            <div className="space-y-3">
              <Label>Global Effects</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'confetti', label: '🎉 Confetti' },
                  { id: 'fireworks', label: '🎆 Fireworks' },
                  { id: 'snow', label: '❄️ Snow' }
                ].map(effect => (
                  <Button 
                    key={effect.id}
                    variant={globalEffect === effect.id ? "default" : "outline"}
                    onClick={() => setGlobalEffect(effect.id === 'none' ? null : effect.id)}
                    className="w-full"
                  >
                    {effect.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-6 border-t">
              <Label>Background Audio</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden">
                <Input type="file" accept="audio/*" onChange={handleAudioUpload} className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10" />
                <Music className="h-6 w-6 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500 font-medium z-0 text-center">
                  {uploadingAudio ? "Uploading..." : "Upload Audio (MP3/WAV)"}
                </span>
              </div>
              {audioUrl && (
                <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between shadow-sm">
                  <span className="text-xs text-indigo-700 font-medium truncate shrink-0">🎵 Audio attached</span>
                  <Button variant="ghost" size="sm" onClick={() => setAudio(null)} className="h-6 text-red-500 hover:text-red-600 hover:bg-red-50 px-2 ml-2">Remove</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
