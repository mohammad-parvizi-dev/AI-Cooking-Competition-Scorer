
import React, { useMemo } from 'react';
import { AI, Challenge, Score } from '../types.ts';
import { GoldMedalIcon, SilverMedalIcon, BronzeMedalIcon } from './icons.tsx';

interface ResultsProps {
  ais: AI[];
  challenges: Challenge[];
  scores: Score[];
}

const Results: React.FC<ResultsProps> = ({ ais, challenges, scores }) => {
  const leaderboard = useMemo(() => {
    const aiScores = ais.map(ai => {
      const totalScore = scores
        .filter(s => s.aiId === ai.id)
        .reduce((sum, s) => sum + (s.score || 0), 0);
      return { ...ai, totalScore };
    });
    return aiScores.sort((a, b) => b.totalScore - a.totalScore);
  }, [ais, scores]);

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  const getScoreForChallenge = (aiId: string, challengeId: string) => {
    return scores.find(s => s.aiId === aiId && s.challengeId === challengeId)?.score ?? 0;
  }

  if (ais.length === 0) {
    return (
      <div className="text-center bg-gray-800/50 p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-purple-400">جدول امتیازات</h2>
        <p className="mt-4 text-gray-300">
          هنوز هیچ شرکت‌کننده‌ای اضافه نشده است. لطفاً به صفحه 'تنظیمات' بروید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Podium Card */}
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-center text-amber-400">🏆 سکوی قهرمانی 🏆</h2>
            {topThree.length > 0 ? (
                <div className="flex justify-center items-end gap-2 sm:gap-4 -mb-6">
                    {/* Second Place */}
                    {topThree[1] ? (
                        <div className="flex flex-col items-center w-1/4 order-2 text-center">
                            <SilverMedalIcon className="w-12 h-12 sm:w-16 sm:h-16 mb-2"/>
                            <img src={topThree[1].avatarUrl} alt={topThree[1].name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-400 mb-2 object-cover"/>
                            <h3 className="font-bold text-sm sm:text-lg">{topThree[1].name}</h3>
                            <p className="text-gray-300 text-lg sm:text-2xl font-bold">{topThree[1].totalScore}</p>
                            <div className="bg-gray-500 h-24 sm:h-32 w-full rounded-t-lg mt-2"></div>
                        </div>
                    ) : <div className="w-1/4 order-2"></div>}
                    
                    {/* First Place */}
                    {topThree[0] && (
                         <div className="flex flex-col items-center w-1/3 order-1 text-center">
                            <GoldMedalIcon className="w-16 h-16 sm:w-20 sm:h-20 mb-2"/>
                            <img src={topThree[0].avatarUrl} alt={topThree[0].name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 mb-2 object-cover"/>
                            <h3 className="font-bold text-base sm:text-xl">{topThree[0].name}</h3>
                            <p className="text-amber-300 text-xl sm:text-3xl font-bold">{topThree[0].totalScore}</p>
                            <div className="bg-amber-400 h-32 sm:h-48 w-full rounded-t-lg mt-2"></div>
                        </div>
                    )}

                    {/* Third Place */}
                    {topThree[2] ? (
                        <div className="flex flex-col items-center w-1/4 order-3 text-center">
                            <BronzeMedalIcon className="w-12 h-12 sm:w-16 sm:h-16 mb-2"/>
                            <img src={topThree[2].avatarUrl} alt={topThree[2].name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-700 mb-2 object-cover"/>
                            <h3 className="font-bold text-sm sm:text-lg">{topThree[2].name}</h3>
                            <p className="text-gray-300 text-lg sm:text-2xl font-bold">{topThree[2].totalScore}</p>
                            <div className="bg-yellow-700 h-20 sm:h-24 w-full rounded-t-lg mt-2"></div>
                        </div>
                    ) : <div className="w-1/4 order-3"></div>}
                </div>
            ) : (
                <p className="text-center text-gray-400">هنوز امتیازی ثبت نشده تا قهرمانان مشخص شوند.</p>
            )}
        </div>
        
        {/* Other Participants Card */}
        {others.length > 0 && (
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">سایر شرکت‌کنندگان</h2>
                <ul className="space-y-3">
                    {others.map((ai, index) => (
                        <li key={ai.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg transition-transform hover:scale-[1.02]">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-gray-400 w-6 text-center">{index + 4}.</span>
                                <img src={ai.avatarUrl} alt={ai.name} className="w-10 h-10 rounded-full object-cover" />
                                <span className="font-semibold">{ai.name}</span>
                            </div>
                            <span className="font-bold text-cyan-300 text-lg">{ai.totalScore} امتیاز</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Full Scoreboard Card */}
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-purple-400">جدول کامل امتیازات</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right min-w-[1200px]">
              <thead>
                <tr className="border-b-2 border-gray-600">
                  <th className="p-3 font-bold text-gray-300 text-center sticky right-0 bg-gray-800 z-10 w-20">رتبه</th>
                  <th className="p-3 font-bold text-gray-300 sticky right-20 bg-gray-800 z-10 w-48">هوش مصنوعی</th>
                  {challenges.map(c => (
                    <th key={c.id} className="p-3 font-bold text-gray-400 text-center text-xs whitespace-nowrap">{c.name}</th>
                  ))}
                  <th className="p-3 font-bold text-cyan-400 text-center sticky left-0 bg-gray-800 z-10 w-24">مجموع</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50">
                {leaderboard.map((ai, index) => (
                  <tr key={ai.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 text-center sticky right-0 bg-inherit">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold mx-auto ${
                        index === 0 ? 'bg-amber-400 text-gray-900' : 
                        index === 1 ? 'bg-gray-400 text-gray-900' : 
                        index === 2 ? 'bg-yellow-700 text-white' : 'bg-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4 font-semibold sticky right-20 bg-inherit">
                      <div className="flex items-center gap-3">
                        <img src={ai.avatarUrl} alt={ai.name} className="w-10 h-10 rounded-full object-cover" />
                        <span>{ai.name}</span>
                      </div>
                    </td>
                    {challenges.map(c => (
                       <td key={c.id} className="p-4 text-center text-lg font-mono">{getScoreForChallenge(ai.id, c.id)}</td>
                    ))}
                    <td className="p-4 text-center text-cyan-400 text-xl font-bold sticky left-0 bg-inherit">{ai.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default Results;