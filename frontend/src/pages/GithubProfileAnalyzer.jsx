import React, { useState } from 'react';

const GithubProfileAnalyzer = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username.');
      return;
    }

    setLoading(true);
    setError('');
    setProfileData(null);

    try {
      const formData = new FormData();
      formData.append('username', username.trim());

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/github-analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setProfileData(data.data);
      } else {
        setError(data.detail || 'Failed to analyze profile.');
      }
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto w-full px-6 py-12" data-purpose="tool-container">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* Header Section */}
          <div className="mb-6 flex justify-center">
            <span className="material-symbols-outlined text-6xl text-electric-cyan filter drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">psychology</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 heading-glow tracking-wide text-center">
            GitHub Profile Analyzer
          </h1>
          <p className="text-lg text-slate-400 mb-10 text-center max-w-2xl font-light">
            Powered by Apex Resume Studio. Visualize your coding footprint and map it to your skills.
          </p>

          {/* Search Interface */}
          <div className="w-full max-w-3xl space-y-4 mb-12">
            <div data-purpose="input-group">
              <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="github-username">
                Enter GitHub Username:
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner" 
                  id="github-username" 
                  placeholder="e.g. torvalds" 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-900/30 border-l-4 border-red-500 text-red-300 rounded-md">
                <span className="font-semibold mr-2">Error:</span> {error}
              </div>
            )}

            <div className="pt-2 flex justify-start">
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="btn-primary" 
                type="button"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin mr-2">refresh</span> Analyzing...</>
                ) : (
                  'Analyze Profile'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {profileData && !loading && (
            <div className="w-full animate-fade-in space-y-10">
              
              {/* Basic Stats Header */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
                <img 
                  src={profileData.stats.avatar} 
                  alt={profileData.stats.name} 
                  className="w-32 h-32 rounded-full border-4 border-slate-700 shadow-lg object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">{profileData.stats.name}</h2>
                  <a href={profileData.stats.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 font-mono text-sm inline-block mb-4">
                    @{username} <span className="material-symbols-outlined text-[14px] align-middle ml-1">open_in_new</span>
                  </a>
                  {profileData.stats.bio && (
                    <p className="text-slate-300 mb-6 max-w-2xl">{profileData.stats.bio}</p>
                  )}
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                    <div className="text-center md:text-left">
                      <div className="text-2xl font-bold text-white">{profileData.stats.repos}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Public Repos</div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-2xl font-bold text-white">{profileData.stats.followers}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Followers</div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-2xl font-bold text-white">{profileData.stats.created_at}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Joined</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages & Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Languages */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center">
                    <span className="material-symbols-outlined text-emerald-400 mr-2">code</span>
                    Top Languages
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(profileData.languages).map(([lang, pct], idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300 font-medium">{lang}</span>
                          <span className="text-emerald-400 font-mono">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {Object.keys(profileData.languages).length === 0 && (
                      <div className="text-slate-500 italic text-sm">No primary languages detected.</div>
                    )}
                  </div>
                </div>

                {/* Topics */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center">
                    <span className="material-symbols-outlined text-purple-400 mr-2">local_offer</span>
                    Most Used Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.topics.map(([topic, count], idx) => (
                      <span key={idx} className="bg-purple-900/30 border border-purple-700/50 text-purple-300 px-3 py-1.5 rounded-md text-sm font-medium flex items-center">
                        {topic}
                        <span className="ml-2 bg-purple-800/50 text-purple-200 text-[10px] px-1.5 py-0.5 rounded-full">{count}</span>
                      </span>
                    ))}
                    {profileData.topics.length === 0 && (
                      <div className="text-slate-500 italic text-sm">No topics detected on recent repos.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Projects */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
                  <span className="material-symbols-outlined text-cyan-400 mr-3 text-3xl">star</span>
                  Top Impact Projects
                </h3>
                
                {profileData.top_projects.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {profileData.top_projects.map((proj, idx) => (
                      <a 
                        key={idx}
                        href={proj.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 rounded-xl p-6 transition-all group flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center">
                            {proj.name}
                          </h4>
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="flex items-center text-yellow-500">
                              <span className="material-symbols-outlined text-sm mr-1">star</span>
                              {proj.stars}
                            </span>
                            <span className="flex items-center text-emerald-400">
                              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                              {proj.score}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                          {proj.desc || "No description provided."}
                        </p>
                        <div className="mt-auto">
                          {proj.language && (
                            <span className="inline-block px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600 font-mono">
                              {proj.language}
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
                    No significant projects found. (We scan recent non-forked repos with descriptions or stars).
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default GithubProfileAnalyzer;
