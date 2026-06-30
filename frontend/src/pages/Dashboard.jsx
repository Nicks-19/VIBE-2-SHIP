import React, { useState, useEffect } from 'react';
import { fetchStats, fetchIssues, updateIssueStatus } from '../services/ApiService';
import {
  AlertTriangle, CheckCircle2, Clock, Loader2, TrendingUp, BarChart3,
  ChevronRight, ArrowUpRight, ArrowDownRight, Building2, Zap,
  CircleDot, Activity,
} from 'lucide-react';

const STATUS_STYLES = {
  'Submitted': 'badge-open',
  'Verified': 'badge-medium',
  'In Progress': 'badge-in-progress',
  'Resolved': 'badge-resolved',
  'Rejected': 'badge-rejected',
};

function AnimatedCounter({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{typeof value === 'number' && value % 1 !== 0 ? display.toFixed(1) : display}</>;
}

export default function Dashboard({ onViewIssue }) {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [s, i] = await Promise.all([fetchStats(), fetchIssues()]);
    setStats(s);
    setIssues(i);
    setLoading(false);
  }

  async function handleStatusChange(issueId, newStatus) {
    await updateIssueStatus(issueId, newStatus, `Status changed to ${newStatus} by authority`);
    loadData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-civic-400 animate-spin" />
      </div>
    );
  }

  const statusBreakdown = stats?.statusBreakdown || {};
  const categoryBreakdown = stats?.categoryBreakdown || {};
  const maxCategoryCount = Math.max(...Object.values(categoryBreakdown), 1);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Command Center</h2>
          <p className="text-sm text-slate-400">Municipal issue management dashboard</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-500/10 border border-civic-500/20">
          <Activity className="w-3.5 h-3.5 text-civic-400" />
          <span className="text-xs font-medium text-civic-400">Live Data</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="stat-card stat-card-indigo glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Issues</span>
            <BarChart3 className="w-4 h-4 text-civic-400" />
          </div>
          <p className="text-3xl font-bold text-white"><AnimatedCounter value={stats?.totalIssues || 0} /></p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="w-3 h-3" /> +3 this week
          </div>
        </div>

        <div className="stat-card stat-card-amber glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Open / In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            <AnimatedCounter value={(statusBreakdown['Submitted'] || 0) + (statusBreakdown['In Progress'] || 0)} />
          </p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-400">
            <AlertTriangle className="w-3 h-3" /> Requires attention
          </div>
        </div>

        <div className="stat-card stat-card-emerald glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white"><AnimatedCounter value={statusBreakdown['Resolved'] || 0} /></p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="w-3 h-3" /> {stats?.resolvedRate || 0}% resolution rate
          </div>
        </div>

        <div className="stat-card stat-card-rose glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Avg Priority</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-bold text-white"><AnimatedCounter value={stats?.avgPriority || 0} /></p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-rose-400">
            <Zap className="w-3 h-3" /> Severity avg: {stats?.avgSeverity || 0}
          </div>
        </div>
      </div>

      {/* Category Breakdown + Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-civic-400" /> Category Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{cat}</span>
                  <span className="text-slate-500">{count}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-civic-600 to-civic-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Issues */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Active Issues
          </h3>
          <div className="space-y-2">
            {issues.filter(i => i.status !== 'Resolved').slice(0, 6).map(issue => (
              <div
                key={issue.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer group"
                onClick={() => onViewIssue(issue.id)}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  issue.severity >= 4 ? 'bg-rose-400' : issue.severity >= 3 ? 'bg-amber-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{issue.title}</p>
                  <p className="text-xs text-slate-500">{issue.department} • {issue.reporterName}</p>
                </div>
                <span className={`badge ${STATUS_STYLES[issue.status] || ''}`}>{issue.status}</span>
                <div className="text-right flex-shrink-0 w-12">
                  <p className="text-sm font-bold text-white">{issue.priorityScore}</p>
                </div>
                {/* Quick actions for authority */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {issue.status === 'Submitted' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(issue.id, 'In Progress'); }}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs"
                      title="Start Progress"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {(issue.status === 'Submitted' || issue.status === 'In Progress') && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(issue.id, 'Resolved'); }}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs"
                      title="Mark Resolved"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-civic-400 transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-civic-400" /> Department Load
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(stats?.departmentBreakdown || {}).map(([dept, count]) => (
            <div key={dept} className="p-4 rounded-xl bg-slate-800/40 text-center hover:bg-slate-800/60 transition-colors">
              <p className="text-2xl font-bold text-white mb-1">{count}</p>
              <p className="text-xs text-slate-400 leading-tight">{dept}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
