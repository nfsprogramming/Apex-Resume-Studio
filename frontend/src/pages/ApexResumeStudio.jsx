import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';

const ApexResumeStudio = () => {
  const { selectedFile } = useResume();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!selectedFile) return;

    const analyzeResume = async () => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analyze-resume`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'Failed to analyze resume');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeResume();
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16">
        <span className="material-symbols-outlined text-6xl text-slate-500 mb-4">upload_file</span>
        <h2 className="text-2xl font-bold text-white mb-2">No Resume Selected</h2>
        <p className="text-slate-400 mb-6">Please upload a resume on the dashboard to view ATS analysis.</p>
        <Link to="/dashboard" className="px-6 py-3 bg-electric-cyan text-midnight-slate font-bold rounded-lg hover:opacity-90 transition-opacity">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16">
        <div className="w-16 h-16 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl text-slate-300">Analyzing Resume with Enterprise ATS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
        <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
        <p className="text-red-400 max-w-lg text-center mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  // Use dynamic data or fallback if data is missing parts
  const score = data?.ats_score || 0;
  const structureStatus = data?.status || "Unknown";
  const foundKeywords = data?.found_keywords || [];
  const missingKeywords = data?.missing_keywords || [];
  const proficiency = data?.proficiency || {};

  return (
    <div className="px-16 pt-8 pb-16 flex-1 flex flex-col max-w-7xl mx-auto w-full">
      <section className="flex flex-col items-center mb-10" data-purpose="hero-section">
        <div className="mb-4">
          <span className="material-symbols-outlined text-6xl text-electric-cyan filter drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">analytics</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight glow-cyan">
          Apex Resume Studio
        </h1>
        <p className="text-lg md:text-xl text-slate-400 font-light tracking-wide">
          ATS Evaluation & Keyword Analysis
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* ATS Score Card */}
        <div className="bg-deep-card border border-slate-800 rounded-xl p-8 card-border-glow shadow-2xl flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-slate-300 uppercase tracking-wider mb-4">ATS Score</h2>
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" className="stroke-current text-slate-800" strokeWidth="12" fill="none" />
              <circle 
                cx="64" cy="64" r="56" 
                className={`stroke-current ${score > 70 ? 'text-green-500' : score > 40 ? 'text-yellow-500' : 'text-red-500'}`} 
                strokeWidth="12" fill="none" 
                strokeDasharray="351.858" 
                strokeDashoffset={351.858 - (351.858 * score) / 100} 
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{score}</span>
              <span className="text-sm text-slate-500">/ 100</span>
            </div>
          </div>
          <p className={`mt-4 font-medium ${score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {score > 70 ? 'Good Match' : score > 40 ? 'Needs Improvement' : 'Critical Issues Found'}
          </p>
        </div>

        {/* Structure Card */}
        <div className="bg-deep-card border border-slate-800 rounded-xl p-8 card-border-glow shadow-2xl flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-slate-300 uppercase tracking-wider mb-4">Structure</h2>
          <span className={`material-symbols-outlined text-5xl mb-4 filter ${structureStatus === 'Passed' ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]' : 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]'}`}>
            {structureStatus === 'Passed' ? 'task_alt' : 'warning'}
          </span>
          <span className="text-3xl font-bold text-white">{structureStatus}</span>
          <p className="mt-4 text-slate-400">
            {structureStatus === 'Passed' ? 'Standard resume sections successfully parsed.' : 'Unable to parse standard resume sections.'}
          </p>
        </div>

        {/* Keywords Card */}
        <div className="bg-deep-card border border-slate-800 rounded-xl p-8 card-border-glow shadow-2xl flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-slate-300 uppercase tracking-wider mb-4">Keywords Found</h2>
          <span className="material-symbols-outlined text-5xl text-electric-cyan mb-4 filter drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            key
          </span>
          <span className="text-5xl font-bold text-electric-cyan glow-cyan">{foundKeywords.length}</span>
          <p className="mt-4 text-slate-400">Total matched keywords</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Found Skills */}
        <div className="bg-deep-card border border-slate-800 rounded-xl p-8 card-border-glow shadow-2xl overflow-y-auto max-h-96">
          <div className="flex items-center mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-deep-card z-10">
            <span className="material-symbols-outlined text-green-400 text-3xl mr-3">check_circle</span>
            <h2 className="text-2xl font-bold text-white">Found Skills</h2>
          </div>
          {foundKeywords.length > 0 ? (
            <ul className="space-y-4">
              {foundKeywords.map((skill, index) => (
                <li key={index} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-3 shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span>
                    <span className="text-slate-200 font-medium">{skill}</span>
                  </div>
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full uppercase tracking-wider">
                    {proficiency[skill] || 'Beginner'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 italic">No specific skills detected.</p>
          )}
        </div>

        {/* Missing Critical Keywords */}
        <div className="bg-deep-card border border-slate-800 rounded-xl p-8 card-border-glow shadow-2xl overflow-y-auto max-h-96">
          <div className="flex items-center mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-deep-card z-10">
            <span className="material-symbols-outlined text-red-500 text-3xl mr-3">cancel</span>
            <h2 className="text-2xl font-bold text-white">Missing Critical Keywords</h2>
          </div>
          {missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {missingKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-red-900/20 border border-red-500/30 text-red-300 rounded-md text-sm font-medium hover:bg-red-900/40 transition-colors"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">No missing critical keywords detected for a standard resume.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApexResumeStudio;
