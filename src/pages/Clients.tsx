import { Building2, Search, Filter, MoreVertical, Plus, X, Trash, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { useAppContext, verificarStatusCliente, formatProximoVencimento, getCompetenciaAtual } from '../context/AppContext';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const getStatusColor = (status: string) => {
  const normStatus = status.toLowerCase();
  switch(normStatus) {
    case 'ativo': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
    case 'em implantação': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    case 'pausado': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
    case 'inadimplente': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
    case 'a vencer': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
    case 'cancelado': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
}

export default function Clients() {
  const { clients, addClient, updateClient, removeClient } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    plan: 'Prata',
    status: 'Ativo',
    owner: '',
    value: '',
    dueDate: '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = (e: any) => {
    e.preventDefault();

    let formattedDate = formData.dueDate;
    let diaVencimento = 1;
    if (formData.dueDate) {
      const [year, month, day] = formData.dueDate.split('-');
      formattedDate = `${day}/${month}/${year}`;
      diaVencimento = parseInt(day, 10);
    }

    const finalValue = parseFloat(formData.value.replace(',', '.')) || 0;

    const newClient = {
      id: Date.now(),
      name: formData.name,
      plan: formData.plan,
      status: formData.status,
      owner: formData.owner,
      value: finalValue,
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      dia_vencimento: diaVencimento,
      pagamentoConfirmado: formData.status.toLowerCase() === 'ativo', // Base it initially on user choice
    };
    
    addClient(newClient);
    setIsModalOpen(false);
    setFormData({ name: '', plan: 'Prata', status: 'Ativo', owner: '', value: '', dueDate: '' });
  };

  const handleConfirmarPagamento = (client: any) => {
    updateClient(client.id, {
      ultimaCompetenciaPaga: getCompetenciaAtual(),
      pagamentoConfirmado: true
    });
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusColor(verificarStatusCliente(client))}`}>
                      {verificarStatusCliente(client)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{client.owner}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    R$ {client.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatProximoVencimento(client)}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {verificarStatusCliente(client) !== 'ATIVO' && (
                      <button 
                        onClick={() => handleConfirmarPagamento(client)}
                        className="text-emerald-500 hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Confirmar Pagamento Deste Mês"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setClientToDelete(client.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash className="h-5 w-5" />
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

      <ConfirmDeleteModal
        isOpen={!!clientToDelete}
        onCancel={() => setClientToDelete(null)}
        onConfirm={() => {
          if (clientToDelete) removeClient(clientToDelete);
          setClientToDelete(null);
        }}
        message="Tem certeza que quer excluir esse cliente?"
      />
    </div>
  );
}
