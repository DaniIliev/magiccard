"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, X, Sparkles, Send, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useEditorStore } from "@/store/editorStore";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! I am the Magic AI Assistant. How can I help you design your card today?' }
  ]);
  const { loadCard, elements, background, audioUrl, globalEffect } = useEditorStore();

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setPrompt("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post('/ai/generate', { prompt: userMsg });
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'I have woven the magic and updated your canvas!' 
      }]);
      
      loadCard({
        elements: [...elements, ...data.elements],
        background: data.background || background,
        audioUrl: data.audioUrl || audioUrl,
        globalEffect: data.globalEffect || globalEffect,
      });
      
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, my magic failed this time. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-2xl shadow-indigo-500/30 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all text-white z-50 flex items-center gap-2"
      >
        <Sparkles className="h-5 w-5" />
        <span className="font-semibold text-base py-1">Magic Co-pilot</span>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-2xl border-0 ring-1 ring-slate-200/50 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 font-semibold">
          <Bot className="h-5 w-5" /> AI Co-pilot
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-white/20 hover:text-white rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px] min-h-[300px] bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' : 'bg-white border text-slate-800 rounded-tl-none shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-sm text-slate-500 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> Weaving magic...
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
        <Input 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder="Make it romantic..." 
          className="flex-1 border-slate-200 focus-visible:ring-indigo-500 rounded-full"
          disabled={loading}
        />
        <Button type="submit" size="icon" className="rounded-full bg-indigo-600 hover:bg-indigo-700 shrink-0" disabled={loading || !prompt.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
