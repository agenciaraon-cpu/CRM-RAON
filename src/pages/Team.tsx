import { Settings, CheckCircle2, Search, Plus, Star } from 'lucide-react';

const mockTeam = [
  { id: 1, name: 'João Silva', role: 'Desenvolvedor Fullstack', tasks: 12, completed: 45, perf: 98, avatar: 'JS' },
  { id: 2, name: 'Ana Costa', role: 'Gestora de Tráfego', tasks: 8, completed: 32, perf: 95, avatar: 'AC' },
  { id: 3, name: 'Roberto Lima', role: 'Designer Gráfico', tasks: 15, completed: 56, perf: 92, avatar: 'RL' },
  { id: 4, name: 'Carlos Admin', role: 'CEO / Comercial', tasks: 5, completed: 20, perf: 100, avatar: 'CA' },
];

export default function Team() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestão de Equipe</h2>
          <p className="text-slate-500 dark:text-slate-400">Controle de colaboradores, produtividade e alocação.</p>
        </div>
        <button className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20">
          <Plus className="h-5 w-5" />
          Novo Colaborador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockTeam.map((member) => (
          <div key={member.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center text-xl font-bold mb-3 border-2 border-transparent group-hover:border-raon-blue transition-colors">
              {member.avatar}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">{member.name}</h3>
            <p className="text-xs text-raon-blue font-medium mb-4">{member.role}</p>
            
            <div className="w-full flex justify-between px-2 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 pt-3">
              <div className="flex flex-col items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{member.completed}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{member.tasks}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{member.perf}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
