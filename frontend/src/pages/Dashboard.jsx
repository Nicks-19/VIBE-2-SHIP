import React from 'react';
import { motion } from 'framer-motion';

export default function Dashboard({ onViewIssue }) {
  return (
    <>
      {/* Header & Weather Widget */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <p className="text-on-surface-variant font-label-md uppercase tracking-wider mb-1">Thursday, Oct 24</p>
          <h2 className="font-headline-lg-mobile text-on-background">Good morning, Citizen</h2>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 shadow-xl">
          <div className="bg-secondary-container/50 text-secondary p-2 rounded-lg">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sunny</span>
          </div>
          <div>
            <div className="font-title-md text-on-surface">72°F <span className="text-on-surface-variant font-normal text-sm">Downtown</span></div>
            <div className="text-label-md text-secondary font-semibold">Air Quality: Good (24 AQI)</div>
          </div>
        </div>
      </motion.section>

      {/* Bento Grid Main Content */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Map Snippet Card (8 columns on desktop) */}
        <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, duration: 0.8 } } }} className="md:col-span-8 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-title-md">Nearby Issues</h3>
            <button className="text-primary font-label-md hover:underline">View Full Map</button>
          </div>
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl border border-outline-variant/30">
            <div className="absolute inset-0 bg-cover bg-center brightness-75" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcehhVisnczYayW4UtNleKcOOTvIiAoy8Fb9ygzmNOuDpsstSkudahETjBNY0gWba7CE-0K8iu72dWRjUOSzp1vOy2XCsRGnT0CE4OhYNzvi9lVcA32UpYuak0Nr-kHwCRkpjoH_OHo_lG8eYQTanrHXOgIOvWNwga2rPUmGODIGqWwkLN4xL8P97Gge9zACeE84ROJw0B3VuJFOG-15w-laujX0JM8k3yCGlByDdD13qvaRHcXYE92_N4_2TkKyPggjnEq6WTGQPX')" }}></div>
            <div className="absolute top-4 left-4 glass-card px-3 py-1 rounded-full text-xs font-semibold text-primary flex items-center gap-2 border-primary/20">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(180,197,255,0.8)]"></span>
              3 Active Alerts
            </div>
          </div>
        </motion.section>

        {/* Leaderboard Card (4 columns on desktop) */}
        <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, duration: 0.8 } } }} className="md:col-span-4 space-y-3">
          <h3 className="font-title-md">Civic Standing</h3>
          <div className="glass-card rounded-xl p-6 h-full flex flex-col justify-center items-center text-center space-y-4 shadow-xl">
            <div className="w-20 h-20 bg-primary-container/80 text-on-primary-container rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            </div>
            <div>
              <div className="text-primary font-display-sm">Rank #12</div>
              <div className="text-on-surface-variant font-body-md">in Downtown District</div>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2.5 mt-4">
              <div className="bg-primary h-2.5 rounded-full shadow-[0_0_8px_rgba(180,197,255,0.5)]" style={{ width: '85%' }}></div>
            </div>
            <p className="text-label-md text-on-surface-variant">120 points until Silver Tier</p>
          </div>
        </motion.section>

        {/* Progress Charts Section */}
        <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, duration: 0.8 } } }} className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6 flex items-center gap-6 shadow-xl">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary transition-all duration-1000" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="37.6" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <span className="absolute font-title-md text-primary">85%</span>
            </div>
            <div>
              <h4 className="font-title-md text-on-surface">City Health Score</h4>
              <p className="text-body-md text-on-surface-variant mt-1 leading-tight">Infrastructure and utility uptime is currently optimal across 14 sectors.</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-6 flex items-center gap-6 shadow-xl">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-secondary transition-all duration-1000" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="20.1" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <span className="absolute font-title-md text-secondary">92%</span>
            </div>
            <div>
              <h4 className="font-title-md text-on-surface">Citizen Trust Score</h4>
              <p className="text-body-md text-on-surface-variant mt-1 leading-tight">Response times for reports are 15% faster than last month.</p>
            </div>
          </div>
        </motion.section>

        {/* Recent Reports */}
        <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, duration: 0.8 } } }} className="md:col-span-12 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-title-md">Your Recent Reports</h3>
            <button className="text-primary font-label-md">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <motion.div whileHover={{ scale: 1.02 }} className="min-w-[280px] glass-card rounded-xl p-4 shadow-xl flex flex-col justify-between cursor-pointer" onClick={() => onViewIssue('1')}>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-primary/20">ID: #4029</span>
                <span className="text-xs text-on-surface-variant">2h ago</span>
              </div>
              <h5 className="font-semibold mb-1 text-on-surface">Broken Street Light</h5>
              <p className="text-xs text-on-surface-variant mb-4">4th & Madison Ave Intersection</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(180,197,255,0.6)]"></span>
                <span className="text-xs font-semibold text-primary">Verifying</span>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="min-w-[280px] glass-card rounded-xl p-4 shadow-xl flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-primary/20">ID: #3981</span>
                <span className="text-xs text-on-surface-variant">Yesterday</span>
              </div>
              <h5 className="font-semibold mb-1 text-on-surface">Illegal Dumping</h5>
              <p className="text-xs text-on-surface-variant mb-4">Back alley of 5th Ave Mall</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_8px_rgba(78,222,163,0.6)]"></span>
                <span className="text-xs font-semibold text-secondary">Resolved</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, duration: 0.8 } } }} className="md:col-span-12 space-y-3">
          <h3 className="font-title-md">Alerts & Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 shadow-sm">
              <div className="bg-primary-container/30 p-2 rounded-lg text-primary shrink-0">
                <span className="material-symbols-outlined text-lg">info</span>
              </div>
              <div className="flex-1">
                <p className="text-body-md font-semibold text-on-surface leading-tight">Water Main Repair scheduled for tomorrow at 9 AM.</p>
                <p className="text-xs text-on-surface-variant">Your building may experience low pressure.</p>
              </div>
              <span className="text-xs text-outline shrink-0">10m ago</span>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}
