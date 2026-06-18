import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-16 flex flex-shrink-0 items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 sticky top-0">
      <div className="flex items-center flex-1">
        <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex ml-4 max-w-md w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-raon-blue focus:border-raon-blue sm:text-sm transition-colors"
            placeholder="Buscar clientes, leads ou projetos..."
            type="search"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Alternar Tema"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-raon-orange ring-2 ring-white dark:ring-slate-900" />
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
