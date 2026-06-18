import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export function getCompetenciaAtual() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

export function verificarStatusCliente(cliente: any) {
  if (!cliente.dia_vencimento) return cliente.status;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const diaVencimento = cliente.dia_vencimento;
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const competenciaAtual = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}`;
  const isPagoEsteMes = cliente.ultimaCompetenciaPaga === competenciaAtual || 
                        (cliente.ultimaCompetenciaPaga === undefined && cliente.pagamentoConfirmado);

  if (isPagoEsteMes) {
    return "ATIVO";
  }

  const dataVencimentoAtual = new Date(anoAtual, mesAtual, diaVencimento);
  if (hoje.getTime() > dataVencimentoAtual.getTime()) {
    return "INADIMPLENTE";
  }

  return "A VENCER";
}

export function getProximoVencimentoData(cliente: any) {
  if (!cliente.dia_vencimento) return null;

  const hoje = new Date();
  const diaVencimento = cliente.dia_vencimento;
  let mesAvaliado = hoje.getMonth();
  let anoAvaliado = hoje.getFullYear();
  
  const competenciaAtual = `${anoAvaliado}-${String(mesAvaliado + 1).padStart(2, '0')}`;
  const isPagoEsteMes = cliente.ultimaCompetenciaPaga === competenciaAtual || 
                        (cliente.ultimaCompetenciaPaga === undefined && cliente.pagamentoConfirmado);

  if (isPagoEsteMes) {
    mesAvaliado++;
    if (mesAvaliado > 11) {
      mesAvaliado = 0;
      anoAvaliado++;
    }
  }

  return new Date(anoAvaliado, mesAvaliado, diaVencimento);
}

export function formatProximoVencimento(cliente: any) {
  const date = getProximoVencimentoData(cliente);
  if (!date) return cliente.dueDate; // fallback
  return date.toLocaleDateString('pt-BR');
}

export interface Client {
  id: number;
  name: string;
  plan: string;
  status: string;
  owner: string;
  value: number;
  dueDate: string;
  dia_vencimento?: number;
  pagamentoConfirmado?: boolean;
  ultimaCompetenciaPaga?: string;
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
  cityState?: string;
  service?: string;
  plan?: string;
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
  updateClient: (id: number, data: Partial<Client>) => void;

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
    "col-1": { id: "col-1", title: "Novo Contato", leadIds: [] },
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
  const [crmData, setCrmDataState] = useState(initialCrmData);
  const [projectData, setProjectDataState] = useState(initialProjectData);

  const [tickets, setTickets] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    const unsubClients = onSnapshot(collection(db, "clients"), (snapshot) => {
      setClients(snapshot.docs.map((doc) => doc.data() as Client));
    });
    const unsubTransactions = onSnapshot(
      collection(db, "transactions"),
      (snapshot) => {
        setTransactions(snapshot.docs.map((doc) => doc.data() as Transaction));
      },
    );
    const unsubTickets = onSnapshot(collection(db, "tickets"), (snapshot) => {
      setTickets(snapshot.docs.map((doc) => doc.data()));
    });
    const unsubCampaigns = onSnapshot(
      collection(db, "campaigns"),
      (snapshot) => {
        setCampaigns(snapshot.docs.map((doc) => doc.data()));
      },
    );
    const unsubTeam = onSnapshot(collection(db, "team"), (snapshot) => {
      setTeam(snapshot.docs.map((doc) => doc.data()));
    });

    const unsubCrm = onSnapshot(doc(db, "boardConfig", "crm"), (docSnap: any) => {
      if (docSnap.exists()) {
        setCrmDataState(docSnap.data() as any);
      } else {
        setDoc(docSnap.ref, initialCrmData);
      }
    });

    const unsubProject = onSnapshot(
      doc(db, "boardConfig", "projects"),
      (docSnap: any) => {
        if (docSnap.exists()) {
          setProjectDataState(docSnap.data() as any);
        } else {
          setDoc(docSnap.ref, initialProjectData);
        }
      },
    );

    return () => {
      unsubClients();
      unsubTransactions();
      unsubTickets();
      unsubCampaigns();
      unsubTeam();
      unsubCrm();
      unsubProject();
    };
  }, []);

  const addTicket = async (ticket: any) => {
    await setDoc(doc(db, "tickets", ticket.id.toString()), ticket);
  };
  const removeTicket = async (id: number) => {
    await deleteDoc(doc(db, "tickets", id.toString()));
  };

  const addCampaign = async (campaign: any) => {
    await setDoc(doc(db, "campaigns", campaign.id.toString()), campaign);
  };
  const removeCampaign = async (id: number) => {
    await deleteDoc(doc(db, "campaigns", id.toString()));
  };

  const addTeamMember = async (member: any) => {
    await setDoc(doc(db, "team", member.id.toString()), member);
  };
  const removeTeamMember = async (id: number) => {
    await deleteDoc(doc(db, "team", id.toString()));
  };

  const updateClient = async (id: number, data: Partial<Client>) => {
    await updateDoc(doc(db, "clients", id.toString()), data);
  };

  const removeClient = async (id: number) => {
    await deleteDoc(doc(db, "clients", id.toString()));
  };

  const removeTransaction = async (id: number) => {
    await deleteDoc(doc(db, "transactions", id.toString()));
  };

  const setCrmData = async (data: any) => {
    await setDoc(doc(db, "boardConfig", "crm"), data);
  };

  const removeLead = async (id: string, colId: string) => {
    const newLeads = { ...crmData.leads };
    delete newLeads[id];
    const newColumn = {
      ...crmData.columns[colId],
      leadIds: crmData.columns[colId].leadIds.filter(
        (lId: string) => lId !== id,
      ),
    };
    const newData = {
      ...crmData,
      leads: newLeads,
      columns: { ...crmData.columns, [colId]: newColumn },
    };
    await setCrmData(newData);
  };

  const setProjectData = async (data: any) => {
    await setDoc(doc(db, "boardConfig", "projects"), data);
  };

  const removeProject = async (id: string, colId: string) => {
    const newProjects = { ...projectData.projects };
    delete newProjects[id];
    const newColumn = {
      ...projectData.columns[colId],
      projectIds: projectData.columns[colId].projectIds.filter(
        (pId: string) => pId !== id,
      ),
    };
    const newData = {
      ...projectData,
      projects: newProjects,
      columns: { ...projectData.columns, [colId]: newColumn },
    };
    await setProjectData(newData);
  };

  const addClient = async (client: Client) => {
    await setDoc(doc(db, "clients", client.id.toString()), client);
    // Automatically add billing transaction for the new client
    const transactionId = Date.now();
    addTransaction({
      id: transactionId,
      descricao: `Mensalidade - ${client.name}`,
      categoria: "Mensalidades",
      valor: client.value,
      tipo: "receita",
      data: client.dueDate,
      status: "Pendente",
    });
  };

  const addTransaction = async (t: Transaction) => {
    await setDoc(doc(db, "transactions", t.id.toString()), t);
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
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
