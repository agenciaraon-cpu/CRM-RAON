import { Workflow, Play, Settings, Plus, ArrowRight } from 'lucide-react';

const automations = [
  { id: 1, name: 'Onboarding de Novo Cliente', trigger: 'Quando contrato assinado', action: 'Criar projeto + Enviar boas vindas', status: 'Ativo' },
  { id: 2, name: 'Cobrança Automática', trigger: '3 dias antes do vencimento', action: 'Enviar WhatsApp de aviso', status: 'Ativo' },
  { id: 3, name: 'Novo Lead Site', trigger: 'Formulário preenchido', action: 'Criar lead na coluna "Novo" + Notificar equipe', status: 'Ativo' },
  { id: 4, name: 'Reativação', trigger: 'Lead sem contato há 15 dias', action: 'Enviar email de reativação', status: 'Pausado' },
];

export default function Automation() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Automações</h2>
          <p className="text-slate-500 dark:text-slate-400">Diminua o trabalho manual automatizando tarefas e comunicações.</p>
        </div>
        <button className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20">
          <Plus className="h-5 w-5" />
          Criar Fluxo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {automations.map((auto) => (
          <div key={auto.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-raon-blue">
                  <Workflow className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white leading-tight">{auto.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${auto.status === 'Ativo' ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {auto.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <Play className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-sm flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-[50px] text-xs mt-0.5">SE</span>
                <p>{auto.trigger}</p>
              </div>
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-raon-blue min-w-[50px] text-xs mt-0.5">ENTÃO</span>
                <p>{auto.action}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end">
              <button className="text-sm font-medium text-raon-blue hover:text-raon-dark flex items-center gap-1 group-hover:underline">
                Editar Fluxo
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
