import React, { useState } from 'react';

import { useResume } from '../context/ResumeContext';

const AiResumeOptimizer = () => {
  const { selectedFile } = useResume();
  const [targetRole, setTargetRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please upload a resume first.');
      return;
    }
    if (!targetRole) {
      setError('Target Role is required.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('target_role', targetRole);
      formData.append('jd_text', jdText);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/optimize-resume`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.detail || 'Optimization failed');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
{/* END: Top Bar */}
{/* BEGIN: Optimizer Content */}
<div className="flex-1 overflow-y-auto px-12 py-10" data-purpose="optimizer-container" id="optimizer-view">
{/* Page Header Section */}
<div className="mb-10">
<h1 className="text-4xl font-bold flex items-center mb-6">
<span className="mr-4 text-5xl">✍️</span>
<span className="text-white glow-text tracking-tight">Apex Resume Studio - Resume Optimizer</span>
</h1>
<p className="text-xl text-slate-400 font-light">
          Tailor your resume for specific roles using Advanced AI from Lumina.
        </p>
</div>

{/* BEGIN: Optimizer Application */}
<div className="max-w-6xl space-y-6" data-purpose="optimizer-app">
  {!selectedFile ? (
    <div className="bg-[#2D2D1B]/40 border border-yellow-700/30 rounded-lg p-4 flex items-center space-x-3">
      <span className="text-yellow-500/80">
        <span className="material-symbols-outlined">warning</span>
      </span>
      <p className="text-yellow-200/70 text-sm font-medium">
        Please upload a resume on the Dashboard first to use this feature.
      </p>
    </div>
  ) : (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
      <form onSubmit={handleOptimize} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Target Role *</label>
          <input 
            type="text" 
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Frontend Developer" 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Job Description (Optional)</label>
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here to extract specific keywords..." 
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors resize-none"
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-900/30 border-l-4 border-red-500 text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
             <><span className="material-symbols-outlined animate-spin">refresh</span><span>Generating AI Optimization...</span></>
          ) : (
             <><span className="material-symbols-outlined">auto_fix_high</span><span>Optimize My Resume</span></>
          )}
        </button>
      </form>
    </div>
  )}
  
  {result && (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <span className="material-symbols-outlined text-emerald-400 mr-2">check_circle</span>
        Optimization Complete
      </h2>
      
      <div className="bg-slate-900 border border-emerald-700/50 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-emerald-400">Tailored Summary</h3>
        </div>
        <div className="p-6 text-slate-300 whitespace-pre-wrap leading-relaxed">
          {result.tailored_summary}
        </div>
      </div>
      
      <div className="bg-slate-900 border border-electric-cyan/50 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-electric-cyan">Rewritten Experience (Optimized for {targetRole})</h3>
        </div>
        <div className="p-6 text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-sm">
          {result.rewritten_experience}
        </div>
      </div>
    </div>
  )}
</div>
{/* END: Optimizer Application */}

</div>
{/* END: Optimizer Content */}
{/* Footer Stats (Simulated) */}
    
    </>
  );
};

export default AiResumeOptimizer;
