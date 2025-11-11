import React from 'react';
import { AI } from '../types';
import { TrashIcon } from './icons';
import { CHALLENGE_GROUPS, LEVELS } from '../constants';

interface SetupProps {
  ais: AI[];
  onResetAllData: () => void;
}

const Setup: React.FC<SetupProps> = ({ ais, onResetAllData }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI List */}
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-amber-400">هوش‌های مصنوعی شرکت‌کننده</h2>
           <p className="text-gray-400 mb-4">
            شرکت‌کنندگان این مسابقه ثابت و از پیش تعریف شده هستند.
          </p>
          <ul className="space-y-2">
            {ais.map((ai) => (
              <li key={ai.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={ai.avatarUrl} alt={ai.name} className="w-10 h-10 rounded-full" />
                  <span className="font-semibold">{ai.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenge List */}
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-sky-400">چالش‌های مسابقه</h2>
          <p className="text-gray-400 mb-4">
            این چالش‌ها برای مسابقه ثابت هستند. هر چالش شامل سه سطح آسان، متوسط و سخت است.
          </p>
          <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {CHALLENGE_GROUPS.map((group, index) => (
              <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="font-semibold text-sky-300">{group}</h3>
                <ul className="mt-2 pr-4 space-y-1 list-disc list-inside text-gray-400">
                  {LEVELS.map(level => (
                    <li key={level}>{level}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-red-900/20 border border-red-500/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-red-400">منطقه خطر</h2>
        <p className="text-red-300 mb-4">
          این عمل تمام داده‌های امتیازات را برای همیشه پاک می‌کند (لیست هوش‌های مصنوعی ثابت است).
        </p>
        <button
          onClick={onResetAllData}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <TrashIcon />
          <span>بازنشانی تمام امتیازات</span>
        </button>
      </div>
    </>
  );
};

export default Setup;