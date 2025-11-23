import React, { useEffect, useState } from 'react';
import { Trophy, ArrowRight, RotateCcw, Star } from 'lucide-react';
import { GameStats, Language } from '../types';
import { generateArtisticCommentary } from '../services/geminiService';
import { TRANSLATIONS } from '../translations';

interface VictoryModalProps {
  stats: GameStats;
  levelName: string;
  imageKeyword: string;
  language: Language;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
  hasNextLevel: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ 
  stats, levelName, imageKeyword, language, onNextLevel, onReplay, onHome, hasNextLevel 
}) => {
  const t = TRANSLATIONS[language];
  const [aiMessage, setAiMessage] = useState(t.consulting);

  useEffect(() => {
    let isMounted = true;
    setAiMessage(t.consulting);
    generateArtisticCommentary(levelName, imageKeyword, language).then(msg => {
      if (isMounted) setAiMessage(msg);
    });
    return () => { isMounted = false; };
  }, [levelName, imageKeyword, language]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[var(--bg-overlay)] backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-sm relative">
        
        {/* Glowing backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="glass-panel rounded-3xl p-6 flex flex-col items-center relative overflow-hidden shadow-2xl">
          
          {/* Title */}
          <div className="text-center mb-2">
            <h2 className="text-3xl font-serif font-bold text-[var(--text-main)] drop-shadow-sm">{t.magnificent}</h2>
            <p className="text-[var(--text-sub)] text-xs uppercase tracking-[0.2em] mt-1">{levelName} {t.completed}</p>
          </div>

          {/* Stars */}
          <div className="flex gap-3 my-6">
            {[1, 2, 3].map((star) => (
              <div key={star} className="relative">
                <Star 
                  size={36} 
                  className={`${star <= stats.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 fill-slate-300 opacity-20'} transition-all duration-700`}
                  strokeWidth={1.5}
                />
                {star <= stats.stars && (
                  <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-30 animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center border border-[var(--border-color)]">
              <div className="text-[var(--text-sub)] text-[10px] uppercase font-bold mb-1">{t.score}</div>
              <div className="text-2xl font-bold text-[var(--text-main)]">{stats.score}</div>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center border border-[var(--border-color)]">
              <div className="text-[var(--text-sub)] text-[10px] uppercase font-bold mb-1">{t.best}</div>
              <div className="text-2xl font-bold text-yellow-400">{stats.bestScore}</div>
            </div>
          </div>

          {/* AI Commentary */}
          <div className="relative w-full p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] mb-6">
            <div className="absolute -top-2 -left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{t.aiCurator}</div>
            <p className="text-[var(--text-main)] opacity-80 font-serif italic text-sm leading-relaxed text-center pt-2">
              "{aiMessage}"
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col w-full gap-3">
            {hasNextLevel ? (
              <button 
                onClick={onNextLevel}
                className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-main)] rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-[var(--border-color)] flex items-center justify-center gap-2"
              >
                {t.nextChapter} <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={onHome}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
              >
                 {t.completeCollection} <Trophy size={18} />
              </button>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={onReplay}
                className="flex-1 py-3 glass-button rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> {t.replay}
              </button>
              <button 
                onClick={onHome}
                className="flex-1 py-3 glass-button rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {t.menu}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};