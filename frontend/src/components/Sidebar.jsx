import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
<aside className="w-64 bg-sidebar-bg border-r border-slate-800 flex flex-col h-full overflow-y-auto" data-purpose="main-sidebar">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800">
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-electric-cyan text-3xl">psychology</span>
            <span className="text-white font-bold text-lg tracking-widest">APEX</span>
          </Link>
        </div>
        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1" data-purpose="sidebar-nav">
          <Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-800" to="/dashboard">
            <span className="material-symbols-outlined text-slate-400 mr-3 group-hover:text-electric-cyan transition-colors" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>home</span> 
            Dashboard
          </Link>
          <Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-800" to="/deep-analysis"><span className="material-symbols-outlined text-electric-cyan mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>analytics</span> Resume Analysis</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/jd-fetcher"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>search</span> JD Fetcher</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/resume-optimizer"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>auto_fix_high</span> Resume Optimizer</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/project-recommendations"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>lightbulb</span> Project Ideas</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/learning-path"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>school</span> Learning Path</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/interview-generator"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>forum</span> Interview Prep</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/intelligence"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>psychology</span> Resume Intelligence</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/github-analyzer"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>code</span> GitHub Portfolio</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/student-coach"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>person_pin</span> Student Coach</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/linkedin-sync"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>sync</span> LinkedIn Sync</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/ats-simulator"><span className="material-symbols-outlined text-slate-400 mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>terminal</span> ATS Simulator</Link><Link className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800" to="/apex-studio"><span className="material-symbols-outlined text-electric-cyan mr-3" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "20px" }}>analytics</span> Apex Studio</Link></nav>
      </aside>
  );
};

export default Sidebar;
