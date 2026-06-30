import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/ApiService';
import {
  Trophy, Medal, Zap, Star, Shield, Award,
  Loader2, Crown, Flame,
} from 'lucide-react';

const BADGE_ICONS = {
  'First Report': { icon: Star, color: 'text-amber-400 bg-amber-400/10' },
  'Road Warrior': { icon: Shield, color: 'text-blue-400 bg-blue-400/10' },
  'Water Guardian': { icon: Shield, color: 'text-cyan-400 bg-cyan-400/10' },
  'Eco Warrior': { icon: Shield, color: 'text-emerald-400 bg-emerald-400/10' },
  'Night Owl': { icon: Star, color: 'text-purple-400 bg-purple-400/10' },
  'Top Reporter': { icon: Award, color: 'text-amber-400 bg-amber-400/10' },
  'Streak 7': { icon: Flame, color: 'text-orange-400 bg-orange-400/10' },
  'Streak 14': { icon: Flame, color: 'text-rose-400 bg-rose-400/10' },
};

const RANK_STYLES = [
  { bg: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/30', icon: Crown, iconColor: 'text-amber-400' },
  { bg: 'from-slate-400/20 to-slate-500/5', border: 'border-slate-400/30', icon: Medal, iconColor: 'text-slate-300' },
  { bg: 'from-amber-700/20 to-amber-800/5', border: 'border-amber-700/30', icon: Medal, iconColor: 'text-amber-600' },
];

function XPBar({ xp, maxXp = 1000 }) {
  const pct = Math.min((xp / maxXp) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-civic-600 to-civic-400 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function Leaderboard({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await fetchLeaderboard();
    setUsers(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-civic-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
          <Trophy className="w-3.5 h-3.5" /> Civic Champions
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Community Leaderboard</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Citizens earn XP by reporting issues, verifying reports, and helping resolve community problems.
        </p>
      </div>

      {/* Top 3 Podium */}
      {users.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[1, 0, 2].map(rank => {
            const user = users[rank];
            if (!user) return null;
            const style = RANK_STYLES[rank];
            const RankIcon = style.icon;
            const isCenter = rank === 0;

            return (
              <div
                key={user.id}
                className={`glass rounded-2xl p-5 text-center border ${style.border} bg-gradient-to-b ${style.bg}
                  ${isCenter ? 'scale-105 z-10 -mt-2' : ''}
                  ${user.id === currentUserId ? 'ring-2 ring-civic-500/40' : ''}
                  transition-transform duration-300`}
              >
                <div className="relative inline-block mb-3">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl font-bold text-white
                    ${isCenter ? 'w-16 h-16' : ''}`}>
                    {user.name?.charAt(0)}
                  </div>
                  <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${style.iconColor}`}>
                    <RankIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1 mb-3">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-lg font-bold text-amber-400">{user.xp}</span>
                  <span className="text-xs text-slate-500">XP</span>
                </div>
                <XPBar xp={user.xp} />
                <p className="text-[10px] text-slate-500 mt-2">
                  {user.issuesReported} reported • {user.issuesResolved} resolved
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Ranking List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-white">Full Rankings</h3>
        </div>
        <div className="divide-y divide-slate-800/50">
          {users.map((user, index) => {
            const isCurrentUser = user.id === currentUserId;
            return (
              <div
                key={user.id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors
                  ${isCurrentUser ? 'bg-civic-600/10' : 'hover:bg-slate-800/40'}`}
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                  ${index < 3 
                    ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400' 
                    : 'bg-slate-800 text-slate-400'}`}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0
                  ${isCurrentUser ? 'bg-gradient-to-br from-civic-500 to-purple-600' : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}
                >
                  {user.name?.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                      {isCurrentUser && <span className="ml-1.5 text-xs text-civic-400">(You)</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {user.badges?.slice(0, 3).map((badge, i) => {
                      const badgeConfig = BADGE_ICONS[badge] || { icon: Star, color: 'text-slate-400 bg-slate-400/10' };
                      const BadgeIcon = badgeConfig.icon;
                      return (
                        <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${badgeConfig.color}`}>
                          <BadgeIcon className="w-2.5 h-2.5" /> {badge}
                        </span>
                      );
                    })}
                    {(user.badges?.length || 0) > 3 && (
                      <span className="text-[10px] text-slate-500">+{user.badges.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-lg font-bold text-white">{user.xp}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {user.issuesReported} reports • {user.issuesResolved} resolved
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* XP Explainer */}
      <div className="glass rounded-2xl p-6 mt-6">
        <h3 className="text-sm font-semibold text-white mb-3">How to Earn XP</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Report Issue', xp: '+50 XP', icon: '📸' },
            { label: 'Issue Resolved', xp: '+100 XP', icon: '✅' },
            { label: 'Verify Report', xp: '+20 XP', icon: '👍' },
            { label: '7-Day Streak', xp: '+75 XP', icon: '🔥' },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl bg-slate-800/40 text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs text-white font-medium mt-2">{item.label}</p>
              <p className="text-xs text-amber-400 font-bold mt-0.5">{item.xp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
