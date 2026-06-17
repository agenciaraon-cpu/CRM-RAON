import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Briefcase, 
  Headset, 
  Megaphone, 
  Workflow, 
  Bot, 
  Search, 
  TrendingUp, 
  Users2, 
  Laptop,
  Target
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'CRM Kanban', to: '/crm', icon: Target },
  { name: 'Clientes', to: '/clients', icon: Users },
  { name: 'Financeiro', to: '/finance', icon: Wallet },
  { name: 'Projetos', to: '/projects', icon: Briefcase },
  { name: 'Atendimento', to: '/support', icon: Headset },
  { name: 'Marketing', to: '/marketing', icon: Megaphone },
  { name: 'Automação', to: '/automation', icon: Workflow },
  { name: 'RAON IA', to: '/ia', icon: Bot },
  { name: 'Google & SEO', to: '/google', icon: Search },
  { name: 'Executivo', to: '/executive', icon: TrendingUp },
  { name: 'Equipe', to: '/team', icon: Users2 },
  { name: 'Workspace', to: '/workspace', icon: Laptop },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-raon-dark text-white shadow-xl flex-shrink-0 relative z-20">
      <div className="flex items-center justify-center h-20 border-b border-white/10 px-6">
        <div className="flex flex-col items-center justify-center">
          <img src="/raon.png" alt="RAON CRM" className="max-h-12 w-auto object-contain" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-raon-blue text-white shadow-md"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon className={cn("mr-3 flex-shrink-0 h-5 w-5", "group-hover:text-raon-orange transition-colors")} />
            {item.name}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-raon-orange flex items-center justify-center font-bold text-sm">
              R
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Raon Agência</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
