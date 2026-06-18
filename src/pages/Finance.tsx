import { DollarSign, TrendingUp, TrendingDown, CreditCard, Download, Plus, X, Trash } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Finance() {
  const { transactions, addTransaction, removeTransaction } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    categoria: '',
    data: '',
    valor: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    let formattedDate = formData.data;
    if (formData.data) {
      const [year, month, day] = formData.data.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    const valorNumerico = parseFloat(formData.valor.replace(',', '.'));

    const newTransaction = {
      id: Date.now(),
      descricao: formData.descricao,
      categoria: formData.categoria,
      valor: isNaN(valorNumerico) ? 0 : valorNumerico,
      tipo: formData.tipo as 'receita' | 'despesa',
      data: formattedDate || '--/--/----',
      status: 'Pago',
    };
    
    addTransaction(newTransaction);
    setIsModalOpen(false);
    setFormData({ tipo: 'receita', descricao: '', categoria: '', data: '', valor: '' });
  };

  const totalReceitas = transactions.filter(t => t.tipo === 'receita').reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = transactions.filter(t => t.tipo === 'despesa').reduce((acc, curr) => acc + curr.valor, 0);
  const lucroLiquido = totalReceitas - totalDespesas;
  const margemLucro = totalReceitas > 0 ? ((lucroLiquido / totalReceitas) * 100).toFixed(1) : 0;
  
  // Calculate generic DRE from transactions
  const dataDRE = [
    { name: 'Atual', receitas: totalReceitas, despesas: totalDespesas, lucro: lucroLiquido }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Controle Financeiro</h2>
          <p className="text-slate-500 dark:text-slate-400">Visão consolidada de todas as finanças e DRE.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            <Download className="h-4 w-4" />
            Relatório
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus className="h-5 w-5" />
            Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Receitas (Mês)</p>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm font-medium text-emerald-500 mt-2">Valores recebidos</p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500/20">
            <div className="h-full bg-emerald-500 w-[80%] rounded-r-full"></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Despesas (Mês)</p>
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm font-medium text-red-500 mt-2">Valores pagos</p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/20">
            <div className="h-full bg-red-500 w-[50%] rounded-r-full"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-raon-blue to-raon-dark rounded-xl p-5 border border-raon-dark shadow-xl text-white relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-100">Lucro Líquido</p>
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">
            R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm font-medium text-blue-200 mt-2">Margem de Lucro: {margemLucro}%</p>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Demonstrativo de Resultados (DRE)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataDRE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis tickFormatter={(val) => `R$${val/1000}k`} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: 'transparent'}}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="receitas" name="Receitas" fill="#0066FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" name="Despesas" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lucro" name="Lucro Líquido" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-0 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Últimas Transações</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Descrição</th>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium">Data</th>
                  <th className="px-6 py-3 font-medium text-right">Valor</th>
                  <th className="px-6 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{t.descricao}</p>
                      <p className="text-xs text-slate-500">{t.status}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-medium">
                        {t.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.data}</td>
                    <td className={`px-6 py-4 text-right font-bold ${t.tipo === 'receita' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => removeTransaction(t.id)}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Nova Transação</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'receita' })}
                  className={`py-2 px-4 rounded-lg font-medium text-sm flex justify-center items-center gap-2 border transition-colors ${
                    formData.tipo === 'receita' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400' 
                      : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'despesa' })}
                  className={`py-2 px-4 rounded-lg font-medium text-sm flex justify-center items-center gap-2 border transition-colors ${
                    formData.tipo === 'despesa' 
                      ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400' 
                      : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <TrendingDown className="h-4 w-4" />
                  Despesa
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                <input 
                  type="text" 
                  name="descricao" 
                  required
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Ex: Mensalidade Cliente X" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                <input 
                  type="text" 
                  name="categoria" 
                  required
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  placeholder="Ex: Serviços, Impostos, Anúncios" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data</label>
                  <input 
                    type="date" 
                    name="data" 
                    required
                    value={formData.data}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                    <input 
                      type="number" 
                      name="valor"
                      step="0.01" 
                      required
                      value={formData.valor}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-raon-blue dark:bg-slate-800 dark:text-white" 
                      placeholder="0.00" 
                    />
                  </div>
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
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${
                    formData.tipo === 'receita' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Adicionar {formData.tipo === 'receita' ? 'Receita' : 'Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

