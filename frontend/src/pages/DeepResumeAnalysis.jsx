import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';

const DeepResumeAnalysis = () => {
  const { selectedFile } = useResume();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedFile && !analysis && !loading && !error) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analyze-resume`, {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAnalysis(data);
          } else {
            setError(data.detail || 'Failed to analyze resume');
          }
        })
        .catch(err => {
          setError(err.message || 'Network error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedFile, analysis, loading, error]);

  return (
    <>
      <div className="px-8 pt-6 max-w-6xl mx-auto w-full">
{/* BEGIN: PageTitle */}
<div className="flex items-center mb-10" data-purpose="page-title-header">
{/* Logo Icon Container */}
<div className="mr-6 flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
<svg fill="white" height="40" viewBox="0 0 24 24" width="40">
<path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"></path>
</svg>
</div>
<h1 className="text-5xl font-extrabold tracking-tight glow-header text-white">Apex Resume Studio</h1>
</div>
{/* END: PageTitle */}
{/* BEGIN: AlertNotifications or Content */}
<div className="space-y-4" data-purpose="content-area">
  {!selectedFile ? (
    <>
      {/* Warning Alert */}
      <div className="w-full bg-yellow-900/30 border-l-4 border-yellow-600 rounded-md p-4 flex items-center" data-purpose="upload-warning">
        <div className="flex-shrink-0 text-yellow-500 mr-3">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <p className="text-yellow-400 text-lg font-semibold">Please upload a resume on the Dashboard first.</p>
      </div>
      {/* Tip Alert */}
      <div className="w-full bg-blue-900/20 border-l-4 border-blue-600 rounded-md p-4 flex items-center" data-purpose="navigation-tip">
        <p className="text-blue-400 text-lg">
          <span className="font-bold">Tip:</span> Go to the <Link to="/dashboard" className="underline hover:text-blue-300">Dashboard</Link> to upload your resume.
        </p>
      </div>
    </>
  ) : loading ? (
    <div className="bg-deep-card border border-slate-800 rounded-xl p-8 card-border-glow shadow-2xl">
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
        <span className="material-symbols-outlined text-electric-cyan mr-3">analytics</span>
        Analyzing: {selectedFile.name}
      </h2>
      <p className="text-slate-400 mb-6 leading-relaxed">
        Our AI is currently running a deep structural analysis on your resume. We are evaluating ATS compatibility, keyword density, and formatting.
      </p>
      <div className="flex items-center space-x-3 text-electric-cyan">
        <span className="material-symbols-outlined animate-spin">refresh</span>
        <span className="font-medium">Generating Insights...</span>
      </div>
    </div>
  ) : error ? (
    <div className="w-full bg-red-900/30 border-l-4 border-red-600 rounded-md p-4 flex items-center">
      <div className="flex-shrink-0 text-red-500 mr-3">
        <span className="material-symbols-outlined">error</span>
      </div>
      <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
    </div>
  ) : analysis ? (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-center items-center">
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase mb-2">ATS Score</p>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {analysis.ats_score.toFixed(0)}/100
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-center items-center">
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase mb-2">Structure</p>
          <div className="text-3xl font-bold text-white">
            {analysis.length_status}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-center items-center">
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase mb-2">Keywords Found</p>
          <div className="text-3xl font-bold text-electric-cyan">
            {analysis.found_keywords.length}
          </div>
        </div>
      </div>
      
      {/* Keywords and Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2 text-emerald-400">check_circle</span>
              Found Skills
           </h3>
           <div className="flex flex-wrap gap-2">
             {analysis.found_keywords.map((kw, i) => (
               <span key={i} className="px-3 py-1 bg-emerald-900/40 text-emerald-300 rounded-full text-sm font-medium border border-emerald-700/50">
                 {kw} <span className="text-emerald-500/80 ml-1 text-xs opacity-75">({analysis.proficiency[kw] || 'Unknown'})</span>
               </span>
             ))}
           </div>
        </div>
        
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2 text-rose-400">cancel</span>
              Missing Critical Keywords
           </h3>
           <div className="flex flex-wrap gap-2">
             {analysis.missing_keywords.map((kw, i) => (
               <span key={i} className="px-3 py-1 bg-rose-900/40 text-rose-300 rounded-full text-sm font-medium border border-rose-700/50">
                 {kw}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  ) : null}
</div>
{/* END: AlertNotifications or Content */}
</div>
{/* Bottom Management Bar */}
    </>
  );
};

export default DeepResumeAnalysis;
