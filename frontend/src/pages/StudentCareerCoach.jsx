import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';

const StudentCareerCoach = () => {
  const { selectedFile } = useResume();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [auditData, setAuditData] = useState(null);

  const handleRunAudit = async () => {
    if (!selectedFile) {
      setError('Please upload a resume first.');
      return;
    }

    setLoading(true);
    setError('');
    setAuditData(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student-audit`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAuditData(data.data);
      } else {
        setError(data.detail || 'Failed to run student audit.');
      }
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="flex-1 p-8 lg:p-16 max-w-6xl w-full mx-auto" data-purpose="student-coach-main">
        {/* Title Block */}
        <div className="flex items-center space-x-6 mb-8" data-purpose="hero-header">
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl shadow-accent-blue/10">
            <span className="text-5xl">🎓</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white italic text-glow">
            Apex Resume Studio
          </h1>
        </div>

        <h2 className="text-2xl md:text-3xl font-medium text-slate-300 mb-10">
          Optimized analysis for Freshers & Interns.
        </h2>

        {/* Action Area */}
        {!selectedFile ? (
           <div className="w-full bg-yellow-900/30 border-l-4 border-yellow-600 rounded-md p-6 flex flex-col justify-center mt-10">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-yellow-500 mr-3 text-2xl">warning</span>
              <p className="text-yellow-400 text-xl font-semibold">Please upload a resume on the Dashboard first.</p>
            </div>
            <p className="mt-3 text-yellow-200/70 ml-9">We need to deeply analyze your resume to provide intelligence metrics.</p>
            <Link to="/dashboard" className="mt-5 ml-9 inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-bold transition-colors max-w-max">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-12">
            <button 
              onClick={handleRunAudit}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 hover:border-accent-blue/50 text-slate-300 font-bold uppercase tracking-[0.2em] rounded-xl shadow-2xl transition-all hover:scale-[1.02] hover:shadow-accent-blue/10 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center" 
              data-purpose="run-audit-button" 
              type="button"
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin mr-3">refresh</span> Running Audit...</>
              ) : (
                'Run Student Audit'
              )}
            </button>
            
            {error && (
              <div className="mt-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-300 rounded-md max-w-2xl">
                <span className="font-semibold mr-2">Error:</span> {error}
              </div>
            )}
          </div>
        )}

        {/* Results Area */}
        {auditData && !loading && (
          <div className="mt-16 animate-fade-in space-y-10">
            
            {/* Score & Verdict Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
              
              <div className="flex flex-col mb-6 md:mb-0">
                <h3 className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2">Fresher Score</h3>
                <div className="flex items-baseline space-x-2">
                  <span className={`text-6xl font-black ${auditData.score > 80 ? 'text-emerald-400' : auditData.score > 50 ? 'text-yellow-400' : 'text-rose-400'}`}>
                    {auditData.score}
                  </span>
                  <span className="text-2xl text-slate-500 font-bold">/ 100</span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <h3 className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2">Verdict</h3>
                <div className={`text-3xl font-bold ${auditData.score > 80 ? 'text-emerald-400' : auditData.score > 50 ? 'text-yellow-400' : 'text-rose-400'}`}>
                  {auditData.verdict}
                </div>
              </div>
            </div>

            {/* Feedback List */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center">
                <span className="material-symbols-outlined mr-3 text-accent-blue text-3xl">checklist</span>
                Detailed Audit Feedback
              </h3>
              
              <ul className="space-y-6">
                {auditData.feedback.map((item, idx) => {
                  let icon = 'info';
                  let iconColor = 'text-blue-400';
                  let bgColor = 'bg-blue-900/20 border-blue-800/30';
                  
                  if (item.includes('Excellent') || item.includes('included') || item.includes('found') || item.includes('detected')) {
                    icon = 'check_circle';
                    iconColor = 'text-emerald-400';
                    bgColor = 'bg-emerald-900/20 border-emerald-800/30';
                  } else if (item.includes('weak or missing') || item.includes('No internship keywords')) {
                    icon = 'warning';
                    iconColor = 'text-rose-400';
                    bgColor = 'bg-rose-900/20 border-rose-800/30';
                  } else if (item.includes('Consider adding') || item.includes('Add a Certifications') || item.includes('great soft-skill indicator')) {
                    icon = 'lightbulb';
                    iconColor = 'text-yellow-400';
                    bgColor = 'bg-yellow-900/20 border-yellow-800/30';
                  }

                  return (
                    <li key={idx} className={`flex items-start p-5 rounded-xl border ${bgColor} transition-colors hover:bg-opacity-40`}>
                      <span className={`material-symbols-outlined mr-4 ${iconColor} text-2xl flex-shrink-0`}>{icon}</span>
                      <p className="text-slate-300 text-lg leading-relaxed">{item}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
            
          </div>
        )}

      </section>
    </>
  );
};

export default StudentCareerCoach;
