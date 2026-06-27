import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';

const LinkedinProfileSync = () => {
  const { selectedFile: resumeFile } = useResume();
  const [linkedinFile, setLinkedinFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [syncData, setSyncData] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setLinkedinFile(file);
        setError('');
      } else {
        setError('Please select a valid PDF file.');
      }
    }
  };

  const handleRunSync = async () => {
    if (!resumeFile) {
      setError('Please upload your primary Resume on the Dashboard first.');
      return;
    }
    if (!linkedinFile) {
      setError('Please upload your LinkedIn Profile PDF.');
      return;
    }

    setLoading(true);
    setError('');
    setSyncData(null);

    try {
      const formData = new FormData();
      formData.append('resume_file', resumeFile);
      formData.append('linkedin_file', linkedinFile);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/linkedin-sync`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSyncData(data.data);
      } else {
        setError(data.detail || 'Failed to sync profiles.');
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Sync Interface */}
          <div className="lg:col-span-8 space-y-10" data-purpose="sync-interface">
            
            {/* Header Title Section */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight flex items-center gap-4">
                <span className="text-cyan-custom">🔗</span>
                <span className="tracking-tight text-slate-100">LinkedIn Profile Sync</span>
              </h1>
              <p className="text-2xl text-slate-400 font-light">
                Align your Resume and LinkedIn Profile with Apex Resume Studio.
              </p>
            </div>

            {/* Instructions Box */}
            <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-8 space-y-6" data-purpose="instruction-box">
              <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm">Instruction:</h3>
              <ol className="space-y-4 text-blue-400/80 list-decimal list-inside">
                <li className="">Go to your LinkedIn Profile.</li>
                <li className="">Click 'More' → 'Save to PDF'.</li>
                <li className="">Upload that PDF here.</li>
              </ol>
            </div>

            {/* Upload Section */}
            {!resumeFile ? (
               <div className="w-full bg-yellow-900/30 border-l-4 border-yellow-600 rounded-md p-6 flex flex-col justify-center mt-10">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-yellow-500 mr-3 text-2xl">warning</span>
                  <p className="text-yellow-400 text-xl font-semibold">Please upload your primary resume first.</p>
                </div>
                <p className="mt-3 text-yellow-200/70 ml-9">We need your resume to cross-reference with your LinkedIn profile.</p>
                <Link to="/dashboard" className="mt-5 ml-9 inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-bold transition-colors max-w-max">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-6" data-purpose="upload-section">
                <div className="space-y-4">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Upload LinkedIn PDF</label>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`bg-[#121821] border ${linkedinFile ? 'border-emerald-500/50' : 'border-slate-800'} rounded-lg p-3 flex items-center gap-4 group hover:border-slate-700 transition-all`}>
                      <button className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${linkedinFile ? 'bg-emerald-900/50 text-emerald-400' : 'bg-[#1e293b] hover:bg-[#334155] text-white'}`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {linkedinFile ? 'check_circle' : 'upload'}
                        </span>
                        {linkedinFile ? 'Uploaded' : 'Upload'}
                      </button>
                      <span className="text-slate-500 text-sm truncate flex-1">
                        {linkedinFile ? linkedinFile.name : '200MB per file • PDF'}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-900/30 border-l-4 border-red-500 text-red-300 rounded-md">
                    <span className="font-semibold mr-2">Error:</span> {error}
                  </div>
                )}

                <button 
                  onClick={handleRunSync}
                  disabled={loading || !linkedinFile}
                  className="w-full md:w-auto px-10 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold uppercase tracking-widest rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
                  type="button"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin mr-3">refresh</span> Analyzing Alignment...</>
                  ) : (
                    'Run Sync Analysis'
                  )}
                </button>
              </div>
            )}

            {/* Results Section */}
            {syncData && !loading && (
              <div className="mt-12 animate-fade-in space-y-10 border-t border-slate-800 pt-10">
                
                {/* Alignment Score Card */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-blue-500"></div>
                  
                  <div className="flex flex-col mb-6 md:mb-0">
                    <h3 className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2">Overall Alignment</h3>
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-6xl font-black ${syncData.alignment_score >= 80 ? 'text-emerald-400' : syncData.alignment_score >= 50 ? 'text-yellow-400' : 'text-rose-400'}`}>
                        {syncData.alignment_score}
                      </span>
                      <span className="text-2xl text-slate-500 font-bold">%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    <div className="text-center flex flex-col items-center">
                      <span className={`material-symbols-outlined text-4xl mb-2 ${syncData.dates_match ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {syncData.dates_match ? 'check_circle' : 'cancel'}
                      </span>
                      <span className="text-slate-300 font-medium text-sm">Dates Match</span>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <span className={`material-symbols-outlined text-4xl mb-2 ${syncData.titles_match ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {syncData.titles_match ? 'check_circle' : 'cancel'}
                      </span>
                      <span className="text-slate-300 font-medium text-sm">Titles Match</span>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <span className={`material-symbols-outlined text-4xl mb-2 ${syncData.skills_match ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {syncData.skills_match ? 'check_circle' : 'cancel'}
                      </span>
                      <span className="text-slate-300 font-medium text-sm">Skills Match</span>
                    </div>
                  </div>
                </div>

                {/* Discrepancies List */}
                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center">
                    <span className="material-symbols-outlined mr-3 text-yellow-400 text-3xl">policy</span>
                    Detected Discrepancies
                  </h3>
                  
                  {syncData.discrepancies && syncData.discrepancies.length > 0 ? (
                    <ul className="space-y-4">
                      {syncData.discrepancies.map((item, idx) => (
                        <li key={idx} className="flex items-start p-4 rounded-xl border bg-yellow-900/10 border-yellow-800/20">
                          <span className="material-symbols-outlined mr-4 text-yellow-500 text-xl flex-shrink-0 mt-0.5">error</span>
                          <p className="text-slate-300 text-base leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center p-6 bg-emerald-900/20 border border-emerald-800/30 rounded-xl">
                      <span className="material-symbols-outlined text-emerald-400 text-5xl mb-4 block">celebration</span>
                      <p className="text-emerald-300 text-lg font-medium">Perfect! No major discrepancies found between your resume and LinkedIn.</p>
                    </div>
                  )}
                </div>
                
              </div>
            )}

          </div>

          {/* Right Column: Sidebar Info */}
          <div className="lg:col-span-4 space-y-8" data-purpose="sidebar-info">
            <div className="sticky top-0 pt-10">
              <h2 className="text-2xl font-semibold text-slate-100 mb-6">Why Sync?</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">Recruiters look for consistency. Apex Resume Studio ensures your digital presence is perfectly aligned.</p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-cyan-custom font-bold text-lg leading-none">•</span>
                  <span className="">Dates match?</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-cyan-custom font-bold text-lg leading-none">•</span>
                  <span className="">Job titles match?</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-cyan-custom font-bold text-lg leading-none">•</span>
                  <span className="">Skills match?</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LinkedinProfileSync;
