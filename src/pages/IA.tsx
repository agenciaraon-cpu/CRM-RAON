import { useState } from 'react';
import { Send, Bot, User, Sparkles, Image, FileText, Zap } from 'lucide-react';

const mockMessaegs = [
  { id: 1, role: 'ai', content: 'Olá! Sou a RAON IA, seu assistente virtual integrado. Como posso ajudar a Raon Agência Digital hoje?' },
  { id: 2, role: 'user', content: 'Gere uma ideia de roteiro para um Reels rápido no Instagram focado em captação de clientes B2B.' },
  { id: 3, role: 'ai', content: 'Aqui está uma ideia de roteiro dinâmico e focado em conversão para B2B:\n\n**Gancho (0-3s)**: "Sua empresa ainda está dependendo apenas de indicações para vender?"\n*(Você balança a cabeça negativamente enquanto aponta para o celular)*\n\n**Corpo (3-10s)**: "No mercado B2B, previsibilidade é tudo. Aqui na Raon, implementamos uma máquina de vendas: automação CRM + Google Ads focado e funis passivos."\n\n**Prova Social (10-15s)**: "Foi assim que cliente X dobrou o faturamento no último trimestre."\n\n**CTA (15-20s)**: "Quer essa máquina na sua empresa? Clique no link da bio e faça um diagnóstico gratuito com nossa equipe de especialistas."\n\n**Dica Visual:** Use o modo "tela dividida" mostrando os gráficos do Dashboard RAON CRM de um lado e você do outro.' },
];

const quickActions = [
  { icon: FileText, label: 'Gerar Proposta' },
  { icon: Sparkles, label: 'Ideias de Reels' },
  { icon: Zap, label: 'Roteiro Ads' },
  { icon: Image, label: 'Legenda Instagram' }
];

export default function IA() {
  const [messages, setMessages] = useState(mockMessaegs);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { id: Date.now(), role: 'user', content: input }]);
    setInput('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: 'Processando sua solicitação internamente. Como este é um ambiente de demonstração premium, as integrações reais com a API Gemini estarão ativas na produção final da plataforma!' 
      }]);
    }, 1000);
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-raon-blue to-raon-dark flex items-center justify-center shadow-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <h2 className="font-bold text-slate-900 dark:text-white tracking-tight">RAON IA</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Assistente Neural da Agência</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 mt-4 sm:mt-0">
          {quickActions.map((action, i) => (
            <button key={i} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <action.icon className="h-3 w-3" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${
                msg.role === 'user' 
                  ? 'bg-slate-200 dark:bg-slate-700 ml-3' 
                  : 'bg-gradient-to-br from-raon-blue to-raon-dark mr-3 shadow-md'
              }`}>
                {msg.role === 'user' ? <User className="h-4 w-4 text-slate-600 dark:text-slate-300" /> : <Bot className="h-4 w-4 text-white" />}
              </div>
              <div className={`px-5 py-3.5 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-raon-blue text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Peça roteiros, legendas, propostas..."
            className="w-full pl-5 pr-14 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-raon-blue text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2.5 bg-raon-orange hover:bg-orange-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="h-5 w-5 ml-1 mb-0.5" />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-3">
          A IA pode cometer erros. Verifique informações importantes antes de enviar aos clientes.
        </p>
      </div>
    </div>
  );
}
