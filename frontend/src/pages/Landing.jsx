import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Activity, Users, Map, ArrowRight, Zap, ChevronRight } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden selection:bg-civic-500/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-civic-600/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-civic-500 to-civic-700 flex items-center justify-center shadow-lg shadow-civic-600/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">CivicAlpha</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Platform</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#about" className="hover:text-white transition-colors">Company</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/app" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/app" className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Enter Platform
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-500/10 border border-civic-500/20 text-civic-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-civic-400 animate-pulse-soft" />
              Next-Generation Urban Intelligence
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
              Smarter Cities, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
                Powered by Artificial Intelligence.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
              CivicAlpha streamlines urban infrastructure management with real-time AI triage, predictive analytics, and seamless citizen engagement.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app" className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-civic-600 to-civic-500 text-white text-base font-semibold rounded-full hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-1">
                Start Exploring
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-white text-base font-medium rounded-full hover:bg-slate-800 hover:border-slate-700 transition-all">
                See How It Works
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Mockup Dashboard Preview Image / Graphic */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto px-6 mb-32"
        >
          <div className="relative rounded-2xl md:rounded-[2rem] border border-slate-800/60 bg-slate-900/50 backdrop-blur-sm p-2 md:p-4 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="aspect-[16/9] rounded-xl md:rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative">
              {/* Abstract Representation of the Dashboard */}
              <div className="absolute inset-0 bg-grid opacity-50" />
              <div className="absolute top-8 left-8 right-8 flex gap-6 opacity-80">
                <div className="w-64 h-full bg-slate-900 rounded-lg border border-slate-800 p-4 space-y-4 hidden md:block">
                  <div className="w-full h-8 bg-slate-800 rounded-md" />
                  <div className="w-3/4 h-4 bg-slate-800 rounded-sm" />
                  <div className="w-5/6 h-4 bg-slate-800 rounded-sm" />
                  <div className="w-full h-4 bg-slate-800 rounded-sm" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1 h-32 bg-slate-900 rounded-xl border border-slate-800" />
                    <div className="flex-1 h-32 bg-slate-900 rounded-xl border border-slate-800 hidden sm:block" />
                    <div className="flex-1 h-32 bg-slate-900 rounded-xl border border-slate-800 hidden lg:block" />
                  </div>
                  <div className="w-full h-64 bg-slate-900 rounded-xl border border-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 border-t border-slate-800/40 bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">Engineered for Scale and Precision</h2>
              <p className="text-slate-400 text-lg">Our architecture guarantees real-time insights, enabling authorities to act faster and citizens to stay informed effortlessly.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "AI-Powered Triage", desc: "Instantly categorize and prioritize reported issues using advanced machine learning models." },
                { icon: Map, title: "Geospatial Intelligence", desc: "Interactive heatmaps and live tracking pinpoint infrastructural vulnerabilities across the city." },
                { icon: Users, title: "Citizen Engagement", desc: "Gamified reward systems and real-time status updates build unprecedented public trust." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                  className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:bg-slate-900/80 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-civic-500/10 flex items-center justify-center mb-6 border border-civic-500/20 group-hover:bg-civic-500 group-hover:text-white transition-all">
                    <feature.icon className="w-6 h-6 text-civic-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-civic-500" />
            <span className="font-semibold text-white">CivicAlpha</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 CivicAlpha Platforms Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
