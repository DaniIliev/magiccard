import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Wand2, Gift } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 flex flex-col items-center text-center px-4 bg-gradient-to-b from-slate-50 to-indigo-50/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4" />
          <span>The new way to send greetings</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-slate-900 leading-tight">
          Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Magical</span> Digital Greetings with AI
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          From birthdays to weddings, build stunning interactive cards with music, animations, and a touch of AI magic. No design skills needed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 rounded-full transition-all hover:scale-105">
              Start Creating Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#templates">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-300 hover:bg-slate-100 transition-all">
              View Templates
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="w-full py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Everything you need to craft the perfect message</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Wand2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AI Co-pilot</h3>
              <p className="text-slate-600">Stuck on what to write? Our AI assistant generates touching wishes and designs layouts instantly.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Interactive FX</h3>
              <p className="text-slate-600">Add falling snow, bursting confetti, and autoplaying music to make your greetings come alive.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <div className="h-16 w-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Gift className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Share Anywhere</h3>
              <p className="text-slate-600">Send a unique interactive link via WhatsApp, Messenger, or email. Recipients open it instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
