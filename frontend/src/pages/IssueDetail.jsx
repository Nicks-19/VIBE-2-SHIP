import React, { useState, useEffect } from 'react';
import { fetchIssue, updateIssueStatus, upvoteIssue } from '../services/ApiService';
import {
  ArrowLeft, MapPin, Clock, AlertTriangle, CheckCircle2,
  Loader2, ThumbsUp, Tag, Sparkles, Building2, ChevronDown,
  CircleDot, XCircle,
} from 'lucide-react';

const STATUS_STYLES = {
  'Submitted': 'badge-open',
  'Verified': 'badge-medium',
  'In Progress': 'badge-in-progress',
  'Resolved': 'badge-resolved',
  'Rejected': 'badge-rejected',
};

const STATUS_ICONS = {
  'Submitted': CircleDot,
  'Verified': CheckCircle2,
  'In Progress': Clock,
  'Resolved': CheckCircle2,
  'Rejected': XCircle,
};

const SEVERITY_LABELS = { 1: 'Low', 2: 'Minor', 3: 'Moderate', 4: 'Major', 5: 'Critical' };
const SEVERITY_COLORS = {
  1: 'bg-slate-500/15 text-slate-400',
  2: 'bg-blue-500/15 text-blue-400',
  3: 'bg-amber-500/15 text-amber-400',
  4: 'bg-orange-500/15 text-orange-400',
  5: 'bg-rose-500/15 text-rose-400',
};

export default function IssueDetail({ issueId, onBack, isAuthority }) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadIssue();
  }, [issueId]);

  async function loadIssue() {
    setLoading(true);
    const data = await fetchIssue(issueId);
    setIssue(data);
    setLoading(false);
  }

  async function handleStatusUpdate(newStatus) {
    setUpdating(true);
    await updateIssueStatus(issueId, newStatus, `Status changed to ${newStatus}`);
    await loadIssue();
    setUpdating(false);
  }

  async function handleUpvote() {
    await upvoteIssue(issueId);
    await loadIssue();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-civic-400 animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Issue not found</p>
        <button onClick={onBack} className="mt-4 text-civic-400 text-sm hover:underline">Go back</button>
      </div>
    );
  }

  const analysis = issue.aiAnalysis || {};
  const timeline = issue.timeline || [];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to list
      </button>

      {/* Header */}
      <div className="glass rounded-2xl p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-slate-500">{issue.id}</span>
              <span className={`badge ${STATUS_STYLES[issue.status]}`}>{issue.status}</span>
              <span className={`badge ${SEVERITY_COLORS[issue.severity]}`}>
                {SEVERITY_LABELS[issue.severity]} Severity
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{issue.title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{issue.description}</p>
          </div>
          <div className="text-center ml-6 flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-civic-600 to-civic-800 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{issue.priorityScore}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Priority</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-700/50">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {issue.location?.address || `${issue.location?.latitude?.toFixed(4)}, ${issue.location?.longitude?.toFixed(4)}`}
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-civic-400" />
            {issue.department}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {new Date(issue.createdTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5" />
            {issue.upvotes || 0} upvotes • {issue.verificationCount || 0} verifications
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Analysis */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-civic-400" /> AI Analysis
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 rounded-xl bg-slate-800/60">
              <p className="text-xs text-slate-500 mb-1">Category</p>
              <p className="text-sm font-semibold text-white">{analysis.category || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60">
              <p className="text-xs text-slate-500 mb-1">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${(analysis.visionConfidence || 0) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-emerald-400">
                  {((analysis.visionConfidence || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Keywords */}
          {analysis.extractedKeywords?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Extracted Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.extractedKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-civic-500/10 border border-civic-500/20 text-civic-400 text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Priority Reasons */}
          {issue.priorityReasons?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Priority Factors
              </p>
              <div className="space-y-1.5">
                {issue.priorityReasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <ChevronDown className="w-3 h-3 text-amber-400 rotate-[-90deg]" />
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/50">
            {!isAuthority && (
              <button
                onClick={handleUpvote}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
              >
                <ThumbsUp className="w-4 h-4" /> Upvote ({issue.upvotes || 0})
              </button>
            )}
            {isAuthority && issue.status !== 'Resolved' && issue.status !== 'Rejected' && (
              <>
                {issue.status === 'Submitted' && (
                  <button
                    onClick={() => handleStatusUpdate('In Progress')}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-medium transition-colors"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                    Start Progress
                  </button>
                )}
                <button
                  onClick={() => handleStatusUpdate('Resolved')}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium transition-colors"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Resolve Issue
                </button>
                <button
                  onClick={() => handleStatusUpdate('Rejected')}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Status Timeline</h3>
          <div className="relative">
            <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-slate-700" />
            <div className="space-y-4">
              {timeline.map((event, i) => {
                const Icon = STATUS_ICONS[event.status] || CircleDot;
                const isLast = i === timeline.length - 1;
                return (
                  <div key={i} className="flex gap-3 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10
                      ${isLast ? 'bg-civic-500/20 ring-2 ring-civic-500/30' : 'bg-slate-800'}
                    `}>
                      <Icon className={`w-3 h-3 ${isLast ? 'text-civic-400' : 'text-slate-500'}`} />
                    </div>
                    <div className="pb-2">
                      <p className={`text-sm font-medium ${isLast ? 'text-white' : 'text-slate-400'}`}>
                        {event.status}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{event.note}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {new Date(event.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
