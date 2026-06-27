import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const AiInterviewGenerator = () => {
  const { selectedFile } = useResume();
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Mid Level');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for model answers
  const [answers, setAnswers] = useState({});
  const [loadingAnswers, setLoadingAnswers] = useState({});

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Please upload a resume first.');
      return;
    }

    setLoading(true);
    setError('');
    setAnswers({});
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('target_role', targetRole);
      formData.append('difficulty', difficulty);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generate-questions`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
      } else {
        setError(data.detail || 'Failed to generate questions');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAnswer = async (question, idx) => {
    // If we already have the answer, don't fetch again
    if (answers[idx]) return;

    setLoadingAnswers(prev => ({ ...prev, [idx]: true }));
    
    try {
      const formData = new FormData();
      formData.append('question', question);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/model-answer`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnswers(prev => ({ ...prev, [idx]: data.answer }));
      }
    } catch (err) {
      console.error("Failed to fetch model answer", err);
      setAnswers(prev => ({ ...prev, [idx]: "Failed to load model answer. Please try again." }));
    } finally {
      setLoadingAnswers(prev => ({ ...prev, [idx]: false }));
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-12 py-16" data-purpose="main-interview-content">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="mb-4">
              <span className="text-6xl drop-shadow-lg">🎙️</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 neon-text-cyan">
              Apex Resume Studio
            </h1>
            <p className="text-xl text-gray-400 flex items-center justify-center">
              <span className="mr-2">🎯</span> Prepare with custom questions tailored to your profile.
            </p>
          </div>

          {!selectedFile ? (
            <div className="w-full max-w-2xl mx-auto bg-yellow-900/30 border-l-4 border-yellow-600 rounded-md p-6 flex flex-col justify-center mb-10">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-yellow-500 mr-3 text-2xl">warning</span>
                <p className="text-yellow-400 text-xl font-semibold">Please upload a resume on the Dashboard first.</p>
              </div>
              <p className="mt-3 text-yellow-200/70 ml-9">We need to analyze your resume to generate targeted interview questions.</p>
              <Link to="/dashboard" className="mt-5 ml-9 inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-bold transition-colors max-w-max">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              {/* Configuration Section */}
              <section className="mb-12" data-purpose="config-section">
                <div className="mb-6 pb-2 border-b border-cyan-500/30">
                  <h2 className="text-2xl font-semibold text-cyan-400 tracking-wide">Configure Evaluation</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {/* Target Role Input */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2" htmlFor="target-role">Target Role</label>
                    <input 
                      className="bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white rounded-md py-3 px-4 w-full transition-shadow" 
                      id="target-role" 
                      placeholder="e.g. Product Manager" 
                      type="text" 
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    />
                  </div>
                  {/* Difficulty Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400 mb-2" htmlFor="difficulty">Difficulty</label>
                    <div className="relative">
                      <select 
                        className="appearance-none bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white rounded-md py-3 px-4 w-full pr-10 transition-shadow" 
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                      >
                        <option>Entry Level</option>
                        <option>Mid Level</option>
                        <option>Senior</option>
                        <option>Lead / Architect</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="p-4 mb-6 bg-red-900/30 border-l-4 border-red-500 text-red-300 rounded-r-md">
                    {error}
                  </div>
                )}
                
                {/* Action Button */}
                <div className="flex">
                  <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn-primary" 
                    data-purpose="generate-btn"
                  >
                    {loading ? (
                      <><span className="material-symbols-outlined animate-spin mr-2">refresh</span> Generating...</>
                    ) : (
                      'Generate Questions'
                    )}
                  </button>
                </div>
              </section>

              {/* Results Section */}
              {questions.length > 0 && !loading && (
                <section className="mt-8 animate-fade-in">
                  <div className="mb-6 pb-2 border-b border-purple-500/30">
                    <h2 className="text-2xl font-semibold text-purple-400 tracking-wide flex items-center">
                      <span className="material-symbols-outlined mr-2">quiz</span>
                      Your Interview Questions
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {questions.map((q, idx) => (
                      <div key={idx} className="bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 p-6 rounded-xl shadow-lg transition-colors flex flex-col">
                        <div className="flex items-start">
                          <span className="bg-cyan-900/50 text-cyan-400 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-lg text-slate-200 pt-1 leading-relaxed flex-1">{q}</p>
                        </div>
                        
                        <div className="mt-4 ml-12 border-t border-slate-800 pt-4">
                          {!answers[idx] && !loadingAnswers[idx] ? (
                            <button 
                              onClick={() => handleGetAnswer(q, idx)}
                              className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm mr-1">lightbulb</span>
                              View Model Answer
                            </button>
                          ) : loadingAnswers[idx] ? (
                            <div className="text-sm text-slate-400 flex items-center">
                              <span className="material-symbols-outlined animate-spin text-sm mr-2">refresh</span>
                              Generating model answer...
                            </div>
                          ) : (
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                              <h4 className="text-xs uppercase tracking-wider text-purple-400 font-bold mb-2 flex items-center">
                                <span className="material-symbols-outlined text-sm mr-1">model_training</span>
                                Model Answer (STAR Method)
                              </h4>
                              <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed mt-4">
                                <ReactMarkdown
                                  components={{
                                    p: ({node, children, ...props}) => (
                                      <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-5 mb-4 shadow-md hover:border-cyan-500/30 transition-colors" {...props}>
                                        {children}
                                      </div>
                                    ),
                                    strong: ({node, ...props}) => <strong className="text-cyan-400 font-bold uppercase tracking-wider text-xs mr-2" {...props} />,
                                    code: ({node, inline, ...props}) => 
                                      inline ? (
                                        <code className="bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded-md text-xs border border-slate-700" {...props} />
                                      ) : (
                                        <div className="bg-[#0d1117] border border-slate-700 rounded-xl p-5 mb-4 overflow-x-auto shadow-inner">
                                          <code className="text-slate-300 font-mono text-xs leading-loose" {...props} />
                                        </div>
                                      ),
                                    blockquote: ({node, ...props}) => (
                                      <blockquote className="border-l-4 border-cyan-500 bg-cyan-900/20 p-4 rounded-r-xl mb-6 text-cyan-100" {...props} />
                                    ),
                                    h3: ({node, ...props}) => <h3 className="text-lg text-white font-bold mb-3 mt-6 flex items-center" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-none space-y-3 mb-4" {...props} />,
                                    li: ({node, children, ...props}) => (
                                      <li className="flex items-start bg-slate-900/40 p-3 rounded-lg border border-slate-800" {...props}>
                                        <span className="text-cyan-500 mr-3 mt-0.5">•</span>
                                        <span>{children}</span>
                                      </li>
                                    )
                                  }}
                                >
                                  {answers[idx]}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AiInterviewGenerator;
