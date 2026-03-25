"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEditorStore } from '@/store/editorStore';
import api from '@/lib/api';
import TopBar from '@/components/editor/TopBar';
import SidePanel from '@/components/editor/SidePanel';
import Canvas from '@/components/editor/Canvas';
import AiAssistant from '@/components/editor/AiAssistant';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { loadCard } = useEditorStore();
  
  const [loading, setLoading] = useState(true);
  const [cardTitle, setCardTitle] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && id) {
      fetchCard();
    }
  }, [user, authLoading, id]);

  const fetchCard = async () => {
    try {
      const { data } = await api.get(`/cards/${id}`);
      setCardTitle(data.title);
      loadCard(data);
    } catch (error) {
      console.error("Error loading card", error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden">
      <TopBar cardId={id as string} initialTitle={cardTitle} />
      
      <div className="flex flex-1 overflow-hidden">
        <SidePanel className="w-80 border-r bg-white flex-shrink-0 z-10" />
        
        <div className="flex-1 overflow-auto relative flex items-center justify-center bg-slate-200/50 p-8">
          <Canvas />
        </div>
      </div>
      <AiAssistant />
    </div>
  );
}
