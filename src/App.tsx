import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import Finance from './pages/Finance';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import IA from './pages/IA';
import Support from './pages/Support';
import Marketing from './pages/Marketing';
import Executive from './pages/Executive';
import Team from './pages/Team';
import Login from './pages/Login';

function Layout() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-raon-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 selection:bg-raon-orange selection:text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/ia" element={<IA />} />
            <Route path="/support" element={<Support />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/executive" element={<Executive />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AppProvider>
  );
}
