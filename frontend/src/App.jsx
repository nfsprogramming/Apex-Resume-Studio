import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ResumeProvider } from './context/ResumeContext';
import AiInterviewGenerator from './pages/AiInterviewGenerator';
import AiResumeOptimizer from './pages/AiResumeOptimizer';
import DeepResumeAnalysis from './pages/DeepResumeAnalysis';
import EnterpriseAtsSimulator from './pages/EnterpriseAtsSimulator';
import GithubProfileAnalyzer from './pages/GithubProfileAnalyzer';
import JobDescriptionAutoFetcher from './pages/JobDescriptionAutoFetcher';
import LinkedinProfileSync from './pages/LinkedinProfileSync';
import PersonalizedLearningPath from './pages/PersonalizedLearningPath';
import ResumeIntelligenceSuite from './pages/ResumeIntelligenceSuite';
import ResumeVersionVault from './pages/ResumeVersionVault';
import SmartProjectRecommendations from './pages/SmartProjectRecommendations';
import SmartResumeAiDashboard from './pages/SmartResumeAiDashboard';
import StudentCareerCoach from './pages/StudentCareerCoach';
import ApexResumeStudio from './pages/ApexResumeStudio';

function App() {
  return (
    <ResumeProvider>
      <Router>
        <Layout>
        <Routes>
          {/* Default route points to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={<SmartResumeAiDashboard />} />
          <Route path="/interview-generator" element={<AiInterviewGenerator />} />
          <Route path="/resume-optimizer" element={<AiResumeOptimizer />} />
          <Route path="/deep-analysis" element={<DeepResumeAnalysis />} />
          <Route path="/ats-simulator" element={<EnterpriseAtsSimulator />} />
          <Route path="/github-analyzer" element={<GithubProfileAnalyzer />} />
          <Route path="/jd-fetcher" element={<JobDescriptionAutoFetcher />} />
          <Route path="/linkedin-sync" element={<LinkedinProfileSync />} />
          <Route path="/learning-path" element={<PersonalizedLearningPath />} />
          <Route path="/intelligence" element={<ResumeIntelligenceSuite />} />
          <Route path="/version-vault" element={<ResumeVersionVault />} />
          <Route path="/project-recommendations" element={<SmartProjectRecommendations />} />
          <Route path="/student-coach" element={<StudentCareerCoach />} />
          <Route path="/apex-studio" element={<ApexResumeStudio />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </Router>
    </ResumeProvider>
  );
}

export default App;
