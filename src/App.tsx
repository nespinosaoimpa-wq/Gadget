import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout';
import Login from './auth/Login';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import './index.css';
import type { Session } from '@supabase/supabase-js';

// Lazy loaded modules
const ExecutiveDashboard = lazy(() => import('./modules/dashboard/ExecutiveDashboard'));
const CrimeAnalytics = lazy(() => import('./modules/dashboard/CrimeAnalytics'));
const CaseList = lazy(() => import('./modules/cases/CaseList'));
const CaseDetail = lazy(() => import('./modules/cases/CaseDetail'));
const CaseCreate = lazy(() => import('./modules/cases/CaseCreate'));
const LinkAnalysis = lazy(() => import('./modules/intelligence/LinkAnalysis'));
const PersonDossier = lazy(() => import('./modules/intelligence/PersonDossier'));
const OrgDossier = lazy(() => import('./modules/intelligence/OrgDossier'));
const DocumentGenerator = lazy(() => import('./modules/documents/DocumentGenerator'));
const CrimeMap = lazy(() => import('./modules/geo/CrimeMap'));
const AutomationModule = lazy(() => import('./modules/automation/AutomationModule'));

const LoadingFallback = () => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-cyan)' }}>
    Cargando módulo...
  </div>
);

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
          <Route path="dashboard" element={
            <Suspense fallback={<LoadingFallback />}><ExecutiveDashboard /></Suspense>
          } />
          <Route path="analitica" element={
            <Suspense fallback={<LoadingFallback />}><CrimeAnalytics /></Suspense>
          } />
          <Route path="causas" element={
            <Suspense fallback={<LoadingFallback />}><CaseList /></Suspense>
          } />
          <Route path="causas/:id" element={
            <Suspense fallback={<LoadingFallback />}><CaseDetail /></Suspense>
          } />
          <Route path="causas/nuevo" element={
            <Suspense fallback={<LoadingFallback />}><CaseCreate /></Suspense>
          } />
          <Route path="inteligencia" element={
            <Suspense fallback={<LoadingFallback />}><LinkAnalysis /></Suspense>
          } />
          <Route path="inteligencia/persona/:id" element={
            <Suspense fallback={<LoadingFallback />}><PersonDossier /></Suspense>
          } />
          <Route path="inteligencia/organizacion/:id" element={
            <Suspense fallback={<LoadingFallback />}><OrgDossier /></Suspense>
          } />
           <Route path="geo" element={
            <Suspense fallback={<LoadingFallback />}><CrimeMap /></Suspense>
          } />
           <Route path="documentos" element={
            <Suspense fallback={<LoadingFallback />}><DocumentGenerator /></Suspense>
          } />
           <Route path="automatizacion" element={
            <Suspense fallback={<LoadingFallback />}><AutomationModule /></Suspense>
          } />
           {/* Catch all */}
          <Route path="*" element={<div className="p-6"><h2>404 - No Encontrado</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
