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
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

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

  const [user] = useAuthState(auth);

  const requireAdmin = async () => {
    let currentUser = user;
    if (!currentUser) {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user as any;
      } catch (err: any) {
        if (
          err.code !== "auth/popup-closed-by-user" &&
          err.code !== "auth/cancelled-popup-request"
        ) {
          alert("Erro ao fazer login com Google. Tente novamente.");
        }
        return false;
      }
    }

    if (
      currentUser?.email !== "storearca7@gmail.com" &&
      currentUser?.email !== "agenciaraon@gmail.com"
    ) {
      alert(
        "Acesso Restrito: Apenas administradores podem realizar alterações.",
      );
      return false;
    }
    return true;
  };

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

    const unsubCrm = onSnapshot(doc(db, "boardConfig", "crm"), (doc) => {
      if (doc.exists()) {
        setCrmDataState(doc.data() as any);
      } else {
        setDoc(doc.ref, initialCrmData);
      }
    });

    const unsubProject = onSnapshot(
      doc(db, "boardConfig", "projects"),
      (doc) => {
        if (doc.exists()) {
          setProjectDataState(doc.data() as any);
        } else {
          setDoc(doc.ref, initialProjectData);
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
    if (!(await requireAdmin())) return;
    await setDoc(doc(db, "tickets", ticket.id.toString()), ticket);
  };
  const removeTicket = async (id: number) => {
    if (!(await requireAdmin())) return;
    await deleteDoc(doc(db, "tickets", id.toString()));
  };

  const addCampaign = async (campaign: any) => {
    if (!(await requireAdmin())) return;
    await setDoc(doc(db, "campaigns", campaign.id.toString()), campaign);
  };
  const removeCampaign = async (id: number) => {
    if (!(await requireAdmin())) return;
    await deleteDoc(doc(db, "campaigns", id.toString()));
  };

  const addTeamMember = async (member: any) => {
    if (!(await requireAdmin())) return;
    await setDoc(doc(db, "team", member.id.toString()), member);
  };
  const removeTeamMember = async (id: number) => {
    if (!(await requireAdmin())) return;
    await deleteDoc(doc(db, "team", id.toString()));
  };

  const removeClient = async (id: number) => {
    if (!(await requireAdmin())) return;
    await deleteDoc(doc(db, "clients", id.toString()));
  };

  const removeTransaction = async (id: number) => {
    if (!(await requireAdmin())) return;
    await deleteDoc(doc(db, "transactions", id.toString()));
  };

  const setCrmData = async (data: any) => {
    if (!(await requireAdmin())) return;
    await setDoc(doc(db, "boardConfig", "crm"), data);
  };

  const removeLead = async (id: string, colId: string) => {
    if (!(await requireAdmin())) return;
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
    if (!(await requireAdmin())) return;
    await setDoc(doc(db, "boardConfig", "projects"), data);
  };

  const removeProject = async (id: string, colId: string) => {
    if (!(await requireAdmin())) return;
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
    if (!(await requireAdmin())) return;
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
    if (!(await requireAdmin())) return;
    await setDoc(doc(db, "transactions", t.id.toString()), t);
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
