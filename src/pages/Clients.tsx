import { Building2, Search, Filter, MoreVertical, Plus, X } from 'lucide-react';
import { useState } from 'react';

const initialClients = [
  { id: 1, name: 'Tech Nova S.A.', plan: 'Plano Enterprise', status: 'Ativo', owner: 'Carlos Admin', value: 'R$ 5.000', dueDate: '15/06/2026' },
  { id: 2, name: 'Studio Beauty', plan: 'Gestão de Mídias', status: 'Em implantação', owner: 'Ana Marketing', value: 'R$ 2.500', dueDate: '20/06/2026' },
  { id: 3, name: 'Engenharia RS', plan: 'Tráfego Pago + SEO', status: 'Ativo', owner: 'Roberto Sales', value: 'R$ 15.000', dueDate: '10/06/2026' },
  { id: 4, name: 'Consultoria JC', plan: 'Consultoria Estratégica', status: 'Pausado', owner: 'Carlos Admin', value: 'R$ 8.000', dueDate: '05/06/2026' },
  { id: 5, name: 'Mercado Local', plan: 'Site Institucional', status: 'Cancelado', owner: 'João Dev', value: 'R$ 1.500', dueDate: '01/06/2026' },
];

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Ativo': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
    case 'Em implantação': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    case 'Pausado': 
    case 'Inadimplente': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
    case 'Cancelado': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
}

export default function Clients() {
  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    plan: 'Prata',
    status: 'Ativo',
    owner: '',
    value: '',
    dueDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();

    let formattedDate = formData.dueDate;
    if (formData.dueDate) {
      const [year, month, day] = formData.dueDate.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    const newClient = {
      id: Date.now(),
      name: formData.name,
      plan: formData.plan,
      status: formData.status,
      owner: formData.owner,
      value: `R$ ${formData.value}`, // Format string simplistically
      dueDate: formattedDate || '--/--/----',
    };
    
    setClients([newClient, ...clients]);
    setIsModalOpen(false);
    setFormData({ name: '', plan: 'Prata', status: 'Ativo', owner: '', value: '', dueDate: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Clientes Cadastrados</h2>
          <p className="text-slate-500 dark:text-slate-400">Gerencie todos os clientes, planos e status de contratos da agência.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20"
        >
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, plano ou responsável..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:ring-1 focus:ring-raon-blue focus:outline-none dark:text-white placeholder-slate-400"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Plano Contratado</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Responsável</th>
                <th className="px-6 py-4 font-medium">Mensalidade</th>
                <th className="px-6 py-4 font-medium">Vencimento</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{client.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{client.plan}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{client.owner}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{client.value}</td>
                  <td className="px-6 py-4 text-slate-500">{client.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500">
          <span>{`Mostrando ${clients.length > 5 ? 5 : clients.length} de ${clients.length} clientes`}</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-50 text-slate-700 dark:text-slate-300" disabled>Anterior</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300">Próxima</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Novo Cliente</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente (Nome)</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Nome do cliente ou empresa" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plano Contratado</label>
                  <select 
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Prata">Prata</option>
                    <option value="Ouro">Ouro</option>
                  </select>
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
                    <option value="Pausado">Pausado</option>
                    <option value="Inadimplente">Inadimplente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Responsável</label>
                <input 
                  type="text" 
                  name="owner" 
                  required
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Nome do responsável" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mensalidade</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                    <input 
                      type="text" 
                      name="value" 
                      required
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                      placeholder="0,00" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vencimento</label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    required
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  />
                </div>
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
