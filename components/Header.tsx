
import React from 'react';
import { View } from '../types.ts';
import { SetupIcon, CompetitionIcon, ResultsIcon } from './icons.tsx';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: View.SETUP, label: 'تنظیمات', icon: <SetupIcon /> },
    { view: View.COMPETITION, label: 'مسابقه', icon: <CompetitionIcon /> },
    { view: View.RESULTS, label: 'نتایج', icon: <ResultsIcon /> },
  ];

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400 mb-4 sm:mb-0">
          🏆 مسابقه آشپزی هوش مصنوعی
        </h1>
        <nav className="flex space-x-reverse space-x-2 bg-gray-700/50 p-2 rounded-full">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                currentView === item.view
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;