import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AI, Score, View } from './types';
import Header from './components/Header';
import Setup from './components/Setup';
import Competition from './components/Competition';
import Results from './components/Results';
import { AIS, CHALLENGES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SETUP);
  const ais = AIS;
  const [scores, setScores] = useLocalStorage<Score[]>('scores', []);
  const challenges = CHALLENGES;

  useEffect(() => {
    // One-time cleanup of old dynamic challenges and ais from localStorage
    if (localStorage.getItem('challenges')) {
      localStorage.removeItem('challenges');
    }
    if (localStorage.getItem('ais')) {
      const storedAis = JSON.parse(localStorage.getItem('ais')!);
      // A simple check to see if it's the old user-managed array
      if (Array.isArray(storedAis) && storedAis.length > 0 && !storedAis[0].id.startsWith('ai-')) {
         localStorage.removeItem('ais');
      }
    }
  }, []);

  const handleResetAllData = () => {
    // AIs are now static, so we only need to clear scores.
    setScores([]);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.SETUP:
        return (
          <Setup
            ais={ais}
            onResetAllData={handleResetAllData}
          />
        ); 
      case View.COMPETITION:
        return ( 
          <Competition
            ais={ais}  
            challenges={challenges}
            scores={scores}
            setScores={setScores}
          />
        );
      case View.RESULTS:
        return <Results ais={ais} challenges={challenges} scores={scores} />;
      default:
        return <Setup ais={ais} onResetAllData={handleResetAllData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="mt-8">{renderContent()}</main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>ساخته شده برای چالش بزرگ هوش مصنوعی</p>
        </footer>
      </div>
    </div>
  );
};

export default App;