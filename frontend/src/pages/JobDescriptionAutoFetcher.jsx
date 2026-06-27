import React, { useState } from 'react';

const JobDescriptionAutoFetcher = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFetch = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/fetch-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch JD');
      }
      setResult(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
{/* BEGIN: Fetcher Section */}
<div className="flex-1 overflow-y-auto px-12 py-16 max-w-6xl w-full" data-purpose="fetcher-container">
{/* Heading & Icon */}
<div className="flex items-center space-x-4 mb-8">
<div aria-hidden="true" className="text-5xl">🔍</div>
<h1 className="text-5xl font-bold text-white tracking-tight glow-text">Job Description Auto-Fetcher</h1>
</div>
{/* Subtitle */}
<p className="text-2xl text-slate-400 mb-12 font-medium">
        Extract JD effortlessly from LinkedIn, Indeed, and more with Apex Resume Studio.
      </p>
{/* URL Input Field Container */}
<div className="space-y-4 mb-10">
<label className="flex items-center text-slate-300 font-medium text-sm" htmlFor="jd-url">
<svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          Paste Job Post URL:
        </label>
<input 
  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-lg rounded-xl px-6 py-4 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-normal" 
  data-purpose="url-input" 
  id="jd-url" 
  placeholder="https://www.linkedin.com/jobs/view/..." 
  type="url"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
/>
</div>
{/* Action Button */}
<button 
  className="bg-gradient-to-br from-slate-700 to-slate-900 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg border border-slate-600 hover:border-cyan-400 transition-all uppercase tracking-widest text-sm flex items-center disabled:opacity-50" 
  data-purpose="fetch-button"
  onClick={handleFetch}
  disabled={loading || !url}
>
  {loading ? 'Fetching...' : 'Fetch Job Description'}
</button>

{error && (
  <div className="mt-6 bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl">
    {error}
  </div>
)}

{result && (
  <div className="mt-8 space-y-4">
    <h3 className="text-xl font-bold text-white">Extracted Job Description</h3>
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 max-h-96 overflow-y-auto text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
      {result}
    </div>
  </div>
)}
</div>
{/* END: Fetcher Section */}
{/* BEGIN: Footer Elements */}

{/* END: Footer Elements */}
    </>
  );
};

export default JobDescriptionAutoFetcher;
