import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield, ShieldAlert, Sparkles, MapPin, BarChart3,
  Brain, Zap, ArrowRight, ChevronRight,
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [hoveredRole, setHoveredRole] = useState(null);

  const features = [
    { icon: Brain, label: 'AI-Powered Analysis', desc: 'Gemini classifies & prioritizes automatically' },
    { icon: MapPin, label: 'Geospatial Tracking', desc: 'Real-time issue mapping across the city' },
    { icon: BarChart3, label: 'Smart Dashboard', desc: 'Analytics for municipal decision-making' },
    { icon: Zap, label: 'Gamification', desc: 'Earn XP and badges for civic engagement' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-civic-600/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-civic-500 to-civic-700 mb-5 shadow-xl shadow-civic-600/20 animate-float">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-1">
            CivicAlpha <span className="bg-gradient-to-r from-civic-400 to-purple-400 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            AI-powered civic infrastructure reporting for smarter cities
          </p>
        </div>

        {/* Login Cards */}
        <div className="space-y-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Citizen */}
          <button
            onClick={() => login('citizen')}
            onMouseEnter={() => setHoveredRole('citizen')}
            onMouseLeave={() => setHoveredRole(null)}
            className="w-full group relative overflow-hidden rounded-2xl transition-all duration-300"
          >
            <div className={`p-5 rounded-2xl border transition-all duration-300
              ${hoveredRole === 'citizen'
                ? 'bg-civic-600/15 border-civic-500/40 shadow-lg shadow-civic-600/10'
                : 'glass border-slate-700/50 hover:border-civic-500/30'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                  ${hoveredRole === 'citizen' ? 'bg-civic-500/20' : 'bg-slate-800'}`}>
                  <Shield className={`w-6 h-6 transition-colors ${hoveredRole === 'citizen' ? 'text-civic-400' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Enter as Citizen</p>
                  <p className="text-slate-400 text-xs mt-0.5">Report issues, earn XP, track resolution</p>
                </div>
                <ArrowRight className={`w-5 h-5 transition-all duration-300 ${hoveredRole === 'citizen' ? 'text-civic-400 translate-x-0' : 'text-slate-600 -translate-x-1'}`} />
              </div>
            </div>
          </button>

          {/* Authority */}
          <button
            onClick={() => login('authority')}
            onMouseEnter={() => setHoveredRole('authority')}
            onMouseLeave={() => setHoveredRole(null)}
            className="w-full group relative overflow-hidden rounded-2xl transition-all duration-300"
          >
            <div className={`p-5 rounded-2xl border transition-all duration-300
              ${hoveredRole === 'authority'
                ? 'bg-amber-600/10 border-amber-500/40 shadow-lg shadow-amber-600/10'
                : 'glass border-slate-700/50 hover:border-amber-500/30'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                  ${hoveredRole === 'authority' ? 'bg-amber-500/20' : 'bg-slate-800'}`}>
                  <ShieldAlert className={`w-6 h-6 transition-colors ${hoveredRole === 'authority' ? 'text-amber-400' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Enter as Authority</p>
                  <p className="text-slate-400 text-xs mt-0.5">Manage issues, view analytics, assign teams</p>
                </div>
                <ArrowRight className={`w-5 h-5 transition-all duration-300 ${hoveredRole === 'authority' ? 'text-amber-400 translate-x-0' : 'text-slate-600 -translate-x-1'}`} />
              </div>
            </div>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-2.5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="glass-light rounded-xl p-3.5 group hover:bg-slate-800/50 transition-all duration-200">
                <Icon className="w-4 h-4 text-civic-400 mb-2" />
                <p className="text-xs font-semibold text-white">{feature.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Google Gemini AI • Firebase • React</span>
          </div>
        </div>
      </div>
    </div>
  );
}
