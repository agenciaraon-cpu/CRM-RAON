import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Client {
  id: number;
  name: string;
  plan: string;
  status: string;
  owner: string;
  value: number;
  dueDate: string;
}

export interface Transaction {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: "receita" | "despesa";
  data: string;
  status: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  tags: string[];
  value: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  date: string;
  attachments: number;
  comments: number;
  tasks: string;
  priority: string;
}

interface AppState {
  clients: Client[];
  addClient: (client: Client) => void;

  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;

  removeClient: (id: number) => void;
  removeTransaction: (id: number) => void;

  crmData: any;
  setCrmData: (data: any) => void;
  removeLead: (id: string, colId: string) => void;

  projectData: any;
  setProjectData: (data: any) => void;
  removeProject: (id: string, colId: string) => void;

  tickets: any[];
  addTicket: (ticket: any) => void;
  removeTicket: (id: number) => void;

  campaigns: any[];
  addCampaign: (campaign: any) => void;
  removeCampaign: (id: number) => void;

  team: any[];
  addTeamMember: (member: any) => void;
  removeTeamMember: (id: number) => void;
}

const initialCrmData = {
  columns: {
    "col-1": { id: "col-1", title: "Novo Lead", leadIds: [] },
    "col-2": { id: "col-2", title: "Contato Realizado", leadIds: [] },
    "col-3": { id: "col-3", title: "Proposta Enviada", leadIds: [] },
    "col-4": { id: "col-4", title: "Negociação", leadIds: [] },
    "col-5": { id: "col-5", title: "Fechado", leadIds: [] },
    "col-6": { id: "col-6", title: "Perdido", leadIds: [] },
  },
  leads: {},
  columnOrder: ["col-1", "col-2", "col-3", "col-4", "col-5", "col-6"],
};

const initialProjectData = {
  columns: {
    "col-1": { id: "col-1", title: "Briefing", projectIds: [] },
    "col-2": { id: "col-2", title: "Planejamento", projectIds: [] },
    "col-3": { id: "col-3", title: "Produção", projectIds: [] },
    "col-4": { id: "col-4", title: "Revisão", projectIds: [] },
    "col-5": { id: "col-5", title: "Aprovação", projectIds: [] },
    "col-6": { id: "col-6", title: "Entrega", projectIds: [] },
  },
  projects: {},
  columnOrder: ["col-1", "col-2", "col-3", "col-4", "col-5", "col-6"],
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [crmData, setCrmData] = useState(initialCrmData);
  const [projectData, setProjectData] = useState(initialProjectData);

  const [tickets, setTickets] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);

  const addTicket = (ticket: any) => setTickets((prev) => [ticket, ...prev]);
  const removeTicket = (id: number) =>
    setTickets((prev) => prev.filter((t) => t.id !== id));

  const addCampaign = (campaign: any) =>
    setCampaigns((prev) => [campaign, ...prev]);
  const removeCampaign = (id: number) =>
    setCampaigns((prev) => prev.filter((c) => c.id !== id));

  const addTeamMember = (member: any) => setTeam((prev) => [member, ...prev]);
  const removeTeamMember = (id: number) =>
    setTeam((prev) => prev.filter((m) => m.id !== id));

  const removeClient = (id: number) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const removeTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const removeLead = (id: string, colId: string) => {
    setCrmData((prev: any) => {
      const newLeads = { ...prev.leads };
      delete newLeads[id];
      const newColumn = {
        ...prev.columns[colId],
        leadIds: prev.columns[colId].leadIds.filter(
          (lId: string) => lId !== id,
        ),
      };
      return {
        ...prev,
        leads: newLeads,
        columns: { ...prev.columns, [colId]: newColumn },
      };
    });
  };

  const removeProject = (id: string, colId: string) => {
    setProjectData((prev: any) => {
      const newProjects = { ...prev.projects };
      delete newProjects[id];
      const newColumn = {
        ...prev.columns[colId],
        projectIds: prev.columns[colId].projectIds.filter(
          (pId: string) => pId !== id,
        ),
      };
      return {
        ...prev,
        projects: newProjects,
        columns: { ...prev.columns, [colId]: newColumn },
      };
    });
  };

  const addClient = (client: Client) => {
    setClients((prev) => [client, ...prev]);
    // Automatically add billing transaction for the new client
    addTransaction({
      id: Date.now(),
      descricao: `Mensalidade - ${client.name}`,
      categoria: "Mensalidades",
      valor: client.value,
      tipo: "receita",
      data: client.dueDate,
      status: "Pendente",
    });
  };

  const addTransaction = (t: Transaction) => {
    setTransactions((prev) => [t, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        addClient,
        removeClient,
        transactions,
        addTransaction,
        removeTransaction,
        crmData,
        setCrmData,
        removeLead,
        projectData,
        setProjectData,
        removeProject,
        tickets,
        addTicket,
        removeTicket,
        campaigns,
        addCampaign,
        removeCampaign,
        team,
        addTeamMember,
        removeTeamMember,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
}
