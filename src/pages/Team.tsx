import { useState } from 'react';
import { Settings, CheckCircle2, Search, Plus, Star, X, Trash } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Team() {
  const { team = [], addTeamMember, removeTeamMember } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    addTeamMember({
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      tasks: 0,
      completed: 0,
      perf: 0,
      avatar: initials
    });
    setIsModalOpen(false);
    setFormData({ name: '', role: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestão de Equipe</h2>
          <p className="text-slate-500 dark:text-slate-400">Controle de colaboradores, produtividade e alocação.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-raon-blue hover:bg-raon-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-raon-blue/20"
        >
          <Plus className="h-5 w-5" />
          Novo Colaborador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map((member) => (
          <div key={member.id} className="relative bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <button 
              onClick={() => removeTeamMember(member.id)}
              className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash className="h-4 w-4" />
            </button>
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
        {team.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500">
            Nenhum colaborador cadastrado.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Novo Colaborador</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Ex: Ana Silva" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Função</label>
                <input 
                  type="text" 
                  name="role" 
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Ex: Gestor de Tráfego" 
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
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
