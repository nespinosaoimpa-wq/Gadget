import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Login from './auth/Login';
import Dashboard from './modules/dashboard/Dashboard';
import CaseList from './modules/cases/CaseList';
import CaseDetail from './modules/cases/CaseDetail';
import CaseCreate from './modules/cases/CaseCreate';
import LinkAnalysis from './modules/intelligence/LinkAnalysis';
import PersonDossier from './modules/intelligence/PersonDossier';
import OrgDossier from './modules/intelligence/OrgDossier';
import DocumentGenerator from './modules/documents/DocumentGenerator';
import CrimeMap from './modules/geo/CrimeMap';
import AutomationModule from './modules/automation/AutomationModule';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import './index.css';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // In demo mode (no Supabase configured), allow access
  const isAuthenticated = !isSupabaseConfigured() || !!session;

  if (loading && isSupabaseConfigured()) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--primary-cyan)',
        fontSize: '1.2rem'
      }}>
        Verificando sesión...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        
        {/* Protected Routes inside MainLayout */}
        <Route path="/" element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="causas" element={<CaseList />} />
          <Route path="causas/:id" element={<CaseDetail />} />
          <Route path="causas/nuevo" element={<CaseCreate />} />
          <Route path="inteligencia" element={<LinkAnalysis />} />
          <Route path="inteligencia/persona/:id" element={<PersonDossier />} />
          <Route path="inteligencia/organizacion/:id" element={<OrgDossier />} />
           <Route path="geo" element={<CrimeMap />} />
           <Route path="documentos" element={<DocumentGenerator />} />
           <Route path="automatizacion" element={<AutomationModule />} />
           {/* Catch all */}
          <Route path="*" element={<div className="p-6"><h2>404 - No Encontrado</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
