import { Bell, Search, Menu, Moon, Sun, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [user] = useAuthState(auth);

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
        {user ? (
          <button 
            onClick={() => signOut(auth)}
            className="ml-2 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-white border border-red-200 hover:bg-red-500 hover:border-transparent rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        ) : (
          <button 
            onClick={async () => {
              try {
                const provider = new GoogleAuthProvider();
                provider.setCustomParameters({ prompt: 'select_account' });
                await signInWithPopup(auth, provider);
              } catch (err: any) {
                if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
                  alert("Erro ao fazer login com Google: O pop-up foi bloqueado pelo navegador ou pelo ambiente de visualização.\n\nPor favor, abra o aplicativo em uma NOVA GUIA (clicando no botão de seta no canto superior direito do preview) e tente novamente.");
                }
              }
            }}
            className="ml-2 px-3 py-1.5 text-sm font-medium text-white bg-raon-blue hover:bg-raon-dark rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-raon-blue/20"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Entrar com Google</span>
          </button>
        )}
      </div>
    </header>
  );
}
