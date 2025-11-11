import React, { useState, useMemo } from 'react';
import { AI, Challenge, Score } from '../types.ts';
import { CHALLENGE_GROUPS, LEVELS } from '../constants.ts';
import { 
  StarIcon, EasyLevelIcon, MediumLevelIcon, HardLevelIcon,
  SmartChefIcon, RaceTimeIcon, MinefieldKitchenIcon, MissingIngredientIcon, GuerrillaCookingIcon, GlobalChefIcon
} from './icons.tsx';

interface StarRatingProps {
  count: number;
  value: number;
  onChange: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ count, value, onChange }) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const stars = Array.from({ length: count }, (_, i) => i + 1);

  const handleClick = (newValue: number) => {
    // Allow deselecting by clicking the same star again
    onChange(newValue === value ? 0 : newValue);
  };

  return (
    <div className="flex items-center justify-center" dir="ltr">
      {stars.map((starValue) => (
        <button
          key={starValue}
          type="button"
          className="p-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full"
          onMouseEnter={() => setHoverValue(starValue)}
          onMouseLeave={() => setHoverValue(undefined)}
          onClick={() => handleClick(starValue)}
          aria-label={`Rate ${starValue} out of ${count}`}
        >
          <StarIcon
            filled={(hoverValue || value) >= starValue}
            className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${
              (hoverValue || value) >= starValue ? 'text-amber-400' : 'text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};


interface CompetitionProps {
  ais: AI[];
  challenges: Challenge[];
  scores: Score[];
  setScores: React.Dispatch<React.SetStateAction<Score[]>>;
}

const Competition: React.FC<CompetitionProps> = ({ ais, challenges, scores, setScores }) => {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);

  const progressData = useMemo(() => {
    return CHALLENGE_GROUPS.map((_, groupIndex) => {
        const challengesInGroup = challenges.filter(c => c.id.startsWith(`challenge-${groupIndex}-`));
        let totalScoresInGroup = 0;
        
        const levelStatus = LEVELS.map((__, levelIndex) => {
            const challengeId = `challenge-${groupIndex}-${levelIndex}`;
            const scoresForLevel = scores.filter(s => s.challengeId === challengeId);
            
            // Count an AI as scored if an entry exists for it, regardless of score value
            totalScoresInGroup += scoresForLevel.length;

            if (scoresForLevel.length === 0) return 'not-started';
            if (scoresForLevel.length < ais.length) return 'in-progress';
            return 'completed';
        });

        const totalPossibleScores = ais.length * challengesInGroup.length;
        const percentage = totalPossibleScores > 0 ? Math.round((totalScoresInGroup / totalPossibleScores) * 100) : 0;

        return { percentage, levelStatus };
    });
  }, [challenges, scores, ais]);

  const levelDetails = [
    { name: LEVELS[0], icon: <EasyLevelIcon className="w-6 h-6" /> },
    { name: LEVELS[1], icon: <MediumLevelIcon className="w-6 h-6" /> },
    { name: LEVELS[2], icon: <HardLevelIcon className="w-6 h-6" /> },
  ];

  const challengeGroupDetails = [
    { name: CHALLENGE_GROUPS[0], icon: <SmartChefIcon /> },
    { name: CHALLENGE_GROUPS[1], icon: <RaceTimeIcon /> },
    { name: CHALLENGE_GROUPS[2], icon: <MinefieldKitchenIcon /> },
    { name: CHALLENGE_GROUPS[3], icon: <MissingIngredientIcon /> },
    { name: CHALLENGE_GROUPS[4], icon: <GuerrillaCookingIcon /> },
    { name: CHALLENGE_GROUPS[5], icon: <GlobalChefIcon /> },
  ];

  const handleScoreChange = (aiId: string, challengeId: string, scoreValue: number) => {
    const newScores = [...scores];
    const scoreIndex = scores.findIndex(s => s.aiId === aiId && s.challengeId === challengeId);

    if (scoreIndex > -1) {
      newScores[scoreIndex] = { ...newScores[scoreIndex], score: scoreValue };
    } else {
      newScores.push({ aiId, challengeId, score: scoreValue, notes: '' });
    }
    setScores(newScores);
  };
  
  const handleNotesChange = (aiId: string, challengeId: string, notes: string) => {
    const newScores = [...scores];
    const scoreIndex = scores.findIndex(s => s.aiId === aiId && s.challengeId === challengeId);
    
    if (scoreIndex > -1) {
      newScores[scoreIndex] = { ...newScores[scoreIndex], notes };
    } else {
       newScores.push({ aiId, challengeId, score: 0, notes });
    }
    setScores(newScores);
  };

  const getScore = (aiId: string, challengeId: string): Score | undefined => {
    return scores.find(s => s.aiId === aiId && s.challengeId === challengeId);
  };

  if (ais.length === 0 || challenges.length === 0) {
    return (
      <div className="text-center bg-gray-800/50 p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-yellow-400">صفحه امتیازدهی</h2>
        <p className="mt-4 text-gray-300">
          برای شروع، لطفاً حداقل یک هوش مصنوعی را در صفحه 'تنظیمات' اضافه کنید.
        </p>
      </div>
    );
  }
  
  const activeChallenge = challenges.find(
    (c) => c.id === `challenge-${activeGroupIndex}-${activeLevelIndex}`
  );

  if (!activeChallenge) {
    return (
      <div className="text-center bg-gray-800/50 p-8 rounded-2xl">
        <p className="text-red-400">خطا: چالش انتخاب شده یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-green-400">ثبت امتیازات</h2>
      
      {/* Level 1 Tabs: Challenge Groups */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 pb-6 border-b border-gray-700">
        {challengeGroupDetails.map((group, index) => (
          <button 
            key={index} 
            onClick={() => { setActiveGroupIndex(index); setActiveLevelIndex(0); }}
            className={`flex flex-col items-center justify-between gap-2 p-3 rounded-xl text-center font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 h-32 ${
              activeGroupIndex === index 
              ? 'bg-green-600 text-white shadow-lg scale-105' 
              : 'bg-gray-700 hover:bg-gray-600/70 text-gray-300 hover:-translate-y-1'
            }`}
          >
            {/* Top part: Icon and Name */}
            <div className="flex flex-col items-center gap-2">
                <div className="h-7 w-7">{group.icon}</div>
                <span className="text-xs leading-tight">{group.name}</span>
            </div>
            
            {/* Bottom part: Progress */}
             {progressData[index] && (
                <div className="w-full">
                    <div className="text-xs font-normal mb-1">{progressData[index].percentage}%</div>
                    <div className="flex justify-center items-center gap-1.5">
                    {progressData[index].levelStatus.map((status, i) => (
                        <span
                        key={i}
                        className={`block w-2 h-2 rounded-full ${
                            status === 'completed' ? 'bg-green-400' :
                            status === 'in-progress' ? 'bg-yellow-400' :
                            'bg-gray-500'
                        }`}
                        ></span>
                    ))}
                    </div>
                </div>
            )}
          </button>
        ))}
      </div>

      {/* Level 2 Tabs: Difficulty Levels */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
         {levelDetails.map((level, index) => (
           <button 
             key={index} 
             onClick={() => setActiveLevelIndex(index)}
             className={`flex items-center gap-3 px-6 py-3 rounded-full text-base font-bold transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
               activeLevelIndex === index
               ? 'bg-cyan-500 text-white shadow-lg transform scale-105'
               : 'bg-gray-600 hover:bg-gray-500/70 text-gray-300 hover:scale-105'
             }`}
           >
             {level.icon}
             <span>{level.name}</span>
           </button>
         ))}
      </div>

      {/* Challenge Details */}
      <div className="bg-gray-700/30 p-4 rounded-lg mb-6 text-gray-300 border border-gray-600">
        <h3 className="text-lg font-bold text-green-300 mb-3">{activeChallenge.name}</h3>
        <p className="mb-4 text-sm"><strong className="text-gray-100">هدف اصلی چالش:</strong> {activeChallenge.objective}</p>
        
        <div className="space-y-4 text-sm">
            <div>
                <h4 className="font-semibold text-gray-100 mb-1">شرح مرحله:</h4>
                <p className="whitespace-pre-wrap leading-relaxed">{activeChallenge.details.levelDescription}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-100 mb-1">پرامپت:</h4>
                <p className="italic bg-gray-900/50 p-3 rounded-md text-gray-200 leading-relaxed">{activeChallenge.details.prompt}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-100 mb-1">انتظار ما:</h4>
                <p className="whitespace-pre-wrap leading-relaxed">{activeChallenge.details.expectation}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-100 mb-1">معیارهای امتیازدهی (از ۱۰ امتیاز):</h4>
                <ul className="list-disc list-inside pr-4 space-y-1">
                    {activeChallenge.scoringCriteria.map((item, index) => (
                        <li key={index}>{item.criterion} ({item.points} امتیاز)</li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
      
      {/* Scoring Table for the active challenge */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3 font-semibold text-gray-300 w-1/3 sm:w-1/4">هوش مصنوعی</th>
              <th className="p-3 font-semibold text-gray-300">امتیاز و یادداشت</th>
            </tr>
          </thead>
          <tbody>
            {ais.map(ai => {
              const currentScore = getScore(ai.id, activeChallenge.id);
              return (
                <tr key={ai.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/20">
                  <td className="p-3 font-semibold align-top">
                    <div className="flex items-center gap-3">
                      <img src={ai.avatarUrl} alt={ai.name} className="w-10 h-10 rounded-full" />
                      <span>{ai.name}</span>
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-col gap-2">
                       <StarRating
                        count={10}
                        value={currentScore?.score ?? 0}
                        onChange={(newScore) => handleScoreChange(ai.id, activeChallenge.id, newScore)}
                      />
                      <textarea
                        placeholder="یادداشت..."
                        rows={3}
                        value={currentScore?.notes ?? ''}
                        onChange={(e) => handleNotesChange(ai.id, activeChallenge.id, e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Competition;