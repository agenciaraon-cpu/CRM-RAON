import { MessageSquare, Video, FolderOpen, Calendar as CalendarIcon, Hash } from 'lucide-react';

export default function Workspace() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace de Equipe</h2>
          <p className="text-slate-500 dark:text-slate-400">Comunicação, arquivos e calendário compartilhado.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20">
            <Video className="h-4 w-4" />
            Nova Reunião
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar chats */}
        <div className="w-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden hidden lg:flex">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Canais</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1.5 rounded bg-raon-blue/10 text-raon-blue font-medium flex items-center text-sm">
                <Hash className="h-3 w-3 mr-2" /> geral
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center text-sm">
                <Hash className="h-3 w-3 mr-2" /> marketing
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center text-sm">
                <Hash className="h-3 w-3 mr-2" /> design
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
             <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Mensagens Diretas</h3>
             <div className="space-y-2">
               {['Ana Costa', 'Roberto Lima', 'João Silva'].map(name => (
                 <div key={name} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-1.5 rounded">
                   <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold">
                     {name.charAt(0)}
                   </div>
                   <span className="text-sm text-slate-700 dark:text-slate-300">{name}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center font-semibold text-slate-900 dark:text-white">
              <Hash className="h-4 w-4 mr-2 text-slate-400" />
              geral
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <FolderOpen className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <CalendarIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
            <div className="text-center text-xs text-slate-400 my-4">Hoje</div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-raon-blue flex items-center justify-center text-white font-bold">CA</div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">Carlos Admin</span>
                  <span className="text-xs text-slate-400">10:45 AM</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg rounded-tl-none inline-block border border-slate-100 dark:border-slate-700/50">
                  Bom dia equipe! A proposta da Consultoria JC foi aprovada. Podemos iniciar o planejamento amanhã mesmo.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">AC</div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">Ana Costa</span>
                  <span className="text-xs text-slate-400">10:48 AM</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg rounded-tl-none inline-block border border-slate-100 dark:border-slate-700/50">
                  Excelente notícia! Já vou separar o material base deles nas pastas do Drive interno.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enviar mensagem em #geral..." 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue text-sm dark:text-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-raon-blue text-white rounded-md">
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
