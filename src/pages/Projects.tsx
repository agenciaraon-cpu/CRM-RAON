import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Calendar, Paperclip, MessageSquare, CheckSquare, X, AlertCircle, Trash } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function Projects() {
  const { projectData: data, setProjectData: setData, clients, removeProject } = useAppContext();
  const registeredClients = clients.map(c => c.name).concat('Outro...');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{id: string, colId: string} | null>(null);
  const [formData, setFormData] = useState({
    cliente: registeredClients[0] || 'Outro...',
    customClient: '',
    nomeProjeto: '',
    categoria: '',
    dataCriacao: new Date().toISOString().split('T')[0],
    prazoEntrega: '',
    responsavel: '',
    prioridade: 'media',
    status: 'briefing',
    objetivo: '',
    observacoes: ''
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Urgente': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'Alta': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
      case 'Média': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Baixa': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const isDeadlineApproaching = (dateStr: string) => {
    // Basic logic to check if a deadline is approaching based on the format used.
    // Assuming DD/MMM or YYYY-MM-DD
    if (!dateStr) return false;
    
    let targetDate = new Date();
    if (dateStr.includes('-')) {
       // Format YYYY-MM-DD
       targetDate = new Date(dateStr);
    } else {
       // Simplified logic for "DD/MMM" format in mock data
       // For a real app we would use proper valid dates
       return false;
    }
    
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Approaching if deadline is within 3 days
    return diffDays > 0 && diffDays <= 3;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProject = (e: any) => {
    e.preventDefault();

    const finalClient = formData.cliente === 'Outro...' ? formData.customClient : formData.cliente;

    const newId = `proj-${Date.now()}`;
    const newProject = {
      id: newId,
      name: formData.nomeProjeto,
      client: finalClient,
      date: formData.prazoEntrega || '--/--/----',
      attachments: 0,
      comments: 0,
      tasks: '0/0',
      priority: formData.prioridade === 'baixa' ? 'Baixa' : formData.prioridade === 'media' ? 'Média' : formData.prioridade === 'alta' ? 'Alta' : 'Urgente',
      cliente: finalClient,
      nomeProjeto: formData.nomeProjeto,
      categoria: formData.categoria,
      dataCriacao: formData.dataCriacao,
      prazoEntrega: formData.prazoEntrega,
      responsavel: formData.responsavel,
      prioridade: formData.prioridade,
      status: formData.status,
      objetivo: formData.objetivo,
      observacoes: formData.observacoes,
    };

    const firstColumn = data.columnOrder[0];
    
    setData(prev => ({
       ...prev,
       projects: {
          ...prev.projects,
          [newId]: newProject
       },
       columns: {
          ...prev.columns,
          [firstColumn]: {
             ...prev.columns[firstColumn],
             projectIds: [newId, ...prev.columns[firstColumn].projectIds]
          }
       }
    }));

    setIsModalOpen(false);
    setFormData({
       cliente: registeredClients[0] || 'Outro...',
       customClient: '',
       nomeProjeto: '',
       categoria: '',
       dataCriacao: new Date().toISOString().split('T')[0],
       prazoEntrega: '',
       responsavel: '',
       prioridade: 'media',
       status: 'briefing',
       objetivo: '',
       observacoes: ''
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const startColumn = data.columns[source.droppableId as keyof typeof data.columns];
    const finishColumn = data.columns[destination.droppableId as keyof typeof data.columns];

    if (startColumn === finishColumn) {
      const newProjectIds = Array.from(startColumn.projectIds);
      newProjectIds.splice(source.index, 1);
      newProjectIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...startColumn, projectIds: newProjectIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }
    const startProjectIds = Array.from(startColumn.projectIds);
    startProjectIds.splice(source.index, 1);
    const newStartColumn = { ...startColumn, projectIds: startProjectIds };
    const finishProjectIds = Array.from(finishColumn.projectIds);
    finishProjectIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = { ...finishColumn, projectIds: finishProjectIds };
    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gerenciamento de Projetos</h2>
          <p className="text-slate-500 dark:text-slate-400">Acompanhe a entrega dos serviços e produtos finalizados.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20"
        >
          <Plus className="h-5 w-5" />
          Novo Projeto
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full items-start">
            {data.columnOrder.map((colId) => {
              const column = data.columns[colId as keyof typeof data.columns];
              const projects = column.projectIds.map((id) => data.projects[id as keyof typeof data.projects]);

              return (
                <div key={column.id} className="flex flex-col w-80 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex-shrink-0 max-h-full border border-slate-200 dark:border-slate-700/50">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-t-xl">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                       {column.title}
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
                        {projects.length}
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
                        {projects.map((project, index) => {
                           const approaching = isDeadlineApproaching(project.date);
                           return (
                             // @ts-ignore
                             <Draggable key={project.id} draggableId={project.id} index={index}>
                               {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`relative bg-white dark:bg-slate-900 border ${
                                   approaching ? 'border-amber-400 ring-1 ring-amber-400 shadow-md shadow-amber-400/20' : 'border-slate-200 dark:border-slate-700'
                                } p-4 rounded-lg shadow-sm hover:shadow-md transition-all group ${
                                  snapshot.isDragging ? 'shadow-xl ring-2 ring-raon-blue rotate-2' : ''
                                }`}
                              >
                                {approaching && (
                                   <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 p-1 rounded-full shadow-sm animate-pulse">
                                      <AlertCircle className="h-4 w-4" />
                                   </div>
                                )}
                                <div className="flex justify-between items-start mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(project.priority)}`}>
                                    {project.priority}
                                  </span>
                                  <button 
                                    onClick={() => setProjectToDelete({ id: project.id, colId: column.id })}
                                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-white leading-tight mt-2">{project.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{project.client}</p>
                                
                                <div className={`flex items-center justify-between mt-4 pt-3 border-t ${approaching ? 'border-amber-100 dark:border-amber-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                                  <div className={`flex items-center text-xs ${approaching ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}`}>
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{project.date}</span>
                                  </div>
                                  <div className={`flex gap-2 ${approaching ? 'text-amber-600/70 dark:text-amber-400/70' : 'text-slate-400'}`}>
                                    {project.attachments > 0 && (
                                      <div className="flex items-center text-xs" title="Anexos">
                                        <Paperclip className="h-3 w-3 mr-1" /> {project.attachments}
                                      </div>
                                    )}
                                    <div className="flex items-center text-xs" title="Comentários">
                                      <MessageSquare className="h-3 w-3 mr-1" /> {project.comments}
                                    </div>
                                    <div className="flex items-center text-xs" title="Checklist">
                                      <CheckSquare className="h-3 w-3 mr-1" /> {project.tasks}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )})}
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

      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
               <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Novo Projeto</h3>
                  <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                  <X className="h-5 w-5" />
                  </button>
               </div>
               
               <form onSubmit={handleAddProject} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                    <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente / Instituição</label>
                    <select 
                       name="cliente"
                       value={formData.cliente}
                       onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white"
                    >
                       {registeredClients.map((c) => (
                          <option key={c} value={c}>{c}</option>
                       ))}
                    </select>
                    </div>

                    {formData.cliente === 'Outro...' && (
                       <div className="col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Cliente</label>
                          <input 
                             type="text" 
                             name="customClient" 
                             required={formData.cliente === 'Outro...'}
                             value={formData.customClient}
                             onChange={handleInputChange}
                             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                             placeholder="Digite o nome do cliente" 
                          />
                       </div>
                    )}

                    <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Projeto</label>
                    <input 
                       type="text" 
                       name="nomeProjeto" 
                       required
                       value={formData.nomeProjeto}
                       onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                       placeholder="Ex: Criação de Site Institucional" 
                    />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                      <input type="text" name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" placeholder="Ex: Web, Design, Tráfego" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Responsável</label>
                      <input type="text" name="responsavel" value={formData.responsavel} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" placeholder="Ex: João" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data Criação</label>
                      <input type="date" name="dataCriacao" required value={formData.dataCriacao} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" />
                    </div>

                    <div className="relative group/dl">
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                          Prazo de Entrega
                       </label>
                       <input 
                          type="date" 
                          name="prazoEntrega" 
                          required
                          value={formData.prazoEntrega}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-slate-800 dark:text-white" 
                       />
                       <div className="absolute top-1 right-0 text-[10px] text-amber-600 bg-amber-100 rounded px-1.5 py-0.5 flex items-center gap-1 font-bold">
                          <AlertCircle className="h-3 w-3" />
                          Alerta ativado
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prioridade</label>
                       <select 
                          name="prioridade"
                          value={formData.prioridade}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white"
                       >
                          <option value="baixa">Baixa</option>
                          <option value="media">Média</option>
                          <option value="alta">Alta</option>
                          <option value="urgente">Urgente</option>
                       </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white">
                        <option value="briefing">Briefing</option>
                        <option value="execucao">Em Execução</option>
                        <option value="revisao">Revisão</option>
                        <option value="concluido">Concluído</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Objetivo</label>
                      <textarea name="objetivo" rows={2} value={formData.objetivo} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" placeholder="Objetivo do projeto..." />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações</label>
                      <textarea name="observacoes" rows={2} value={formData.observacoes} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" placeholder="Outras informações..." />
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
                     Criar Projeto
                  </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!projectToDelete}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={() => {
          if (projectToDelete) removeProject(projectToDelete.id, projectToDelete.colId);
          setProjectToDelete(null);
        }}
        message="Tem certeza que quer excluir esse projeto?"
      />
    </div>
  );
}
