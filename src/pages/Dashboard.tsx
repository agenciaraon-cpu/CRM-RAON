import {
  Users, Target, DollarSign, ArrowUpRight, ArrowDownRight, Briefcase, FileCheck, AlertCircle, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { name: 'Jan', total: 45000 },
  { name: 'Fev', total: 52000 },
  { name: 'Mar', total: 61000 },
  { name: 'Abr', total: 59000 },
  { name: 'Mai', total: 72000 },
  { name: 'Jun', total: 85000 },
];

const leadsSource = [
  { name: 'Instagram', value: 40 },
  { name: 'Google Ads', value: 35 },
  { name: 'Indicação', value: 15 },
  { name: 'Orgânico', value: 10 },
];
const COLORS = ['#FF6B00', '#0066FF', '#0033CC', '#64748b'];

const stats = [
  { name: 'Faturamento', value: 'R$ 85.000', change: '+12%', trend: 'up', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
  { name: 'Lucro Líquido', value: 'R$ 42.500', change: '+8%', trend: 'up', icon: ArrowUpRight, color: 'text-raon-blue', bg: 'bg-blue-100 dark:bg-blue-500/20' },
  { name: 'Clientes Ativos', value: '124', change: '+15', trend: 'up', icon: Users, color: 'text-raon-orange', bg: 'bg-orange-100 dark:bg-orange-500/20' },
  { name: 'Leads Ativos', value: '45', change: '-2', trend: 'down', icon: Target, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-500/20' },
  { name: 'Gastos', value: 'R$ 42.500', change: '+2%', trend: 'up', icon: ArrowDownRight, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-500/20' },
  { name: 'Propostas Enviadas', value: '28', change: '+5', trend: 'up', icon: FileCheck, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
  { name: 'Projetos Ativos', value: '18', change: '0', trend: 'neutral', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/20' },
  { name: 'Tarefas Pendentes', value: '32', change: '-5', trend: 'up', icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/20' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Principal</h2>
        <p className="text-slate-500 dark:text-slate-400">Bem-vindo de volta. Aqui está o resumo da Raon Agência hoje.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="glass rounded-xl p-5 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{item.name}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{item.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${item.trend === 'up' ? 'text-emerald-500' : item.trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
                {item.change}
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-2">vs. mês anterior</span>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ${item.trend === 'up' ? 'bg-emerald-500' : item.trend === 'down' ? 'bg-red-500' : 'bg-slate-500'}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 lg:col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Evolução do Faturamento</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis tickFormatter={(val) => `R$${val/1000}k`} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
                />
                <Area type="monotone" dataKey="total" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" activeDot={{ r: 6, fill: '#FF6B00', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Origem dos Leads</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadsSource}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadsSource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {leadsSource.map((item, index) => (
              <div key={item.name} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                <span className="ml-auto font-semibold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Avisos e Atrasos</h3>
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-r-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Projeto "Site e-commerce" atrasado</p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">Prazo era 15/Jun. Responsável: João.</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">3 Faturas a Vencer Hoje</p>
                <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">Total acumulado: R$ 8.500,00.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-raon-blue" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Novo contrato fechado</p>
                  <p className="text-xs text-slate-500">Cliente {i} assinou plano Ouro.</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">Há {i*2}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
