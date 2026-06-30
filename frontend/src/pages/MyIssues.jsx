import React, { useState, useEffect } from 'react';
import { fetchIssues } from '../services/ApiService';
import {
  Clock, MapPin, ChevronRight, AlertTriangle, Filter,
  Loader2, Inbox, TrendingUp,
} from 'lucide-react';

const STATUS_STYLES = {
  'Submitted': 'badge-open',
  'Verified': 'badge-medium',
  'In Progress': 'badge-in-progress',
  'Resolved': 'badge-resolved',
  'Rejected': 'badge-rejected',
};

const SEVERITY_LABELS = { 1: 'Low', 2: 'Minor', 3: 'Moderate', 4: 'Major', 5: 'Critical' };
const SEVERITY_COLORS = {
  1: 'text-slate-400', 2: 'text-blue-400', 3: 'text-amber-400', 4: 'text-orange-400', 5: 'text-rose-400',
};

export default function MyIssues({ userId, onViewIssue }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadIssues();
  }, []);

  async function loadIssues() {
    setLoading(true);
    const data = await fetchIssues({ reporterId: userId });
    setIssues(data);
    setLoading(false);
  }

  const filtered = statusFilter === 'all'
    ? issues
    : issues.filter(i => i.status === statusFilter);

  const statuses = ['all', 'Submitted', 'In Progress', 'Resolved', 'Rejected'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-civic-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">My Reports</h2>
          <p className="text-sm text-slate-400">{issues.length} issues reported</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
              ${statusFilter === s 
                ? 'bg-civic-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Issues List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No issues found</p>
          <p className="text-slate-500 text-sm mt-1">Report your first civic issue to see it here</p>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {filtered.map(issue => (
            <button
              key={issue.id}
              onClick={() => onViewIssue(issue.id)}
              className="w-full text-left glass rounded-xl p-5 hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                {/* Priority indicator */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${issue.severity >= 4 ? 'bg-rose-500/10' : issue.severity >= 3 ? 'bg-amber-500/10' : 'bg-slate-800'}
                `}>
                  <TrendingUp className={`w-5 h-5 ${SEVERITY_COLORS[issue.severity] || 'text-slate-400'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{issue.title}</h3>
                    <span className={`badge ${STATUS_STYLES[issue.status] || 'badge-open'}`}>
                      {issue.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 truncate mb-2">{issue.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {issue.aiAnalysis?.category || 'Uncategorized'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {issue.location?.address || `${issue.location?.latitude?.toFixed(3)}, ${issue.location?.longitude?.toFixed(3)}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(issue.createdTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{issue.priorityScore}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Priority</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-civic-400 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
