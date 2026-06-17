import { CalendarDays, Megaphone, Flag, Plus, MoreHorizontal } from 'lucide-react';

const mockCampaigns = [
  { id: 1, platform: 'Google Ads', client: 'Tech Nova S.A.', status: 'Ativo', budget: 'R$ 2.500/mês', spent: 'R$ 1.200', roas: '4.5x' },
  { id: 2, platform: 'Meta Ads', client: 'Studio Beauty', status: 'Pausado', budget: 'R$ 1.000/mês', spent: 'R$ 1.000', roas: '2.1x' },
  { id: 3, platform: 'SEO / Conteúdo', client: 'Engenharia RS', status: 'Ativo', budget: 'R$ 1.500/mês', spent: '-', roas: '-' },
];

export default function Marketing() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestão de Marketing</h2>
          <p className="text-slate-500 dark:text-slate-400">Controle de campanhas de Ads, tráfego e calendário editorial.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            <CalendarDays className="h-4 w-4" />
            Calendário Editorial
          </button>
          <button className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20">
            <Plus className="h-5 w-5" />
            Nova Campanha
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Investido (Mês)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">R$ 12.450</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-raon-blue rounded-full flex items-center justify-center">
            <Megaphone className="h-6 w-6" />
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">ROAS Médio</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3.2x</p>
          </div>
          <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center">
            <Flag className="h-6 w-6" />
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Campanhas Ativas</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">18</p>
          </div>
          <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 text-raon-orange rounded-full flex items-center justify-center">
            <CalendarDays className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Status de Campanhas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Plataforma</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Orçamento</th>
                <th className="px-6 py-4 font-medium">Gasto no Mês</th>
                <th className="px-6 py-4 font-medium">ROAS</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {mockCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{camp.platform}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{camp.client}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{camp.budget}</td>
                  <td className="px-6 py-4 font-medium">{camp.spent}</td>
                  <td className="px-6 py-4 text-emerald-500 font-bold">{camp.roas}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${camp.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
