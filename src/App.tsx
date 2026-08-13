import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import type { NavTab } from './components/layout/Sidebar';

import { DashboardPage } from './pages/DashboardPage';
import { NewAssessmentPage } from './pages/NewAssessmentPage';
import { LiveAnalysisPage } from './pages/LiveAnalysisPage';
import { ResultsPage } from './pages/ResultsPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { HistoryPage } from './pages/HistoryPage';
import { ComparePage } from './pages/ComparePage';
import { ObservatoryPage } from './pages/ObservatoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { ResponsibleAiPage } from './pages/ResponsibleAiPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentTab} />;
      case 'new-assessment':
        return <NewAssessmentPage onNavigate={setCurrentTab} />;
      case 'live-analysis':
        return <LiveAnalysisPage />;
      case 'results':
        return <ResultsPage onNavigate={setCurrentTab} />;
      case 'explainability':
        return <ExplainabilityPage />;
      case 'history':
        return <HistoryPage onNavigate={setCurrentTab} />;
      case 'compare':
        return <ComparePage />;
      case 'model-observatory':
        return <ObservatoryPage />;
      case 'reports':
        return <ReportsPage />;
      case 'responsible-ai':
        return <ResponsibleAiPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentTab} />;
    }
  };

  return (
    <Layout currentTab={currentTab} onSelectTab={setCurrentTab}>
      {renderActivePage()}
    </Layout>
  );
}

export default App;
