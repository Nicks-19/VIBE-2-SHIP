import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';
import Dashboard from './pages/Dashboard';
import IssueDetail from './pages/IssueDetail';
import MapView from './pages/MapView';
import Leaderboard from './pages/Leaderboard';

function App() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  if (!user) return <Login />;

  const activePage = currentPage || (user.role === 'citizen' ? 'dashboard' : 'dashboard');

  function handleViewIssue(issueId) {
    setSelectedIssueId(issueId);
    setCurrentPage('issue-detail');
  }

  function handleBack() {
    setSelectedIssueId(null);
    setCurrentPage('dashboard');
  }

  function renderPage() {
    switch (activePage) {
      case 'report':
        return <ReportIssue onSuccess={() => setCurrentPage('my-issues')} />;
      case 'my-issues':
        return <MyIssues userId={user.uid} onViewIssue={handleViewIssue} />;
      case 'dashboard':
        return <Dashboard onViewIssue={handleViewIssue} />;
      case 'issue-detail':
        return <IssueDetail issueId={selectedIssueId} onBack={handleBack} isAuthority={user.role === 'authority'} />;
      case 'map':
        return <MapView onViewIssue={handleViewIssue} />;
      case 'leaderboard':
        return <Leaderboard currentUserId={user.uid} />;
      default:
        return <Dashboard onViewIssue={handleViewIssue} />;
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen pb-24">
      {/* Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <button className="material-symbols-outlined text-primary hover:bg-primary/10 transition-colors p-2 rounded-full">grid_view</button>
          <h1 className="font-display-sm text-headline-lg-mobile tracking-tighter text-primary">CivicPulse AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="material-symbols-outlined text-primary hover:bg-primary/10 transition-colors p-2 rounded-full">smart_toy</button>
          <button onClick={logout} className="material-symbols-outlined text-error hover:bg-error/10 transition-colors p-2 rounded-full text-sm">logout</button>
        </div>
      </header>

      <main className="pt-20 px-margin-mobile max-w-container-max mx-auto space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FAB */}
      <button 
        onClick={() => setCurrentPage('report')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_8px_32px_rgba(37,99,235,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
        <span className="absolute right-16 bg-surface-container-highest text-on-surface text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-outline-variant/30">Quick Report</span>
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-2xl rounded-t-xl md:hidden">
        <button onClick={() => setCurrentPage('dashboard')} className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 border transition-all ${activePage === 'dashboard' ? 'bg-primary-container/40 text-primary border-primary/20' : 'text-on-surface-variant border-transparent'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activePage === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="font-label-md text-label-md">Home</span>
        </button>
        <button onClick={() => setCurrentPage('map')} className={`flex flex-col items-center justify-center transition-all ${activePage === 'map' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
          <span className="material-symbols-outlined">map</span>
          <span className="font-label-md text-label-md">Map</span>
        </button>
        <button onClick={() => setCurrentPage('report')} className={`flex flex-col items-center justify-center transition-all ${activePage === 'report' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-label-md text-label-md">Report</span>
        </button>
        <button onClick={() => setCurrentPage('my-issues')} className={`flex flex-col items-center justify-center transition-all ${activePage === 'my-issues' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
          <span className="material-symbols-outlined">list</span>
          <span className="font-label-md text-label-md">Issues</span>
        </button>
        <button onClick={() => setCurrentPage('leaderboard')} className={`flex flex-col items-center justify-center transition-all ${activePage === 'leaderboard' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
          <span className="material-symbols-outlined">trophy</span>
          <span className="font-label-md text-label-md">Rank</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
