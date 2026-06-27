import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';

const EnterpriseAtsSimulator = () => {
  const { selectedFile } = useResume();
  const [targetCompany, setTargetCompany] = useState('Google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [atsData, setAtsData] = useState(null);

  const companies = [
    { id: 'Google', name: 'Google' },
    { id: 'Meta', name: 'Meta' },
    { id: 'Amazon', name: 'Amazon' },
    { id: 'Microsoft', name: 'Microsoft' },
    { id: 'Apple', name: 'Apple' },
    { id: 'Netflix', name: 'Netflix' },
  ];

  const handleSimulate = async () => {
    if (!selectedFile) {
      setError('Please upload a resume on the Dashboard first.');
      return;
    }

    setLoading(true);
    setError('');
    setAtsData(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('target_company', targetCompany);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ats-simulate`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAtsData(data.data);
      } else {
        setError(data.detail || 'Failed to run simulation.');
      }
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-12 lg:p-20">
        <div className="max-w-4xl mx-auto space-y-10" data-purpose="simulator-form">
          
          {/* Title Section */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight flex items-center gap-4">
              <span className="text-5xl">🏢</span>
              <span className="glow-text bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Apex Resume Studio ATS Simulator
              </span>
            </h1>
            <p className="text-2xl text-slate-400 font-light">
              Test your resume against specific company algorithms with Apex Resume Studio.
            </p>
          </div>

          {!selectedFile ? (
            <div className="w-full bg-yellow-900/30 border-l-4 border-yellow-600 rounded-md p-6 flex flex-col justify-center mt-10">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-yellow-500 mr-3 text-2xl">warning</span>
                <p className="text-yellow-400 text-xl font-semibold">Please upload your resume first.</p>
              </div>
              <p className="mt-3 text-yellow-200/70 ml-9">We need your resume to run the ATS simulation.</p>
              <Link to="/dashboard" className="mt-5 ml-9 inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-bold transition-colors max-w-max">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Selector */}
              <div className="max-w-xl" data-purpose="company-selector-container">
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="company-select">
                  Select Target Company
                </label>
                <div className="relative">
                  <select 
                    id="company-select"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full bg-midnight-900 border border-midnight-700 text-slate-200 rounded-md px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all cursor-pointer text-lg font-medium"
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-900/30 border-l-4 border-red-500 text-red-300 rounded-md max-w-xl">
                  <span className="font-semibold mr-2">Error:</span> {error}
                </div>
              )}

              {/* Action Button */}
              <div data-purpose="action-buttons">
                <button 
                  onClick={handleSimulate}
                  disabled={loading}
                  className="btn-primary w-full md:w-auto min-w-[300px]" 
                  type="button"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin mr-3">refresh</span> Running {targetCompany} Scan...</>
                  ) : (
                    <>Simulate <span className="mx-2 text-white/90">{targetCompany}</span> Scan</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {atsData && !loading && (
            <div className="mt-16 animate-fade-in space-y-10 border-t border-slate-800 pt-12">
              
              {/* ATS Score Header */}
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                
                {/* Score Circle */}
                <div className="flex flex-col items-center justify-center relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="12" />
                    <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" className={`${atsData.score >= 80 ? 'text-emerald-500' : atsData.score >= 50 ? 'text-yellow-500' : 'text-rose-500'} transition-all duration-1000 ease-out`} strokeWidth="12" strokeDasharray="553" strokeDashoffset={553 - (553 * atsData.score) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white tracking-tighter">{atsData.score}</span>
                    <span className="text-slate-400 text-sm font-semibold uppercase tracking-widest mt-1">Score</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-slate-200">
                    {atsData.status === 'likely_to_pass' ? 'Likely to Pass ATS' : atsData.status === 'manual_review' ? 'Flagged for Manual Review' : 'High Risk of Auto-Rejection'}
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Based on <span className="text-blue-400 font-semibold">{atsData.company}</span>'s typical ATS screening algorithms, your resume scored a {atsData.score}/100.
                  </p>
                  <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-[18px]">format_align_left</span>
                    Word Count Check: <strong className={atsData.length_check === 'Good' ? 'text-emerald-400' : 'text-yellow-400'}>{atsData.length_check}</strong>
                  </div>
                </div>
              </div>

              {/* Keywords Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Found Keywords */}
                <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-2xl p-8">
                  <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-lg">check_circle</span>
                    Keywords Matched
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {atsData.found_keywords.length > 0 ? (
                      atsData.found_keywords.map((kw, i) => (
                        <span key={i} className="px-4 py-2 bg-emerald-900/30 text-emerald-300 rounded-lg border border-emerald-800/50 text-sm font-medium">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No exact company keywords matched.</p>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="bg-rose-900/10 border border-rose-900/30 rounded-2xl p-8">
                  <h3 className="text-rose-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-lg">cancel</span>
                    Keywords Missing
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {atsData.missing_keywords.length > 0 ? (
                      atsData.missing_keywords.map((kw, i) => (
                        <span key={i} className="px-4 py-2 bg-rose-900/20 text-rose-300/80 rounded-lg border border-rose-900/50 text-sm font-medium line-through decoration-rose-500/30">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className="text-emerald-400 font-medium">Perfect! You matched all specific keywords.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Specific Insights */}
              {atsData.specific_feedback && atsData.specific_feedback.length > 0 && (
                <div className="bg-blue-900/10 border border-blue-900/30 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center border-b border-blue-900/30 pb-4">
                    <span className="material-symbols-outlined mr-2">lightbulb</span>
                    {atsData.company} Specific Insights
                  </h3>
                  <ul className="space-y-4">
                    {atsData.specific_feedback.map((item, idx) => {
                      let icon = 'info';
                      let iconColor = 'text-blue-400';
                      let bgColor = 'bg-blue-900/20 border-blue-800/30';
                      
                      if (item.includes('detected')) {
                        icon = 'check_circle';
                        iconColor = 'text-emerald-400';
                        bgColor = 'bg-emerald-900/20 border-emerald-800/30';
                      } else if (item.includes('looks for') || item.includes('heavily weighs') || item.includes('values')) {
                        icon = 'warning';
                        iconColor = 'text-yellow-400';
                        bgColor = 'bg-yellow-900/20 border-yellow-800/30';
                      }

                      return (
                        <li key={idx} className={`flex items-start p-5 rounded-xl border ${bgColor}`}>
                          <span className={`material-symbols-outlined mr-4 ${iconColor} text-2xl flex-shrink-0`}>{icon}</span>
                          <p className="text-slate-300 text-lg leading-relaxed">{item}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default EnterpriseAtsSimulator;
