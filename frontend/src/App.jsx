import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';
import Dashboard from './pages/Dashboard';
import IssueDetail from './pages/IssueDetail';
import MapView from './pages/MapView';
import Leaderboard from './pages/Leaderboard';
import {
  LogOut, Menu, X, PlusCircle, List, LayoutDashboard,
  Map, Trophy, ChevronRight, Zap, Shield,
} from 'lucide-react';

function App() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return <Login />;

  // Set default page based on role
  const activePage = currentPage || (user.role === 'citizen' ? 'report' : 'dashboard');

  const citizenNav = [
    { id: 'report', label: 'Report Issue', icon: PlusCircle },
    { id: 'my-issues', label: 'My Issues', icon: List },
    { id: 'map', label: 'City Map', icon: Map },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const authorityNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'City Map', icon: Map },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const navItems = user.role === 'citizen' ? citizenNav : authorityNav;

  function handleViewIssue(issueId) {
    setSelectedIssueId(issueId);
    setCurrentPage('issue-detail');
  }

  function handleBack() {
    setSelectedIssueId(null);
    setCurrentPage(user.role === 'citizen' ? 'my-issues' : 'dashboard');
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
        return <ReportIssue onSuccess={() => setCurrentPage('my-issues')} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'}
          bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-civic-500 to-civic-700 flex items-center justify-center shadow-lg shadow-civic-600/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">CivicPulse</h1>
            <span className="text-[10px] font-semibold text-civic-400 tracking-widest uppercase">AI Platform</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSelectedIssueId(null); }}
                className={`nav-item w-full group ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-civic-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-civic-400" />}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-3 py-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-civic-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${user.role === 'citizen' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-[11px] text-slate-500 capitalize">{user.role}</span>
                {user.role === 'citizen' && (
                  <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-semibold ml-1">
                    <Zap className="w-3 h-3" />{user.xp} XP
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white">
              {navItems.find(n => n.id === activePage)?.label || 'Issue Detail'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              System Online
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 page-enter">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;