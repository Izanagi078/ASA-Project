"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { 
  Activity, Upload, Database, Code, FileText, 
  Plus, Settings, GitCommit, Layers, ChevronRight, BarChart 
} from "lucide-react";

// Magical Glitter Trail Component
const GlitterTrail = () => {
  const [particles, setParticles] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  
  useEffect(() => {
    let id = 0;
    const colors = ["bg-cyan-300", "bg-purple-400", "bg-fuchsia-400", "bg-blue-300"];
    
    // Throttle particle creation slightly to avoid hundreds of DOM nodes spanning instantly
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 15) return; // spawn roughly every 15ms at most
      lastTime = now;

      // Random jitter for the glitter effect
      const jitterX = (Math.random() - 0.5) * 20;
      const jitterY = (Math.random() - 0.5) * 20;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newParticle = { 
        id: id++, 
        x: e.clientX + jitterX, 
        y: e.clientY + jitterY,
        color: randomColor
      };
      
      setParticles(prev => [...prev.slice(-30), newParticle]); // keep max 30 for performance
      
      // Auto-remove glitters
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 700);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: Math.random() * 1.5 + 0.5, x: p.x, y: p.y, rotate: 0 }}
            animate={{ opacity: 0, scale: 0, x: p.x, y: p.y + 40, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`absolute w-1.5 h-1.5 ${p.color} rounded-sm shadow-[0_0_15px_currentColor]`}
            style={{ left: 0, top: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"upload" | "manual" | "results">("upload");
  const [manualSubTab, setManualSubTab] = useState<"nodes" | "members">("nodes");
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("http://localhost:8000/api/analyze/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        setResults(data.results);
        setActiveTab("results");
      } else {
        alert(data.error || "Analysis failed");
      }
    } catch (err) {
      alert("Error connecting to Engine API");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3D Parallax Tilt Effect for the main container
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-300, 300], [5, -5]); // Invert Y for correct tilt
  const rotateY = useTransform(cardX, [-400, 400], [-5, 5]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate relative position to screen center for 3D tilt
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      cardX.set(e.clientX - centerX);
      cardY.set(e.clientY - centerY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cardX, cardY]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#030014] perspective-[2000px]">
      <GlitterTrail />

      {/* Static deep purple ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Navigation / Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#c084fc] to-[#7e22ce] rounded-xl text-white shadow-[0_0_25px_rgba(168,85,247,0.6)]">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">CIL3060</h1>
            <p className="text-[10px] text-purple-300 font-bold tracking-widest uppercase opacity-80">Structural Engine</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.05] p-1.5 rounded-full border border-white/[0.1] shadow-inner backdrop-blur-md">
          {(["upload", "manual", "results"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === tab 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/50" 
                  : "text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div>
          <button className="px-5 py-2.5 rounded-full font-bold text-sm bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/50 text-purple-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
            <Code size={16} />
            <span className="hidden sm:inline">Connect Backend</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center relative z-10 preserve-3d">
        {/* Interactive Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-900/40 border border-purple-400/40 text-xs font-black text-purple-100 mb-8 shadow-[0_0_25px_rgba(168,85,247,0.5)] backdrop-blur-md">
             <span className="relative flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]"></span>
             </span>
             Direct Stiffness Method Core
          </div>
          <h2 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            Elastic Structural <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300 drop-shadow-[0_0_40px_rgba(192,132,252,0.6)]">Analysis Engine</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-medium">
            The ultimate generic solver for plane frames. Define your geometry via elegant forms or direct file upload to compute intricate displacements and forces.
          </p>
        </motion.div>

        {/* Dynamic Interactive Section - NOW WITH 3D TILT */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} // Antigravity ease curve
            // The magic 3D parallax effect
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full max-w-5xl bg-black/40 backdrop-blur-[40px] rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
            {/* Glossy top edge highlight for realism */}
            <div className="absolute inset-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent pointer-events-none"></div>

            {/* TAB: UPLOAD */}
            {activeTab === "upload" && (
              <div className="relative z-10 flex flex-col items-center justify-center py-24 border-2 border-dashed border-purple-500/30 rounded-3xl bg-black/30 hover:bg-purple-900/20 hover:border-purple-400/60 transition-all duration-500 cursor-pointer shadow-inner">
                <div className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-500">
                  <Upload size={40} className="text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.8)]" />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-white tracking-tight drop-shadow-md">Upload Geometry Data</h3>
                <p className="text-zinc-300 mb-10 text-center max-w-md text-lg font-medium">
                  Drag and drop your <span className="text-purple-300 font-bold">.txt</span> or <span className="text-purple-300 font-bold">.xlsx</span> files containing nodal and member geometry.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 text-white border border-white/20 font-bold hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all">
                    <FileText size={20} className="text-purple-300" />
                    Browse .TXT
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 text-purple-100 border border-purple-400/40 font-bold hover:from-purple-500/40 hover:to-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(192,132,252,0.5)] transition-all">
                    <Database size={20} className="text-fuchsia-300" />
                    {isAnalyzing ? "Analyzing..." : "Browse .XLSX"}
                  </button>
                  <input type="file" accept=".xlsx" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
              </div>
            )}

            {/* TAB: MANUAL */}
            {activeTab === "manual" && (
              <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 shadow-sm tracking-tight">Geometry Definition</h3>
                    <p className="text-sm text-zinc-300 font-medium">Configure nodal coordinates and member connectivity manually.</p>
                  </div>
                  <div className="flex bg-black/60 p-1.5 rounded-xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                    <button 
                      onClick={() => setManualSubTab("nodes")}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${manualSubTab === "nodes" ? "bg-purple-500/30 text-white border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "text-zinc-400 hover:text-white"}`}
                    >
                      Nodal Data
                    </button>
                    <button 
                      onClick={() => setManualSubTab("members")}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${manualSubTab === "members" ? "bg-fuchsia-500/30 text-white border border-fuchsia-400/40 shadow-[0_0_15px_rgba(217,70,239,0.4)]" : "text-zinc-400 hover:text-white"}`}
                    >
                      Member Data
                    </button>
                  </div>
                </div>

                {manualSubTab === "nodes" && (
                   <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} transition={{duration: 0.4}} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                       <div className="bg-black/40 border border-white/10 p-5 rounded-2xl border-l-[4px] border-l-purple-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-purple-500/50 hover:shadow-[0_10px_40px_rgba(168,85,247,0.2)] transition-all backdrop-blur-md">
                         <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2 drop-shadow-md"><GitCommit size={18} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]"/> Node ID 1</h4>
                         <div className="space-y-3 relative z-20">
                           <input type="text" placeholder="X Coord" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/70 focus:bg-purple-900/20 transition-all font-mono shadow-inner" />
                           <input type="text" placeholder="Y Coord" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/70 focus:bg-purple-900/20 transition-all font-mono shadow-inner" />
                           <select className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-400/70 focus:bg-purple-900/20 transition-all font-medium shadow-inner">
                             <option className="bg-zinc-900">Fixed</option>
                             <option className="bg-zinc-900">Pinned</option>
                             <option className="bg-zinc-900">Roller</option>
                             <option className="bg-zinc-900">Free</option>
                           </select>
                           <input type="text" placeholder="Force (Fx, Fy, Mz)" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/70 focus:bg-purple-900/20 transition-all font-mono shadow-inner" />
                         </div>
                       </div>
                       
                       {/* Add Node Button */}
                       <div className="border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:text-purple-200 hover:border-purple-400/60 transition-all cursor-pointer min-h-[280px] bg-black/20 hover:bg-purple-900/20 hover:shadow-[inset_0_0_30px_rgba(168,85,247,0.2)]">
                         <div className="p-4 rounded-full bg-white/5 mb-3">
                           <Plus size={28} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]" />
                         </div>
                         <span className="font-extrabold text-sm tracking-widest uppercase">Add Node</span>
                       </div>
                     </div>
                   </motion.div>
                )}

                {manualSubTab === "members" && (
                   <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} transition={{duration: 0.4}} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                       <div className="bg-black/40 border border-white/10 p-5 rounded-2xl border-l-[4px] border-l-fuchsia-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-fuchsia-500/50 hover:shadow-[0_10px_40px_rgba(217,70,239,0.2)] transition-all backdrop-blur-md">
                         <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2 drop-shadow-md"><Layers size={18} className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]"/> Member ID 1</h4>
                         <div className="space-y-4">
                           <div className="flex items-center gap-2">
                             <input type="text" placeholder="Start Node" className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner" />
                             <ChevronRight size={16} className="text-zinc-500"/>
                             <input type="text" placeholder="End Node" className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner" />
                           </div>
                           <div className="flex gap-2">
                             <input type="text" placeholder="Area (A)" className="w-1/2 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner" />
                             <input type="text" placeholder="Inertia (I)" className="w-1/2 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner" />
                           </div>
                           <input type="text" placeholder="Elasticity (E)" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-mono shadow-inner" />
                           <select className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-fuchsia-400/70 focus:bg-fuchsia-900/20 transition-all font-medium shadow-inner">
                             <option className="bg-zinc-900">No Load</option>
                             <option className="bg-zinc-900">Point Load</option>
                             <option className="bg-zinc-900">UDL</option>
                             <option className="bg-zinc-900">UVL</option>
                           </select>
                         </div>
                       </div>
                       
                       <div className="border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:text-fuchsia-200 hover:border-fuchsia-400/60 transition-all cursor-pointer min-h-[320px] bg-black/20 hover:bg-fuchsia-900/20 hover:shadow-[inset_0_0_30px_rgba(217,70,239,0.2)]">
                         <div className="p-4 rounded-full bg-white/5 mb-3">
                           <Plus size={28} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]" />
                         </div>
                         <span className="font-extrabold text-sm tracking-widest uppercase">Add Member</span>
                       </div>
                     </div>
                   </motion.div>
                )}

                <div className="mt-8 flex justify-end">
                  <button className="px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 bg-size-200 hover:bg-pos-100 text-white font-extrabold shadow-[0_5px_25px_rgba(192,132,252,0.6)] hover:shadow-[0_5px_35px_rgba(192,132,252,0.8)] transition-all transform hover:-translate-y-1">
                    Execute Analysis Mode
                  </button>
                </div>
              </div>
            )}

            {/* TAB: RESULTS */}
            {activeTab === "results" && (
              <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-3 tracking-tight">
                      <BarChart size={32} className="text-cyan-400 p-1.5 bg-cyan-500/20 rounded border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.4)]"/> 
                      Analysis Results
                    </h3>
                    <p className="text-sm text-zinc-300 font-medium">Post-processing output from the direct stiffness method engine.</p>
                  </div>
                  <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2 shadow-lg backdrop-blur-md">
                    <Settings size={18} /> Export Results
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Mocked Displacements */}
                  <div className="bg-black/50 p-6 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden hover:border-cyan-500/40 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={100}/></div>
                    <h4 className="text-cyan-300 font-black mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2 drop-shadow-md">
                       <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
                       Node Displacements
                    </h4>
                    <div className="space-y-3 relative z-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {results?.displacements ? Object.keys(results.displacements).map(nodeId => {
                        const d = results.displacements[nodeId];
                        return (
                          <div key={nodeId} className="flex justify-between items-start text-xs py-2 border-b border-white/[0.05]">
                            <span className="text-zinc-300 font-bold">Node {nodeId}</span>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-cyan-100 font-mono bg-cyan-900/40 px-1.5 rounded">dx: {d.dx.toExponential(4)}</span>
                              <span className="text-cyan-100 font-mono bg-cyan-900/40 px-1.5 rounded">dy: {d.dy.toExponential(4)}</span>
                              <span className="text-cyan-100 font-mono bg-cyan-900/40 px-1.5 rounded">θz: {d.theta.toExponential(4)}</span>
                            </div>
                          </div>
                        )
                      }) : <div className="text-zinc-500 text-sm">No data / Wait</div>}
                    </div>
                  </div>

                  {/* Mocked Reactions */}
                  <div className="bg-black/50 p-6 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden hover:border-purple-500/40 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><GitCommit size={100}/></div>
                    <h4 className="text-purple-300 font-black mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,1)]"></span>
                      Support Reactions
                    </h4>
                    <div className="space-y-3 relative z-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {results?.reactions ? Object.keys(results.reactions).map(nodeId => {
                        const r = results.reactions[nodeId];
                        return (
                          <div key={nodeId} className="flex justify-between items-start text-xs py-2 border-b border-white/[0.05]">
                            <span className="text-zinc-300 font-bold">Node {nodeId}</span>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-emerald-300 font-mono bg-emerald-900/40 px-1.5 rounded">Rx: {r.Fx.toFixed(2)}</span>
                              <span className="text-rose-300 font-mono bg-rose-900/40 px-1.5 rounded">Ry: {r.Fy.toFixed(2)}</span>
                              <span className="text-purple-300 font-mono bg-purple-900/40 px-1.5 rounded">Mz: {r.Mz.toFixed(2)}</span>
                            </div>
                          </div>
                        )
                      }) : <div className="text-zinc-500 text-sm">No data / Wait</div>}
                    </div>
                  </div>

                  {/* Mocked Member Forces */}
                  <div className="bg-black/50 p-6 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden hover:border-fuchsia-500/40 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Layers size={100}/></div>
                    <h4 className="text-fuchsia-300 font-black mb-5 uppercase tracking-widest text-[11px] flex items-center gap-2 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,1)]"></span>
                      Member End Forces
                    </h4>
                    <div className="space-y-3 relative z-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar focus:outline-none">
                      {results?.member_forces ? Object.keys(results.member_forces).map(mId => {
                        const f = results.member_forces[mId];
                        return (
                          <div key={mId} className="flex flex-col gap-2 text-[10px] py-3 border-b border-white/[0.05]">
                            <span className="text-zinc-300 font-bold text-xs border-b border-white/10 pb-1 w-full">Mem {mId}</span>
                            <div className="grid grid-cols-2 gap-2 w-full">
                              <div className="flex flex-col gap-1 items-start bg-black/40 p-1.5 rounded">
                                <span className="text-white font-mono">N1: {f.Axial_1.toFixed(2)}</span>
                                <span className="text-white font-mono">V1: {f.Shear_1.toFixed(2)}</span>
                                <span className="text-yellow-100 font-mono">M1: {f.Moment_1.toFixed(2)}</span>
                              </div>
                              <div className="flex flex-col gap-1 items-end bg-black/40 p-1.5 rounded text-right">
                                <span className="text-white font-mono">N2: {f.Axial_2.toFixed(2)}</span>
                                <span className="text-white font-mono">V2: {f.Shear_2.toFixed(2)}</span>
                                <span className="text-yellow-100 font-mono">M2: {f.Moment_2.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }) : <div className="text-zinc-500 text-sm">No data / Wait</div>}
                    </div>
                  </div>
                </div>

                <div className="mt-8 w-full h-64 rounded-3xl border border-white/20 bg-black/60 flex items-center justify-center text-zinc-600 relative overflow-hidden shadow-[inset_0_5px_30px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  {/* Intense glowing lines for the visualizer mockup */}
                  <div className="absolute left-1/4 bottom-1/4 w-40 h-1 bg-cyan-400/80 rotate-45 blur-[3px] shadow-[0_0_20px_rgba(34,211,238,1)]"></div>
                  <div className="absolute right-1/4 top-1/4 w-48 h-1 bg-purple-500/80 -rotate-12 blur-[4px] shadow-[0_0_20px_rgba(168,85,247,1)]"></div>
                  <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-fuchsia-400 rounded-full mix-blend-screen blur-[8px] animate-pulse"></div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-3 bg-black/60 py-3 px-8 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
                    <p className="font-black flex items-center gap-2 text-white text-sm tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      <Activity size={18} className="text-purple-400 animate-pulse"/> 
                      3D Frame Visualizer Ready
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
