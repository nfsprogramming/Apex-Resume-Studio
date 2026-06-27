import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';

const ResumeIntelligenceSuite = () => {
  const { selectedFile } = useResume();
  const [activeTab, setActiveTab] = useState('authenticity');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (selectedFile && !hasFetched && !loading) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/intelligence-suite`, {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAnalysisData(data);
          } else {
            setError(data.detail || 'Failed to analyze resume');
          }
        })
        .catch(err => {
          setError(err.message || 'Network error');
        })
        .finally(() => {
          setLoading(false);
          setHasFetched(true);
        });
    }
  }, [selectedFile, hasFetched, loading]);

  const renderAuthenticityTab = () => {
    const data = analysisData?.authenticity;
    if (!data) return null;

    const isHighRisk = data.score < 60;
    const colorClass = isHighRisk ? 'rose' : data.score > 85 ? 'emerald' : 'yellow';

    return (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-100">Authenticity & Red Flag Detector</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1" data-purpose="score-display">
            <p className="text-slate-500 text-sm font-medium uppercase mb-2">Trust Score</p>
            <div className="flex items-baseline space-x-1">
              <span className={`text-6xl font-bold text-${colorClass}-400`}>{data.score}</span>
              <span className="text-2xl font-bold text-slate-500">/100</span>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${colorClass}-500/10 text-${colorClass}-500`}>
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"></path></svg>
                {data.flags.length > 0 ? '-Risk' : '+Verified'}
              </span>
            </div>
            <p className="mt-6 text-sm text-slate-400">Verdict: <span className="text-slate-300 font-semibold">{data.verdict}</span></p>
          </div>
          
          <div className="col-span-2" data-purpose="red-flags">
            <div className="bg-rose-900/10 border border-rose-900/30 rounded-lg p-6 h-full">
              <div className="flex items-center text-rose-500 font-semibold mb-4">
                <span className="mr-3">🚩</span>
                Potential Issues Detected ({data.flags.length}):
              </div>
              {data.flags.length > 0 ? (
                <ul className="list-disc list-inside space-y-3 text-slate-300 text-sm">
                  {data.flags.map((flag, idx) => (
                    <li key={idx} className="leading-relaxed">{flag}</li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center text-emerald-400 mt-4">
                  <span className="material-symbols-outlined mr-2">check_circle</span>
                  No major red flags detected. Your resume appears authentic and metrics-driven.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-sky-950/20 border border-sky-800/30 rounded-lg p-4 flex items-start space-x-3">
          <div className="bg-sky-500 text-white rounded p-1 text-[10px] font-bold mt-0.5">i</div>
          <p className="text-sm text-sky-400/80 font-mono tracking-tight">
            note: This is an automated heuristic check by Apex Resume Studio. Always verify with human review.
          </p>
        </div>
      </div>
    );
  };

  const renderSoftSkillsTab = () => {
    const data = analysisData?.soft_skills;
    if (!data) return null;

    const categories = Object.keys(data).filter(k => k !== 'ToneAnalysis');
    const tone = data.ToneAnalysis;

    return (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-100">Soft Skills & Tone Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-medium text-slate-300 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-cyan-400">psychology</span>
              Detected Soft Skills
            </h3>
            <div className="space-y-6">
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-200">{cat}</span>
                    <span className={`text-xs font-bold ${data[cat].level === 'High' ? 'text-emerald-400' : data[cat].level === 'Medium' ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {data[cat].level}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${data[cat].level === 'High' ? 'bg-emerald-500' : data[cat].level === 'Medium' ? 'bg-yellow-500' : 'bg-slate-500'}`} 
                      style={{ width: `${data[cat].score}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap gap-1">
                    {data[cat].evidence.length > 0 ? data[cat].evidence.map((ev, i) => (
                      <span key={i} className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">{ev}</span>
                    )) : <span className="text-slate-500 italic">No strong evidence detected</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-medium text-slate-300 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-purple-400">mood</span>
              Tone & Writing Style
            </h3>
            
            <div className="space-y-8">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold">Overall Sentiment</p>
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold ${tone.Sentiment.includes('Positive') ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {tone.Sentiment}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">(Score: {tone.RawSentiment})</div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-semibold">Writing Style</p>
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold ${tone.Style === 'Objective' ? 'text-cyan-400' : tone.Style === 'Balanced' ? 'text-blue-400' : 'text-orange-400'}`}>
                    {tone.Style}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">(Subj: {tone.RawSubjectivity})</div>
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {tone.Style === 'Objective' 
                    ? "Great! Objective language is preferred in resumes. It relies on facts and metrics rather than opinions." 
                    : "Caution: Subjective language found. Try replacing opinionated words with concrete facts and numbers."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHeatmapTab = () => {
    const data = analysisData?.heatmap;
    if (!data || data.length === 0) return null;

    return (
      <div className="space-y-8 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-100">Structural Heatmap</h2>
        <p className="text-slate-400 text-sm max-w-2xl">This heatmap analyzes the density of action verbs and quantifiable metrics across different sections of your resume. Darker/higher scores indicate stronger, more impactful sections.</p>
        
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700">
                  <th className="p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Section</th>
                  <th className="p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider text-right">Word Count</th>
                  <th className="p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider text-right">Action Density</th>
                  <th className="p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider text-right">Metrics Found</th>
                  <th className="p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider text-right">Strength Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {data.map((row, idx) => {
                  // Calculate a color intensity based on Strength Score
                  const intensity = Math.min(row['Strength Score'] / 100, 1);
                  const bgColor = `rgba(16, 185, 129, ${intensity * 0.3})`; // Emerald based
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-700/30 transition-colors" style={{ backgroundColor: bgColor }}>
                      <td className="p-4 text-white font-medium">{row.Section}</td>
                      <td className="p-4 text-slate-300 text-right">{row['Word Count']}</td>
                      <td className="p-4 text-slate-300 text-right">{row['Action Density']}%</td>
                      <td className="p-4 text-slate-300 text-right">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${row['Quantifiable Data'] > 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700 text-slate-400'}`}>
                          {row['Quantifiable Data']}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end">
                          <span className="text-white font-bold mr-2">{row['Strength Score']}</span>
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${Math.min(row['Strength Score'], 100)}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="px-10 py-12 text-center" data-purpose="hero-section">
        <div className="inline-block mb-4 text-2xl">🧠</div>
        <h1 className="text-5xl font-bold glow-text text-cyan-400 tracking-tight mb-4">Apex Resume Studio</h1>
        <p className="text-xl text-slate-400 font-light">Advanced analytics: Authenticity, Soft Skills, and Structure.</p>
      </div>

      <div className="px-10 pb-20 max-w-7xl mx-auto">
        {!selectedFile ? (
           <div className="w-full max-w-2xl mx-auto bg-yellow-900/30 border-l-4 border-yellow-600 rounded-md p-6 flex flex-col justify-center mt-10">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-yellow-500 mr-3 text-2xl">warning</span>
              <p className="text-yellow-400 text-xl font-semibold">Please upload a resume on the Dashboard first.</p>
            </div>
            <p className="mt-3 text-yellow-200/70 ml-9">We need to deeply analyze your resume to provide intelligence metrics.</p>
            <Link to="/dashboard" className="mt-5 ml-9 inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-bold transition-colors max-w-max">
              Go to Dashboard
            </Link>
          </div>
        ) : loading ? (
          <div className="w-full bg-deep-card border border-slate-800 rounded-xl p-16 flex flex-col items-center justify-center shadow-2xl mt-10">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Running Advanced Analytics...</h2>
            <p className="text-slate-400 text-center max-w-md">Scanning for authenticity flags, mapping soft skills, and generating structural heatmaps.</p>
          </div>
        ) : error ? (
           <div className="w-full max-w-2xl mx-auto bg-red-900/30 border-l-4 border-red-600 rounded-md p-6 mt-10">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-red-500 mr-3 text-2xl">error</span>
              <p className="text-red-400 text-xl font-semibold">Error analyzing resume: {error}</p>
            </div>
          </div>
        ) : analysisData && (
          <>
            {/* Tabs Navigation */}
            <div className="flex items-center space-x-8 border-b border-slate-800 mb-10" data-purpose="tabs">
              <button 
                onClick={() => setActiveTab('authenticity')}
                className={`pb-4 flex items-center space-x-2 text-sm font-medium transition-colors ${activeTab === 'authenticity' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-lg">⚠️</span>
                <span>Authenticity Check</span>
              </button>
              <button 
                onClick={() => setActiveTab('soft_skills')}
                className={`pb-4 flex items-center space-x-2 text-sm font-medium transition-colors ${activeTab === 'soft_skills' ? 'border-b-2 border-cyan-500 text-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-lg">🧠</span>
                <span>Soft Skills</span>
              </button>
              <button 
                onClick={() => setActiveTab('heatmap')}
                className={`pb-4 flex items-center space-x-2 text-sm font-medium transition-colors ${activeTab === 'heatmap' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-lg">🔥</span>
                <span>Heatmap & Structure</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'authenticity' && renderAuthenticityTab()}
              {activeTab === 'soft_skills' && renderSoftSkillsTab()}
              {activeTab === 'heatmap' && renderHeatmapTab()}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ResumeIntelligenceSuite;
