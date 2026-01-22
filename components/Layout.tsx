
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold italic">S</div>
            <h1 className="text-xl font-bold tracking-tight text-white">SparkGen</h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-slate-400">
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">Generador</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">Acerca de</span>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} SparkGen AI. Preparado para Vercel.</p>
      </footer>
    </div>
  );
};
