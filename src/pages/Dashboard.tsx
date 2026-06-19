import {
  Users, Target, DollarSign, ArrowUpRight, ArrowDownRight, Briefcase, FileCheck, AlertCircle, CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { useAppContext, verificarStatusCliente, getProximoVencimentoData } from '../context/AppContext';

const COLORS = ['#FF6B00', '#0066FF', '#0033CC', '#64748b'];

export default function Dashboard() {
  const { clients, transactions, crmData, projectData } = useAppContext();

  const totalReceitas = transactions.filter(t => t.tipo === 'receita').reduce((a, c) => a + c.valor, 0);
  const totalDespesas = transactions.filter(t => t.tipo === 'despesa').reduce((a, c) => a + c.valor, 0);
  const lucro = totalReceitas - totalDespesas;
  
  const ativos = clients.filter(c => verificarStatusCliente(c).toLowerCase() === 'ativo').length;
  
  const leadsTotais = Object.keys(crmData.leads).length;
  const propostas = crmData.columns['col-3']?.leadIds?.length || 0;
  const projetosTotais = Object.keys(projectData.projects).length;

  const dashboardFinance = {
    receberHoje: 0,
    proximos7Dias: 0,
    proximos30Dias: 0,
    inadimplentes: 0,
    faturamentoMensal: 0
  };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  clients.forEach(cliente => {
    const valor = cliente.value || 0;
    
    if (cliente.status?.toLowerCase() !== 'cancelado') {
      dashboardFinance.faturamentoMensal += valor;
    }

    const status = verificarStatusCliente(cliente);
    
    if (status === "INADIMPLENTE") {
      dashboardFinance.inadimplentes += valor;
    } else {
      const vencimento = getProximoVencimentoData(cliente);
      if (vencimento) {
        vencimento.setHours(0,0,0,0);
        let diffTime = vencimento.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          dashboardFinance.receberHoje += valor;
        }
        if (diffDays >= 0 && diffDays <= 7) {
          dashboardFinance.proximos7Dias += valor;
        }
        if (diffDays >= 0 && diffDays <= 30) {
          dashboardFinance.proximos30Dias += valor;
        }
      }
    }
  });

  const stats = [
    { name: 'Faturamento', value: `R$ ${totalReceitas.toLocaleString('pt-BR')}`, change: '', trend: 'neutral', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
    { name: 'Lucro Líquido', value: `R$ ${lucro.toLocaleString('pt-BR')}`, change: '', trend: 'neutral', icon: ArrowUpRight, color: 'text-raon-blue', bg: 'bg-blue-100 dark:bg-blue-500/20' },
    { name: 'Clientes Ativos', value: ativos.toString(), change: '', trend: 'neutral', icon: Users, color: 'text-raon-orange', bg: 'bg-orange-100 dark:bg-orange-500/20' },
    { name: 'Leads Ativos', value: leadsTotais.toString(), change: '', trend: 'neutral', icon: Target, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-500/20' },
    { name: 'Gastos', value: `R$ ${totalDespesas.toLocaleString('pt-BR')}`, change: '', trend: 'neutral', icon: ArrowDownRight, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-500/20' },
    { name: 'Propostas Enviadas', value: propostas.toString(), change: '', trend: 'neutral', icon: FileCheck, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    { name: 'Projetos Ativos', value: projetosTotais.toString(), change: '', trend: 'neutral', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/20' },
    { name: 'Tarefas Pendentes', value: '0', change: '', trend: 'neutral', icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/20' },
  ];

  const revenueData = [
    { name: 'Atual', total: totalReceitas }
  ];

  const hasLeads = Object.keys(crmData.leads).length > 0;
  
  let leadsSource = [
    { name: 'Sem dados', value: 1 }
  ];

  if (hasLeads) {
    const originCounts: Record<string, number> = {};
    Object.values(crmData.leads).forEach((lead: any) => {
      const origin = lead.origem || 'Outros';
      originCounts[origin] = (originCounts[origin] || 0) + 1;
    });
    
    leadsSource = Object.entries(originCounts).map(([name, value]) => ({
      name,
      value
    }));
  }

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
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Previsão Financeira</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full pb-8">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">A Receber Hoje</p>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">R$ {dashboardFinance.receberHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Próximos 7 Dias</p>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">R$ {dashboardFinance.proximos7Dias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Próximos 30 Dias</p>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">R$ {dashboardFinance.proximos30Dias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
             </div>
             <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-100 dark:border-red-500/20 flex flex-col justify-center">
               <p className="text-sm text-red-500 dark:text-red-400 mb-1">Inadimplentes</p>
               <p className="text-2xl font-bold text-red-600 dark:text-red-400">R$ {dashboardFinance.inadimplentes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
             </div>
             <div className="md:col-span-2 bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-between mt-2">
               <div>
                 <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Faturamento Mensal Previsto</p>
               </div>
               <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">R$ {dashboardFinance.faturamentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
             </div>
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
                <RechartsTooltip 
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
            {transactions.some(t => t.status === 'Pendente') ? (
              <div className="flex items-start p-3 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-lg">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Existem Faturas Pendentes</p>
                  <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">Verifique o módulo de financeiro.</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Nenhum aviso no momento.</p>
            )}
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {clients.slice(0, 3).map((client, i) => (
              <div key={client.id} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-raon-blue" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Novo cliente fechado</p>
                  <p className="text-xs text-slate-500">{client.name} - {client.plan}</p>
                </div>
              </div>
            ))}
            {clients.length === 0 && (
              <p className="text-sm text-slate-500">Nenhuma atividade recente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
