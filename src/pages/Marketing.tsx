import { useState } from 'react';
import { CalendarDays, Megaphone, Flag, Plus, MoreHorizontal, X, Trash } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Marketing() {
  const { campaigns = [], addCampaign, removeCampaign, clients } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'Google',
    client: '',
    budget: '',
    status: 'Ativo'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const finalValue = parseFloat(formData.budget.replace(',', '.')) || 0;
    
    addCampaign({
      id: Date.now(),
      platform: formData.platform,
      client: formData.client,
      budget: `R$ ${finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      spent: 'R$ 0,00',
      roas: '-',
      status: formData.status
    });
    setIsModalOpen(false);
    setFormData({ platform: 'Google', client: '', budget: '', status: 'Ativo' });
  };
  
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20"
          >
            <Plus className="h-5 w-5" />
            Nova Campanha
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Investido (Mês)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">R$ 0</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-raon-blue rounded-full flex items-center justify-center">
            <Megaphone className="h-6 w-6" />
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">ROAS Médio</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0x</p>
          </div>
          <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center">
            <Flag className="h-6 w-6" />
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Campanhas Ativas</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{campaigns.filter(c => c.status === 'Ativo').length}</p>
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
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{camp.platform}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{camp.client}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{camp.budget}</td>
                  <td className="px-6 py-4 font-medium">{camp.spent}</td>
                  <td className="px-6 py-4 text-emerald-500 font-bold">{camp.roas}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      camp.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
                      camp.status === 'Pendente' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => removeCampaign(camp.id)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Nova Campanha</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCampaign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plataforma</label>
                <select 
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white"
                >
                  <option value="Google">Google</option>
                  <option value="Meta">Meta</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente</label>
                <select 
                  name="client"
                  required
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Orçamento Mensal (R$)</label>
                <input 
                  type="text" 
                  name="budget" 
                  required
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Ex: 1500,00" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-raon-blue rounded-lg hover:bg-raon-dark shadow-sm"
                >
                  Criar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
