import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, MapPin, Eye, MousePointerClick, PhoneCall } from 'lucide-react';

const trafficData = [
  { name: '10 Jun', views: 400, clicks: 24 },
  { name: '11 Jun', views: 300, clicks: 13 },
  { name: '12 Jun', views: 550, clicks: 43 },
  { name: '13 Jun', views: 450, clicks: 39 },
  { name: '14 Jun', views: 600, clicks: 55 },
  { name: '15 Jun', views: 700, clicks: 62 },
];

export default function Google() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Google & SEO</h2>
          <p className="text-slate-500 dark:text-slate-400">Métricas do Google Meu Negócio e posicionamento local.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Visualizações no Google</h3>
            <Eye className="h-4 w-4 text-raon-blue" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">3.000</p>
          <p className="text-xs text-emerald-500 font-medium mt-2">+12% vs último mês</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Cliques no Site</h3>
            <MousePointerClick className="h-4 w-4 text-raon-orange" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">236</p>
          <p className="text-xs text-emerald-500 font-medium mt-2">+5% vs último mês</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Ligações</h3>
            <PhoneCall className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">45</p>
          <p className="text-xs text-red-500 font-medium mt-2">-2% vs último mês</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Avaliações (Média)</h3>
            <Search className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">4.9 / 5.0</p>
          <p className="text-xs text-emerald-500 font-medium mt-2">12 novas avaliações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Tráfego de Pesquisa (Últimos dias)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="views" name="Visualizações" stroke="#0066FF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="clicks" name="Cliques" stroke="#FF6B00" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            Ranking Local SEO
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-white">"Agência de Marketing"</span>
              <span className="text-sm font-bold text-emerald-500">1º Lugar</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-white">"Criação de Sites"</span>
              <span className="text-sm font-bold text-emerald-500">2º Lugar</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-white">"Gestão de Tráfego"</span>
              <span className="text-sm font-bold text-raon-blue">4º Lugar</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-white">"Consultoria SEO"</span>
              <span className="text-sm font-bold text-amber-500">7º Lugar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
