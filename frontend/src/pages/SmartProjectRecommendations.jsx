import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';

const SmartProjectRecommendations = () => {
  const { selectedFile } = useResume();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (selectedFile && !hasFetched && !loading) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommend-projects`, {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProjects(data.projects);
          } else {
            setError(data.detail || 'Failed to generate recommendations');
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

  const getDifficultyColor = (diff) => {
    const d = diff.toLowerCase();
    if (d.includes('advanced')) return 'text-purple-400 bg-purple-900/30 border-purple-700/50';
    if (d.includes('intermediate')) return 'text-blue-400 bg-blue-900/30 border-blue-700/50';
    return 'text-green-400 bg-green-900/30 border-green-700/50';
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-12 lg:p-20 flex flex-col items-start" data-purpose="main-recommendations-content">
        <div className="flex items-center mb-6" data-purpose="page-title">
          <span className="text-5xl mr-4 drop-shadow-lg">💡</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-midnight-accent glow-text">
            Smart Project Recommendations
          </h1>
        </div>
        <p className="text-xl lg:text-2xl text-midnight-text-muted mb-10 max-w-3xl font-light">
          Boost your portfolio with projects that fill your skill gaps, powered by Apex Resume Studio.
        </p>

        <div className="w-full max-w-5xl">
          {!selectedFile ? (
            <div className="w-full bg-yellow-900/30 border-l-4 border-yellow-600 rounded-md p-4 flex flex-col justify-center">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-yellow-500 mr-3">warning</span>
                <p className="text-yellow-400 text-lg font-semibold">Please upload a resume on the Dashboard first.</p>
              </div>
              <p className="mt-2 text-yellow-200/70 ml-9 text-sm">We need to analyze your resume to recommend projects that fill your unique skill gaps.</p>
              <Link to="/dashboard" className="mt-4 ml-9 inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-sm font-bold transition-colors max-w-max">
                Go to Dashboard
              </Link>
            </div>
          ) : loading ? (
            <div className="w-full bg-deep-card border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Brainstorming Projects...</h2>
              <p className="text-slate-400 text-center max-w-md">Our AI is analyzing your missing skills and generating tailored project ideas to boost your portfolio.</p>
            </div>
          ) : error ? (
            <div className="w-full bg-red-900/30 border-l-4 border-red-600 rounded-md p-4 flex items-center">
              <span className="material-symbols-outlined text-red-500 mr-3">error</span>
              <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {projects?.map((project, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-electric-cyan/50 transition-colors shadow-lg flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{project?.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(project?.difficulty || 'Intermediate')}`}>
                      {project?.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-6 flex-grow">{project?.description}</p>
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Target Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {project?.skills?.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SmartProjectRecommendations;
