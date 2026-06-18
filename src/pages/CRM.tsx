import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Phone, Mail, Building2, MapPin, Trash, Check, ThumbsUp, ThumbsDown, DollarSign, Briefcase, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function CRM() {
  const { crmData: data, setCrmData: setData, removeLead } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProposalModalOpen, setIsEditProposalModalOpen] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    telefone: '',
    email: '',
    estado: '',
    cidade: '',
    origem: '',
    temperatura: 'Frio',
    interesse: '',
    valor_potencial: '',
    probabilidade: '',
    proxima_acao: '',
    data_proximo_contato: '',
    observacoes: ''
  });

  const [proposalData, setProposalData] = useState({
    plan: '',
    value: '',
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId as keyof typeof data.columns];
    const finishColumn = data.columns[destination.droppableId as keyof typeof data.columns];

    if (startColumn === finishColumn) {
      const newLeadIds = Array.from(startColumn.leadIds);
      newLeadIds.splice(source.index, 1);
      newLeadIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, leadIds: newLeadIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    const startLeadIds = Array.from(startColumn.leadIds);
    startLeadIds.splice(source.index, 1);
    const newStartColumn = { ...startColumn, leadIds: startLeadIds };

    const finishLeadIds = Array.from(finishColumn.leadIds);
    finishLeadIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = { ...finishColumn, leadIds: finishLeadIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    });
  };

  const handleAddLead = (e: any) => {
    e.preventDefault();
    const newLeadId = `lead-${Date.now()}`;
    const newLead = {
      id: newLeadId,
      name: formData.nome,
      company: formData.empresa,
      phone: formData.telefone,
      email: formData.email,
      estado: formData.estado,
      cidade: formData.cidade,
      cityState: `${formData.cidade} - ${formData.estado}`,
      origem: formData.origem,
      temperatura: formData.temperatura,
      service: formData.interesse,
      interesse: formData.interesse,
      valor_potencial: formData.valor_potencial,
      probabilidade: formData.probabilidade,
      proxima_acao: formData.proxima_acao,
      data_proximo_contato: formData.data_proximo_contato,
      observacoes: formData.observacoes,
      created_at: new Date().toISOString(),
      tags: [formData.interesse, formData.temperatura].filter(Boolean),
      value: formData.valor_potencial || "A definir",
      plan: "A definir"
    };

    const firstColumnId = data.columnOrder[0];
    const firstColumn = data.columns[firstColumnId];

    setData({
      ...data,
      leads: {
        ...data.leads,
        [newLeadId]: newLead
      },
      columns: {
        ...data.columns,
        [firstColumnId]: {
          ...firstColumn,
          leadIds: [newLeadId, ...firstColumn.leadIds]
        }
      }
    });

    setIsModalOpen(false);
    setFormData({ nome: '', empresa: '', telefone: '', email: '', estado: '', cidade: '', origem: '', temperatura: 'Frio', interesse: '', valor_potencial: '', probabilidade: '', proxima_acao: '', data_proximo_contato: '', observacoes: '' });
  };

  const handleUpdateProposal = (e: any) => {
    e.preventDefault();
    if (!activeLeadId) return;

    setData({
      ...data,
      leads: {
        ...data.leads,
        [activeLeadId]: {
          ...data.leads[activeLeadId],
          plan: proposalData.plan,
          value: proposalData.value
        }
      }
    });

    setIsEditProposalModalOpen(false);
    setProposalData({ plan: '', value: '' });
    setActiveLeadId(null);
  };

  const moveLead = (leadId: string, currentColId: string, targetColId: string) => {
    const startColumn = data.columns[currentColId];
    const finishColumn = data.columns[targetColId];

    const startLeadIds = startColumn.leadIds.filter((id: string) => id !== leadId);
    const finishLeadIds = [leadId, ...finishColumn.leadIds];

    setData({
      ...data,
      columns: {
        ...data.columns,
        [startColumn.id]: { ...startColumn, leadIds: startLeadIds },
        [finishColumn.id]: { ...finishColumn, leadIds: finishLeadIds }
      }
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">CRM RAON</h2>
          <p className="text-slate-500 dark:text-slate-400">Novo contato, proposta, e negociação em tempo real.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20"
        >
          <Plus className="h-5 w-5" />
          Novo Lead
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full items-start">
            {data.columnOrder.map((colId: string) => {
              const column = data.columns[colId];
              const leads = column.leadIds.map((leadId: string) => data.leads[leadId]);

              return (
                <div key={column.id} className="flex flex-col w-80 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex-shrink-0 max-h-full border border-slate-200 dark:border-slate-700/50">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-t-xl">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      {column.title}
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
                        {leads.length}
                      </span>
                    </h3>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar min-h-[150px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-slate-200/50 dark:bg-slate-800/80' : ''
                        }`}
                      >
                        {leads.map((lead: any, index: number) => {
                          const isContatoRealizado = colId === "col-2";
                          
                          return (
                            // @ts-ignore
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white dark:bg-slate-900 border ${isContatoRealizado ? 'border-yellow-400 dark:border-yellow-500 shadow-yellow-400/20 shadow-md' : 'border-slate-200 dark:border-slate-700'} p-4 rounded-lg shadow-sm hover:shadow-md transition-all group ${
                                    snapshot.isDragging ? 'shadow-xl ring-2 ring-raon-blue rotate-2' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2 group/lead">
                                    <h4 className="font-semibold text-slate-900 dark:text-white leading-tight flex flex-col">
                                      <span className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-slate-400" />
                                        {lead.company || lead.name}
                                      </span>
                                      <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-6">
                                        {lead.name}
                                      </span>
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => removeLead(lead.id, column.id)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover/lead:opacity-100 transition-opacity"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center text-xs text-slate-500">
                                      <Phone className="h-3 w-3 mr-2 text-slate-400" />
                                      {lead.phone || 'Sem número'}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500">
                                      <Mail className="h-3 w-3 mr-2 text-slate-400" />
                                      <span className="truncate">{lead.email || 'Sem email'}</span>
                                    </div>
                                    {lead.cityState && (
                                      <div className="flex items-center text-xs text-slate-500">
                                        <MapPin className="h-3 w-3 mr-2 text-slate-400" />
                                        <span className="truncate">{lead.cityState}</span>
                                      </div>
                                    )}
                                  </div>

                                  {(colId === 'col-3' || colId === 'col-4' || colId === 'col-5') && (
                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                      {colId === 'col-4' && (
                                        <div className="flex items-center justify-between text-xs mb-2">
                                          <span className="text-slate-500">Status:</span>
                                          <select className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-700 dark:text-slate-300">
                                            <option>Em andamento</option>
                                            <option>Encerrada</option>
                                          </select>
                                        </div>
                                      )}
                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
                                          <Briefcase className="h-3 w-3 mr-1" /> Plano: {lead.plan || 'N/A'}
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                                          <DollarSign className="h-3 w-3 mr-1" /> Valor: {lead.value || 'N/A'}
                                        </div>
                                        <button 
                                          onClick={() => {
                                            setActiveLeadId(lead.id);
                                            setProposalData({ plan: lead.plan || '', value: lead.value || '' });
                                            setIsEditProposalModalOpen(true);
                                          }}
                                          className="text-raon-blue hover:underline"
                                        >
                                          Editar
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Actions based on column */}
                                  <div className="mt-4 pt-2">
                                    {colId === "col-1" && (
                                      <button 
                                        onClick={() => moveLead(lead.id, colId, "col-2")}
                                        className="w-full flex items-center justify-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20 py-1.5 px-3 rounded text-xs font-semibold transition-colors border border-amber-200 dark:border-amber-500/30"
                                      >
                                        <Check className="h-3 w-3" /> OK - Contato Realizado
                                      </button>
                                    )}

                                    {colId === "col-4" && (
                                      <div className="flex gap-2">
                                        <button 
                                          onClick={() => moveLead(lead.id, colId, "col-5")}
                                          className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 py-1.5 px-2 rounded text-xs font-bold transition-colors border border-emerald-200 dark:border-emerald-500/30"
                                          title="Positivo (Fechado)"
                                        >
                                          <ThumbsUp className="h-3 w-3" /> Positivo
                                        </button>
                                        <button 
                                          onClick={() => moveLead(lead.id, colId, "col-6")}
                                          className="flex-1 flex items-center justify-center gap-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 py-1.5 px-2 rounded text-xs font-bold transition-colors border border-rose-200 dark:border-rose-500/30"
                                          title="Negativo (Perdido)"
                                        >
                                          <ThumbsDown className="h-3 w-3" /> Negativo
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Novo Contato / Lead</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Pessoa *</label>
                  <input required type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: João Silva" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Empresa</label>
                  <input type="text" value={formData.empresa} onChange={(e) => setFormData({...formData, empresa: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: Empresa Tech" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone / WhatsApp *</label>
                  <input required type="text" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                  <input type="text" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: SP" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
                  <input type="text" value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: São Paulo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Origem</label>
                  <input type="text" value={formData.origem} onChange={(e) => setFormData({...formData, origem: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: Instagram, Indicação..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Temperatura</label>
                  <select value={formData.temperatura} onChange={(e) => setFormData({...formData, temperatura: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue">
                    <option value="Frio">Frio</option>
                    <option value="Morno">Morno</option>
                    <option value="Quente">Quente</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interesse / Serviço</label>
                  <input type="text" value={formData.interesse} onChange={(e) => setFormData({...formData, interesse: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: Tráfego Pago" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor Potencial (R$)</label>
                  <input type="number" step="0.01" value={formData.valor_potencial} onChange={(e) => setFormData({...formData, valor_potencial: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Probabilidade (%)</label>
                  <input type="number" value={formData.probabilidade} onChange={(e) => setFormData({...formData, probabilidade: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: 50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Próxima Ação</label>
                  <input type="text" value={formData.proxima_acao} onChange={(e) => setFormData({...formData, proxima_acao: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: Ligar amanhã" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data do Próximo Contato</label>
                  <input type="date" value={formData.data_proximo_contato} onChange={(e) => setFormData({...formData, data_proximo_contato: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações</label>
                  <textarea rows={3} value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Detalhes adicionais..."></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-raon-blue hover:bg-raon-dark rounded-lg transition-colors shadow-lg shadow-raon-blue/20">
                  Adicionar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Proposal Modal */}
      {isEditProposalModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Editar Proposta</h3>
              <button 
                onClick={() => setIsEditProposalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProposal} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Qual o Plano?</label>
                <input required type="text" value={proposalData.plan} onChange={(e) => setProposalData({...proposalData, plan: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: Starter, Pro..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Qual o Valor?</label>
                <input required type="text" value={proposalData.value} onChange={(e) => setProposalData({...proposalData, value: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-raon-blue" placeholder="Ex: R$ 1.500,00" />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsEditProposalModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-raon-blue hover:bg-raon-dark rounded-lg transition-colors shadow-lg shadow-raon-blue/20">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
