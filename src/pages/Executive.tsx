import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';

export default function Executive() {
  const { clients, transactions } = useAppContext();
  
  const totalReceitas = transactions.filter(t => t.tipo === 'receita').reduce((a, c) => a + c.valor, 0);
  const arr = totalReceitas * 12;
  const ativos = clients.filter(c => c.status === 'Ativo').length;
  const ticketMedio = ativos > 0 ? totalReceitas / ativos : 0;
  
  const growthData = [
    { name: 'Atual', value: totalReceitas }
  ];

  const COLORS = ['#FF6B00', '#0066FF', '#0033CC'];
  let pieData = [
    { name: 'Nenhum dado', value: 1 }
  ];
  
  if (totalReceitas > 0) {
    pieData = [
      { name: 'Mensalidades', value: 60 },
      { name: 'Serviços', value: 30 },
      { name: 'Consultorias', value: 10 },
    ];
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Executivo</h2>
          <p className="text-slate-500 dark:text-slate-400">Visão estratégica macro da agência.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-raon-blue rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded flex items-center">
              +15% <ArrowUpRight className="h-3 w-3 ml-1" />
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Receita Anualizada (ARR)</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            R$ {arr >= 1000 ? `${(arr / 1000).toFixed(1)}k` : arr.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 text-raon-orange rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded flex items-center">
              --
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Ticket Médio (MRR)</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            R$ {ticketMedio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded flex items-center">
              --
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Taxa de Conversão</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">0%</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-300 mb-1">LTV (Life Time Value)</p>
          <p className="text-3xl font-bold text-white">R$ 0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Crescimento de Receita Total</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0033CC" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0033CC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis tickFormatter={(val) => `R$${val/1000}k`} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0033CC" strokeWidth={4} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Composição da Receita</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
