import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '../context/ResumeContext';

const SmartResumeAiDashboard = () => {
  const [systemStatus, setSystemStatus] = useState({
    ai_engine: "loading...",
    database: "loading...",
    status: "loading...",
    has_nim_key: false
  });
  
  const fileInputRef = useRef(null);
  const { selectedFile, setSelectedFile } = useResume();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/status`)
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(err => console.error("Failed to fetch status:", err));
  }, []);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
{/* Top Header Navigation */}

        {/* Main Content Body */}
        <div className="px-16 pt-8 pb-16 flex-1 flex flex-col max-w-7xl mx-auto w-full">
          {/* BEGIN: Hero Section */}
          <section className="flex flex-col items-center mb-10" data-purpose="hero-section">
            <div className="mb-4">
              {/* Logo Placeholder using IMAGE_36 */}
              <span className="material-symbols-outlined text-6xl text-electric-cyan filter drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">psychology</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight glow-cyan">
              Apex Resume Studio
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light tracking-wide">
              The Enterprise-Grade Career Assistant
            </p>
          </section>
          {/* END: Hero Section */}
          {/* BEGIN: Middle Dashboard Layout */}
          <section className="flex flex-col gap-6 mb-10" data-purpose="dashboard-grid">
            {/* Welcome Card */}
            <div className="bg-deep-card border border-slate-800 rounded-xl p-8 card-border-glow shadow-2xl flex flex-col justify-center" data-purpose="welcome-card">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                Welcome to Your AI Career Coach
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                This platform integrates advanced AI tools to help you land your dream job. Upload your resume and let our AI engine evaluate it against industry-standard ATS algorithms, fetch live job descriptions, and recommend improvements.
              </p>
              <ul className="space-y-4 mb-8 text-slate-300 font-light">
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-electric-cyan mr-3 text-lg">insights</span>
                  <span className=""><strong className="font-semibold text-white">Deep ATS Insights:</strong> Uncover hidden formatting and keyword issues.</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-electric-cyan mr-3 text-lg">travel_explore</span>
                  <span className=""><strong className="font-semibold text-white">Live JD Fetcher:</strong> Automatically scrape job descriptions from LinkedIn.</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-electric-cyan mr-3 text-lg">edit_document</span>
                  <span className=""><strong className="font-semibold text-white">AI Rewrite:</strong> Instantly tailor your experience bullets for specific roles.</span>
                </li>
              </ul>
            </div>
          </section>
          {/* END: Middle Dashboard Layout */}
          {/* BEGIN: Upload Section */}
          <section data-purpose="upload-section">
            <div className="flex items-center mb-4">
              <span className="material-symbols-outlined text-accent-yellow mr-2">folder_open</span>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Master Resume</h4>
            </div>
            <div 
              className="bg-slate-900/20 border-2 border-dashed border-slate-700 hover:border-electric-cyan rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-inner"
              onClick={handleBrowseClick}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.docx,.doc,.txt"
              />
              <span className="material-symbols-outlined text-5xl text-slate-600 group-hover:text-electric-cyan mb-4 transition-colors">
                {selectedFile ? 'task' : 'cloud_upload'}
              </span>
              <h5 className="text-white font-semibold text-xl mb-2">
                {selectedFile ? selectedFile.name : 'Drag & Drop your resume here'}
              </h5>
              <p className="text-slate-400 text-sm mb-6">
                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Supported formats: PDF, DOCX, TXT (Max 20MB)'}
              </p>
              <button 
                className="bg-transparent border border-electric-cyan text-electric-cyan group-hover:bg-electric-cyan group-hover:text-midnight-slate font-bold px-8 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
              >
                {selectedFile ? 'Change File' : 'Browse Files'}
              </button>
            </div>
          </section>
          {/* END: Upload Section */}
        </div>
        {/* Bottom Action Bar / Overlay Element (Floating) */}
    </>
  );
};

export default SmartResumeAiDashboard;
