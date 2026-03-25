"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Link as LinkIcon, Trash2, Image as ImageIcon } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

interface MagicCard {
  _id: string;
  title: string;
  isPublished: boolean;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchCards();
    }
  }, [user, authLoading, router]);

  const fetchCards = async () => {
    try {
      const { data } = await api.get("/cards");
      setCards(data);
    } catch (error) {
      console.error("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const createCardFromTemplate = async (templateData: any) => {
    try {
      const { data } = await api.post("/cards", templateData);
      router.push(`/editor/${data._id}`);
    } catch (error) {
      console.error("Failed to create card");
    }
  };

  const deleteCard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    try {
      await api.delete(`/cards/${id}`);
      setCards(cards.filter(c => c._id !== id));
    } catch (error) {
      console.error("Failed to delete card");
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  if (authLoading || loading) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Workspace</h1>
          <p className="text-slate-500 mt-1">Manage and create your interactive cards</p>
        </div>
        <Button onClick={() => setTemplateModalOpen(true)} size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
          <Plus className="mr-2 h-5 w-5" /> New Card
        </Button>
      </div>

      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-5 flex justify-between items-center border-b bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-800">Choose a Starting Template</h2>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200" onClick={() => setTemplateModalOpen(false)}>✕</Button>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-100/50">
              {TEMPLATES.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => createCardFromTemplate(t.cardData)}
                  className={`bg-gradient-to-br ${t.color} p-6 rounded-2xl cursor-pointer hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-64 flex flex-col justify-between`}
                >
                  <div className="text-6xl drop-shadow-md">{t.icon}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1 drop-shadow-sm">{t.name}</h3>
                    <p className="text-sm opacity-90 leading-tight">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 flex flex-col items-center text-center">
          <div className="h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-300">
            <ImageIcon className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No cards yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm">
            Create your very first interactive digital greeting card in just a few minutes.
          </p>
          <Button onClick={() => setTemplateModalOpen(true)} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md">
            Create your first card
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Card key={card._id} className="overflow-hidden hover:shadow-lg transition-all group border-slate-200">
              <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                {card.isPublished ? (
                  <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Published
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-semibold">
                    Draft
                  </span>
                )}
                <ImageIcon className="h-10 w-10 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <CardContent className="pt-5 pb-3">
                <CardTitle className="truncate font-semibold text-lg">{card.title}</CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Updated {new Date(card.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-between border-t border-slate-100 bg-slate-50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-600 hover:text-indigo-600 px-2"
                  onClick={() => router.push(`/editor/${card._id}`)}
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
                {card.isPublished && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-600 hover:text-indigo-600 px-2"
                    onClick={() => copyLink(card._id)}
                  >
                    <LinkIcon className="h-4 w-4 mr-1" /> Link
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
                  onClick={() => deleteCard(card._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
