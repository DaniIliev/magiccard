"use client";

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Sparkles, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              MagicCard AI
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <div className="flex items-center gap-2 pl-4 border-l">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Button variant="outline" size="icon" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all">
                    Sign up free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
