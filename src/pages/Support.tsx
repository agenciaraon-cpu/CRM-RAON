import React, { useState } from 'react';
import { Search, Filter, MessageSquare, AlertCircle, Clock, CheckCircle2, MoreVertical, Plus, Trash } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case 'Urgente': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
    case 'Alta': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
    case 'Média': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'Aberto': return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'Andamento': return <Clock className="h-4 w-4 text-raon-blue" />;
    case 'Aguardando Cliente': return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'Resolvido': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    default: return <AlertCircle className="h-4 w-4 text-slate-500" />;
  }
};

import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function Support() {
  const { tickets = [], addTicket, removeTicket, clients } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<number | string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    priority: 'Média',
    date: '',
    agent: ''
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = (e: any) => {
    e.preventDefault();
    const newId = tickets.length + 1;
    const newTicket = {
      id: newId,
      numero: String(newId).padStart(2, '0'),
      title: formData.title,
      client: formData.client,
      status: 'Aberto',
      priority: formData.priority,
      date: formData.date || new Date().toISOString().split('T')[0],
      agent: formData.agent
    };
    addTicket(newTicket);
    setIsModalOpen(false);
    setFormData({ title: '', client: '', priority: 'Média', date: '', agent: '' });
  };

  const registeredClients = clients.map(c => c.name);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Atendimento & Chamados</h2>
          <p className="text-slate-500 dark:text-slate-400">Gerencie todos os chamados, dúvidas e alterações dos clientes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20"
        >
          <Plus className="h-5 w-5" />
          Novo Chamado
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total de Chamados</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-red-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Abertos / Urgentes</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-raon-blue">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Em Andamento</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Resolvidos no Mês</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, título ou ID..." 
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
                <th className="px-6 py-4 font-medium">Chamado</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Prioridade</th>
                <th className="px-6 py-4 font-medium">Última Atualização</th>
                <th className="px-6 py-4 font-medium">Responsável</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{ticket.title}</p>
                    <p className="text-xs text-slate-500 mt-1">ID: #{ticket.numero || ticket.id.toString().padStart(4, '0')}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{ticket.client}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <span className="text-slate-700 dark:text-slate-300">{ticket.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{ticket.date.split('-').reverse().join('/')}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{ticket.agent}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setTicketToDelete(ticket.id)}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Novo Chamado</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <AlertCircle className="h-5 w-5 opacity-0" /> {/* Keeping spacing */}
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título do Chamado</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Ex: Alteração no banner" 
                />
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
                  {registeredClients.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prioridade</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data (Atualização)</label>
                  <input 
                    type="date" 
                    name="date" 
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Responsável</label>
                <input 
                  type="text" 
                  name="agent" 
                  required
                  value={formData.agent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Nome do responsável" 
                />
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
                  Criar Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!ticketToDelete}
        onCancel={() => setTicketToDelete(null)}
        onConfirm={() => {
          if (ticketToDelete !== null) removeTicket(ticketToDelete as any);
          setTicketToDelete(null);
        }}
        message="Tem certeza que quer excluir este ticket de suporte?"
      />
    </div>
  );
}
