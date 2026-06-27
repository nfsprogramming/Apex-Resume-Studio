import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';

const PersonalizedLearningPath = () => {
  const { selectedFile } = useResume();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (selectedFile && !hasFetched && !loading) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/learning-path`, {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRoadmap(data.roadmap);
          } else {
            setError(data.detail || 'Failed to generate learning path');
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

  const getPlatformIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('youtube')) return 'play_circle';
    if (p.includes('coursera') || p.includes('udemy')) return 'school';
    if (p.includes('github')) return 'code';
    return 'menu_book';
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-12 lg:p-20 flex flex-col items-start" data-purpose="main-learning-content">
        <div className="flex items-center mb-6" data-purpose="page-title">
          <span className="text-5xl mr-4 drop-shadow-lg">📖</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-emerald-400 glow-text">
            Personalized Learning Path
          </h1>
        </div>
        <p className="text-xl lg:text-2xl text-midnight-text-muted mb-10 max-w-3xl font-light">
          Free, high-quality resources to bridge your skill gaps, curated by Apex Resume Studio.
        </p>

        <div className="w-full max-w-5xl">
          {!selectedFile ? (
            <div className="w-full bg-yellow-900/30 border-l-4 border-yellow-600 rounded-md p-4 flex flex-col justify-center">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-yellow-500 mr-3">warning</span>
                <p className="text-yellow-400 text-lg font-semibold">Please upload a resume on the Dashboard first.</p>
              </div>
              <p className="mt-2 text-yellow-200/70 ml-9 text-sm">We need to analyze your resume to generate a learning path for your unique skill gaps.</p>
              <Link to="/dashboard" className="mt-4 ml-9 inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-sm font-bold transition-colors max-w-max">
                Go to Dashboard
              </Link>
            </div>
          ) : loading ? (
            <div className="w-full bg-deep-card border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Curating Learning Resources...</h2>
              <p className="text-slate-400 text-center max-w-md">Our AI is scouring the web for the best tutorials, articles, and courses to help you master your missing skills.</p>
            </div>
          ) : error ? (
            <div className="w-full bg-red-900/30 border-l-4 border-red-600 rounded-md p-4 flex items-center">
              <span className="material-symbols-outlined text-red-500 mr-3">error</span>
              <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
            </div>
          ) : roadmap && Object.keys(roadmap).length > 0 ? (
            <div className="space-y-10 w-full">
              {Object.entries(roadmap).map(([skill, resources], idx) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <span className="material-symbols-outlined text-emerald-400 mr-3">target</span>
                      Mastering {skill}
                    </h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources?.map((resource, rIdx) => (
                      <a 
                        key={rIdx} 
                        href={resource.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded-lg p-5 transition-all shadow-md flex items-start"
                      >
                        <span className="material-symbols-outlined text-emerald-400 text-3xl mr-4 group-hover:scale-110 transition-transform">
                          {getPlatformIcon(resource.platform || resource.type || '')}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors mb-1">{resource.title}</h3>
                          <div className="flex items-center space-x-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-400 mr-1.5"></span>{resource.platform}</span>
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-400 mr-1.5"></span>{resource.type}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="w-full bg-slate-800 border border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-slate-500 mb-4">check_circle</span>
              <h2 className="text-2xl font-bold text-white mb-2">No critical gaps found!</h2>
              <p className="text-slate-400 text-center max-w-md">Your resume looks incredibly strong. Our AI couldn't find any major missing skills for standard tech roles.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalizedLearningPath;
