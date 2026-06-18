import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Phone, Mail, Building2, MapPin, Trash } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function CRM() {
  const { crmData: data, setCrmData: setData, removeLead } = useAppContext();

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

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">CRM RAON</h2>
          <p className="text-slate-500 dark:text-slate-400">Acompanhe e gerencie seus leads em tempo real.</p>
        </div>
        <button className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20">
          <Plus className="h-5 w-5" />
          Novo Lead
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full items-start">
            {data.columnOrder.map((colId) => {
              const column = data.columns[colId as keyof typeof data.columns];
              const leads = column.leadIds.map((leadId) => data.leads[leadId as keyof typeof data.leads]);

              return (
                <div key={column.id} className="flex flex-col w-80 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex-shrink-0 max-h-full border border-slate-200 dark:border-slate-700/50">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-t-xl">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      {column.title}
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
                        {leads.length}
                      </span>
                    </h3>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
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
                        {leads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow group ${
                                  snapshot.isDragging ? 'shadow-xl ring-2 ring-raon-blue rotate-2' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2 group/lead">
                                  <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">{lead.company}</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-raon-orange bg-orange-100 dark:bg-orange-500/10 px-2 py-1 rounded-md">
                                      {lead.value}
                                    </span>
                                    <button 
                                      onClick={() => removeLead(lead.id, column.id)}
                                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover/lead:opacity-100 transition-opacity"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  {lead.name}
                                </div>
                                
                                <div className="space-y-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                  <div className="flex items-center text-xs text-slate-500">
                                    <Phone className="h-3 w-3 mr-2 text-slate-400" />
                                    {lead.phone}
                                  </div>
                                  <div className="flex items-center text-xs text-slate-500">
                                    <Mail className="h-3 w-3 mr-2 text-slate-400" />
                                    <span className="truncate">{lead.email}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex gap-1">
                                  {lead.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
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
    </div>
  );
}
