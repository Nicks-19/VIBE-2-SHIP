import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });

    const observeStats = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.space-y-2').forEach(stat => observeStats.observe(stat));
    
    return () => {
      observeStats.disconnect();
    };
  }, []);

  return (
    <div className="bg-background text-on-background antialiased overflow-x-hidden dark">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl" data-icon="grid_view">grid_view</span>
          <span className="font-display-sm text-display-sm tracking-tighter text-on-surface">CivicPulse AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="font-label-md text-label-md text-primary transition-colors" href="#">Home</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Governance</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Citizen Labs</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Safety</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined p-2 rounded-full text-on-surface-variant hover:bg-primary/20 transition-colors" data-icon="smart_toy">smart_toy</button>
          <Link to="/app" className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 shadow-lg shadow-primary/30">Launch Console</Link>
        </div>
      </header>

      <main className="relative pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[795px] flex flex-col items-center justify-center text-center px-margin-mobile overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10"></div>
            <img alt="Futuristic city background" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlw5HTdD9w21Oi1HQ-h6l1pWeiZBQhkT0xvjR1Ic5qjITZ6CxIU31iyV4QVgzRbT1Ctmk9sKThA587GsRyUScLFz5gTe77eLKflJqTXhcbVSInvwI3eJXCGR538_xrxh5nHowLV9d0Jy-xtSBZWsWobkrJq31ad8XVVN5BrvXPQR2hBDiz-Rk1bP2EePZBaB7vUzhjWzP0u6CgttLKzhaCuUyP3WEjDXc38b_DnrF45WZT_v5-FfNHgTdh-a3wMIx8Q1vgmQjt7DIo" />
          </div>
          <div className="max-w-4xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
              <span className="material-symbols-outlined text-[16px]" data-icon="verified">verified</span>
              <span className="font-mono-label text-mono-label uppercase">Operating System for Governance</span>
            </div>
            <h1 className="font-display-lg text-display-lg md:text-[64px] md:leading-[1.1] text-on-surface tracking-tight">
              Every citizen becomes a sensor. <br className="hidden md:block" />
              <span className="text-gradient">AI becomes the city manager.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Real-time civic intelligence infrastructure. Automated reporting, predictive maintenance, and seamless citizen-to-state transparency powered by next-gen LLMs.
            </p>
            <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/app" className="glass-card p-4 rounded-3xl flex flex-col md:flex-row items-center gap-4 transition-all hover:shadow-2xl hover:shadow-primary/20 group cursor-pointer border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" data-icon="campaign" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                </div>
                <div className="text-left">
                  <span className="block font-title-md text-title-md text-on-surface">Start Reporting</span>
                  <span className="block font-label-md text-label-md text-on-surface-variant">Instant AI-triaged tickets</span>
                </div>
                <div className="ml-4 md:ml-8">
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
                </div>
              </Link>
              <button className="px-8 py-4 rounded-3xl border border-outline-variant/50 font-title-md text-title-md text-on-surface hover:bg-surface-container transition-colors">
                View Live Map
              </button>
            </div>
          </div>
          {/* Dashboard Preview */}
          <div className="mt-20 w-full max-w-5xl relative">
            <div className="glass-card rounded-t-[40px] p-2 pb-0 overflow-hidden shadow-2xl border-b-0 border-white/10">
              <div className="w-full h-80 md:h-[400px] bg-cover bg-center rounded-t-[32px] opacity-90" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBm9AOU4ZCgQmao4wAh1gAWMmMAKdyTuCoHju7udfxZoT0TmAvaY-QaBBQoM1TR2jq2o64fzw_p2-tIY7uMoZ4mROmSpoNETYu2jIuHM6h8TlOaN3qtSUaN-bggb432GOW5G6euneCE0mn5Z7npKty5Rk9GEUiMhHR_SMufkhzOt9TCD_WDTobZRjfb22BComaAWlyKXK-reaLXehijxyhS7rhiVr0yhgbrRrS9MGLkCAGV6S-2FNQ2nSy3egWBSVLqkZ6c9m06sEbV')" }}></div>
            </div>
            {/* Floating Detail Card */}
            <div className="absolute -bottom-6 -right-4 md:right-10 glass-card p-6 rounded-2xl shadow-xl max-w-[240px] animate-bounce-slow border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-mono-label text-mono-label uppercase text-on-surface-variant">Live Dispatch</span>
              </div>
              <p className="font-title-md text-title-md mb-1 text-on-surface">Water Main Burst</p>
              <p className="font-body-md text-body-md text-on-surface-variant">District 4 • Automated repair team sent 2m ago.</p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-24 bg-surface-container-lowest relative overflow-hidden border-y border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <span className="block font-display-sm text-display-sm text-primary">50k+</span>
              <span className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Issues Resolved</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display-sm text-display-sm text-primary">4.9/5</span>
              <span className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Trust Score</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display-sm text-display-sm text-primary">12ms</span>
              <span className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Triage Latency</span>
            </div>
            <div className="space-y-2">
              <span className="block font-display-sm text-display-sm text-primary">82%</span>
              <span className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Cost Reduction</span>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-display-sm text-display-sm text-on-surface mb-4">Hyper-local governance.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Everything you need to monitor, manage, and scale municipal operations with silicon precision.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Feature Card */}
            <div className="md:col-span-8 glass-card rounded-[32px] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group border-white/10">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl text-primary mb-6" data-icon="auto_awesome">auto_awesome</span>
                <h3 className="font-headline-lg text-headline-lg mb-4 text-on-surface">Neural Dispatcher</h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">Our AI doesn't just listen; it understands intent. It automatically categorizes reports, attaches GPS metadata, and routes tasks to the nearest available crew.</p>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full -mr-20 hidden md:block">
                <div className="w-full h-full bg-cover bg-center rounded-l-[32px] transform group-hover:scale-105 transition-transform duration-700 opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgNffY_cjhRi7lJjLsBb3WN2fXBr61FnKICbsku06YGAxkt71vQNSu2Qx1ndMo-k-H3J99jOnjTXnCydh5_4rIDcC42HT6O84u56_u4Zr2_kbeIA-ErJbc5uRR1r_9Ek01W8EmeB9vSi5e-3mAlk35igalXMz3KcuKqOS2vT_mmwNSktiV2fwmt9Km0tKw8a2IlAAu7s8UFdbS-qvT__26M3Pd5JmI1u_hU9Q6gceVYpad5lIUlqqEEXSWI2AVql1BkKZJyzS69GvX')" }}></div>
              </div>
            </div>
            {/* Tall Side Card */}
            <div className="md:col-span-4 bg-primary text-on-primary rounded-[32px] p-8 flex flex-col justify-between shadow-xl shadow-primary/20">
              <div>
                <span className="material-symbols-outlined text-4xl mb-6" data-icon="shield_with_heart">shield_with_heart</span>
                <h3 className="font-headline-lg text-headline-lg mb-4">Public Safety Protocol</h3>
                <p className="font-body-md text-body-md opacity-90">Real-time threat detection and rapid response synchronization for emergency services.</p>
              </div>
              <button className="w-full py-4 bg-white text-primary rounded-2xl font-label-md text-label-md font-bold mt-8 hover:bg-opacity-90 transition-all">Secure Access</button>
            </div>
            {/* Small Grid Items */}
            <div className="md:col-span-4 glass-card rounded-[32px] p-8 border-white/10">
              <span className="material-symbols-outlined text-3xl text-primary mb-4" data-icon="database">database</span>
              <h4 className="font-title-md text-title-md mb-2 text-on-surface">Immutable Logs</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Every interaction is recorded on a transparent civic ledger for total accountability.</p>
            </div>
            <div className="md:col-span-4 glass-card rounded-[32px] p-8 border-white/10">
              <span className="material-symbols-outlined text-3xl text-primary mb-4" data-icon="language">language</span>
              <h4 className="font-title-md text-title-md mb-2 text-on-surface">Global Scale</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Designed to handle mega-cities with populations over 20 million with zero downtime.</p>
            </div>
            <div className="md:col-span-4 glass-card rounded-[32px] p-8 border-white/10">
              <span className="material-symbols-outlined text-3xl text-primary mb-4" data-icon="monitoring">monitoring</span>
              <h4 className="font-title-md text-title-md mb-2 text-on-surface">Predictive UX</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">We predict infrastructure failure 48 hours before it happens using sonic sensors.</p>
            </div>
          </div>
        </section>

        {/* How It Works Visual Scroller */}
        <section className="py-24 bg-surface-container-low overflow-hidden border-y border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mb-12">
            <h2 className="font-display-sm text-display-sm text-on-surface">System Lifecycle</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">From incident to resolution in four automated steps.</p>
          </div>
          <div className="flex gap-8 overflow-x-auto px-margin-mobile md:px-margin-desktop pb-12 hide-scrollbar snap-x">
            {/* Step 1 */}
            <div className="min-w-[300px] md:min-w-[400px] snap-center">
              <div className="aspect-square rounded-[32px] mb-6 overflow-hidden bg-surface-container-highest p-1">
                <div className="w-full h-full bg-cover bg-center rounded-[28px] opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6K8dGmz5uWPO1hcOIAP_909m9QRF0KbeeRFcaBxSNiAWHyfOL2HOUq3K_-hfg-YU6mhrntCSZ8KWX6helo_XnTmJPrEOzFTsz8Fg-HKCbjP7SMjj3c405MHuwcEYNN1XLZFjyhJnhURCn5rtX4PCGMWne-ZA5B4h6ira-dTUNjCz8YpCoFvjiIxnVgDjDfVy2xsoErqo0gW5HPAuS8_A7NTL3YbGT2QXuhLwPd2AW3xHv-XiAEymH8WdDmNoQYrjDEwq397K8WjKp')" }}></div>
              </div>
              <span className="font-mono-label text-mono-label text-primary mb-2 block">STEP 01</span>
              <h4 className="font-headline-lg text-headline-lg mb-2 text-on-surface">Detection</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Citizens or IoT sensors flag anomalies in the physical world via photo, voice, or telemetry.</p>
            </div>
            {/* Step 2 */}
            <div className="min-w-[300px] md:min-w-[400px] snap-center">
              <div className="aspect-square rounded-[32px] mb-6 overflow-hidden bg-surface-container-highest p-1">
                <div className="w-full h-full bg-cover bg-center rounded-[28px] opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBN5HohR1FlV44mbSAMtCs6VE_xUKqsTp0DV-tQ08niK5nZ7kizboLmzi-qgEH_KpDJWDoq5ROMvqZgNRRzlKcERPd9vXMZX0nluRq-W1ky6FsAW6wGRd-bSi1DVpa6XPS4pkmB2riBvP09jwaOv5VInDso2P4iacWmr3nfmJBN_TDulgEgxWvSG5cn9m2hkq0U7LjM-fWTMnrWgCjITLwlWPKiEjinODGZbR1BXl9-tCSmvFNzYDwpADJidCsugB4ESvW8EiplvVnt')" }}></div>
              </div>
              <span className="font-mono-label text-mono-label text-primary mb-2 block">STEP 02</span>
              <h4 className="font-headline-lg text-headline-lg mb-2 text-on-surface">AI Analysis</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">The Neural Engine triages the priority, identifies the required department, and checks for duplicates.</p>
            </div>
            {/* Step 3 */}
            <div className="min-w-[300px] md:min-w-[400px] snap-center">
              <div className="aspect-square rounded-[32px] mb-6 overflow-hidden bg-surface-container-highest p-1">
                <div className="w-full h-full bg-cover bg-center rounded-[28px] opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKEEWICr7t_JEi86nRSTfGHooCKBcOpnaJq96Kzlo9HlHl0K_gTCj7Zy2F_CEX4_NZfCBi53W0RPk4Nq9ebpDry5kHcAc15P_bqxZ6FJCfbLPlvWZBhYNA1kCFvbBnshsk5KJ2rdOCeSfbhWcoMX6E83Ljzckkrt1xLuqPb1C0yTUnmg0doyuFhNyXo4hqvZmgTNN9j7LmSjUhqJJltlB6zLMt_jhZLZ40JQRClRmb82_At6D_DjtXklPfUMhYrMqoHqex8bgRxM1x')" }}></div>
              </div>
              <span className="font-mono-label text-mono-label text-primary mb-2 block">STEP 03</span>
              <h4 className="font-headline-lg text-headline-lg mb-2 text-on-surface">Dispatch</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Work orders are automatically sent to the nearest crew's mobile terminal with optimal routing data.</p>
            </div>
            {/* Step 4 */}
            <div className="min-w-[300px] md:min-w-[400px] snap-center">
              <div className="aspect-square rounded-[32px] mb-6 overflow-hidden bg-surface-container-highest p-1">
                <div className="w-full h-full bg-cover bg-center rounded-[28px] opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsehDIgA42nZIM61t_y1-H17VHKW8kIxrRoWXdIWqblvNP7kAzGsR1NHvVvLbNfIv2sJoGdBPchMpXiuVc225OJ-tbOKSYPXZmyma5DNnmSLWGTjtG11Bp8MtnJa9Jnz4feGfwGXgc92WZzPGwzkAmkAOKeOE5rlXJuLKqI_GqSSwmuLBtj-efie6jvF1qo-emm9tnTOH_tkEcig9YscVvlj5ribpKrpDaKjYCrJ5l5Zh6ZR7HOFdS4J-Bue31YWTraCdgISmTwoFa')" }}></div>
              </div>
              <span className="font-mono-label text-mono-label text-primary mb-2 block">STEP 04</span>
              <h4 className="font-headline-lg text-headline-lg mb-2 text-on-surface">Feedback Loop</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Citizens receive a live notification once resolved, closing the loop with high-trust transparency.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="font-display-lg text-display-lg text-on-surface">Modernize your city today.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Join 45+ municipalities already running on CivicPulse AI. Reduce overhead by 40% and increase citizen satisfaction by 3x.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/app" className="bg-primary text-on-primary px-10 py-5 rounded-full font-title-md text-title-md hover:scale-105 transition-transform shadow-xl shadow-primary/30">Book a Demo</Link>
              <button className="border border-outline-variant/50 text-on-surface px-10 py-5 rounded-full font-title-md text-title-md hover:bg-surface-container transition-colors">Speak to an Expert</button>
            </div>
          </div>
          {/* Atmospheric glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface text-on-surface border-t border-outline-variant/20 pt-20 pb-24 md:pb-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl" data-icon="grid_view">grid_view</span>
              <span className="font-display-sm text-display-sm tracking-tighter text-on-surface">CivicPulse AI</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">The decentralized operating system for the cities of tomorrow. Building trust through algorithmic transparency.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-on-surface-variant" href="#">
                <span className="material-symbols-outlined text-[20px]" data-icon="share">share</span>
              </a>
              <a className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-on-surface-variant" href="#">
                <span className="material-symbols-outlined text-[20px]" data-icon="public">public</span>
              </a>
              <a className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-on-surface-variant" href="#">
                <span className="material-symbols-outlined text-[20px]" data-icon="podcasts">podcasts</span>
              </a>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Platform</h5>
            <nav className="flex flex-col gap-3">
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Dashboard</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Civic Map</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">AI API</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Integrations</a>
            </nav>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Resources</h5>
            <nav className="flex flex-col gap-3">
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Whitepaper</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Case Studies</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Security</a>
            </nav>
          </div>
          <div className="md:col-span-4 space-y-4">
            <h5 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Newsletter</h5>
            <p className="font-body-md text-body-md text-on-surface-variant">Get bi-weekly updates on urban AI trends.</p>
            <div className="flex gap-2">
              <input className="bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 flex-1 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50" placeholder="gov@city.edu" type="email" />
              <button className="bg-on-background text-on-primary-fixed px-6 py-2 rounded-full font-label-md text-label-md hover:bg-primary transition-colors">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/10 text-on-surface-variant font-label-md text-label-md gap-4">
          <p>© 2024 CivicPulse AI. All Rights Reserved. Built for Progress.</p>
          <div className="flex gap-8">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40 hidden md:flex">
        <button className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border border-white/10">
          <span className="material-symbols-outlined text-3xl" data-icon="support_agent">support_agent</span>
          <span className="absolute right-full mr-4 bg-surface-container-high text-on-surface border border-outline-variant/30 px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">AI Assistant</span>
        </button>
      </div>
    </div>
  );
};

export default Landing;
