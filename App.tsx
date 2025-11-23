import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameState, GameStats, Language, LevelConfig, Theme } from './types';
import { LEVELS, TRANSLATIONS, IS_DEV_MODE } from './constants';
import { PuzzleBoard } from './components/PuzzleBoard';
import { VictoryModal } from './components/VictoryModal';
import { ArrowLeft, Eye, Play, Zap, Lock, Globe, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';

// Declare global confetti
declare const confetti: any;

interface StoredLevelStats {
  best: number;
  avg: number;
  plays: number;
  totalScore: number;
  unlocked: boolean;
}

export default function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameId, setGameId] = useState(0);
  
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  
  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('lumina_language');
      if (saved === Language.EN) return Language.EN;
      if (saved === Language.ZH) return Language.ZH;
    } catch (e) { }
    return Language.ZH;
  });

  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('lumina_theme');
      if (saved === Theme.LIGHT) return Theme.LIGHT;
    } catch (e) { }
    return Theme.DARK;
  });
  
  // Game Stats State
  const [currentScore, setCurrentScore] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  const [levelStats, setLevelStats] = useState<Record<number, StoredLevelStats>>({});
  const [isNewBest, setIsNewBest] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  // Apply Theme to Body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleLanguage = () => {
    const newLang = language === Language.EN ? Language.ZH : Language.EN;
    setLanguage(newLang);
    localStorage.setItem('lumina_language', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    setTheme(newTheme);
    localStorage.setItem('lumina_theme', newTheme);
  }

  const t = TRANSLATIONS[language];

  // Load global progress
  useEffect(() => {
    try {
      const loadedStats: Record<number, StoredLevelStats> = {};
      LEVELS.forEach(lvl => {
        const key = `lumina_level_${lvl.level}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          loadedStats[lvl.level] = JSON.parse(saved);
        } else {
          loadedStats[lvl.level] = { 
            best: 0, avg: 0, plays: 0, totalScore: 0, 
            unlocked: lvl.level === 1 
          };
        }
      });
      setLevelStats(loadedStats);
    } catch (e) {
      console.error("Failed to load stats", e);
      const defaultStats: Record<number, StoredLevelStats> = {};
      LEVELS.forEach(lvl => {
         defaultStats[lvl.level] = { 
            best: 0, avg: 0, plays: 0, totalScore: 0, 
            unlocked: lvl.level === 1 
         };
      });
      setLevelStats(defaultStats);
    }
  }, []);

  const currentLevel = LEVELS[currentLevelIndex];
  
  // Preload Next Level Image (Optimization)
  useEffect(() => {
    const nextLevel = LEVELS[currentLevelIndex + 1];
    if (nextLevel) {
       // Try to preload online image to populate cache
       // We assume local is instant if it exists.
       const img = new Image();
       img.src = `https://picsum.photos/seed/${nextLevel.imageKeyword}-v2/800/800`;
    }
  }, [currentLevelIndex]);

  useEffect(() => {
    let timer: number | undefined;
    if (gameState === GameState.PLAYING) {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [gameState]);

  const handleStartGame = (levelIndex: number) => {
    setCurrentLevelIndex(levelIndex);
    setMoves(0);
    setTimeElapsed(0);
    setShowHint(false);
    setGameId(prev => prev + 1);
    setGameState(GameState.PLAYING);
  };

  const handleMove = useCallback(() => {
    setMoves(prev => prev + 1);
  }, []);

  const handleSolve = useCallback(() => {
    if (gameState === GameState.WON) return;

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#ffffff']
      });
    }

    const baseScore = Math.pow(currentLevel.gridSize, 2) * 1500;
    const movePenalty = moves * 15;
    const timePenalty = timeElapsed * 8;
    
    let rawScore = baseScore - movePenalty - timePenalty;
    const minScore = Math.floor(baseScore * 0.1);
    rawScore = Math.max(minScore, rawScore);

    const percentage = rawScore / baseScore;
    let stars = 1;
    if (percentage > 0.8) stars = 3;
    else if (percentage > 0.6) stars = 2;

    try {
      const currentLvlStats = levelStats[currentLevel.level] || { best: 0, avg: 0, plays: 0, totalScore: 0, unlocked: true };
      const newPlays = currentLvlStats.plays + 1;
      const newTotalScore = currentLvlStats.totalScore + rawScore;
      const newAvg = Math.floor(newTotalScore / newPlays);
      const newBest = Math.max(currentLvlStats.best, rawScore);
      const isRecord = rawScore > currentLvlStats.best;

      const newStats = {
        ...currentLvlStats,
        best: newBest,
        avg: newAvg,
        plays: newPlays,
        totalScore: newTotalScore
      };

      const updatedAllStats = { ...levelStats, [currentLevel.level]: newStats };
      
      const nextLevel = LEVELS[currentLevelIndex + 1];
      if (nextLevel) {
        const nextStats = updatedAllStats[nextLevel.level] || { best: 0, avg: 0, plays: 0, totalScore: 0, unlocked: false };
        updatedAllStats[nextLevel.level] = { ...nextStats, unlocked: true };
      }

      Object.keys(updatedAllStats).forEach(key => {
        localStorage.setItem(`lumina_level_${key}`, JSON.stringify(updatedAllStats[parseInt(key)]));
      });

      setLevelStats(updatedAllStats);
      setCurrentScore(rawScore);
      setEarnedStars(stars);
      setIsNewBest(isRecord);
    } catch (e) {
      console.error("Error saving stats", e);
      setCurrentScore(rawScore);
      setEarnedStars(stars);
    }

    setGameState(GameState.WON);
  }, [gameState, moves, timeElapsed, currentLevel, currentLevelIndex, levelStats]);

  const handleNextLevel = () => {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < LEVELS.length) {
       const nextLevelChapterIndex = Math.floor(nextIndex / 10);
       if (nextLevelChapterIndex !== currentChapterIndex) {
         setCurrentChapterIndex(nextLevelChapterIndex);
       }
      handleStartGame(nextIndex);
    }
  };

  const levelChapters = useMemo(() => {
    const chunks: LevelConfig[][] = [];
    for (let i = 0; i < LEVELS.length; i += 10) {
      chunks.push(LEVELS.slice(i, i + 10));
    }
    return chunks;
  }, []);

  const prevChapter = () => {
    setCurrentChapterIndex(prev => Math.max(0, prev - 1));
  };

  const nextChapter = () => {
    setCurrentChapterIndex(prev => Math.min(levelChapters.length - 1, prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !touchStartY.current || !touchEndY.current) return;
    
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 50) {
      if (distanceX > 0) nextChapter();
      else prevChapter();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  // Common Header Buttons
  const SettingsButtons = () => (
    <div className="flex gap-3">
        <button 
          onClick={toggleTheme}
          className="glass-button w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors"
        >
          {theme === Theme.DARK ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button 
          onClick={toggleLanguage}
          className="glass-button px-3 h-9 rounded-full flex items-center gap-2 text-xs font-bold text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors"
        >
          <Globe size={14} />
          {language === Language.EN ? '中文' : 'English'}
        </button>
    </div>
  );
  
  // Helper to get URL for hint (duplicating logic slightly but needed for this specific UI element without complex refactor)
  const getHintUrl = () => {
     return `https://picsum.photos/seed/${currentLevel.imageKeyword}-v2/800/800`;
     // Note: In a full offline implementation, this should also check for local file. 
     // But for the "Hold to Peek" feature, falling back to online-only is acceptable for now 
     // or we rely on browser cache if the PuzzleBoard already loaded it.
  };

  // --- MENU VIEW ---
  if (gameState === GameState.MENU) {
    const currentChapterLevels = levelChapters[currentChapterIndex] || [];
    const firstLevelName = currentChapterLevels[0]?.name[language] || "";
    const chapterTitle = firstLevelName.replace(/\s+[IVX]+$/, '');

    return (
      <div 
        className="h-[100dvh] w-full bg-[var(--bg-main)] flex flex-col items-center relative overflow-hidden touch-pan-y transition-colors duration-500"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Background Ambient */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--bg-main)] to-[var(--bg-main)] z-0 opacity-50"></div>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-rose-500/10 blur-[100px] z-0 pointer-events-none transition-opacity duration-500"></div>

        {/* Settings Toggle */}
        <div className="absolute top-6 right-6 z-50">
           <SettingsButtons />
        </div>

        {/* Header Area */}
        <div className="z-10 w-full max-w-md px-6 pt-12 pb-4 flex flex-col items-center">
          <h1 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-main)] to-[var(--text-sub)] drop-shadow-sm mb-1">
            {t.title}
          </h1>
          <p className="text-[var(--text-sub)] uppercase tracking-[0.3em] text-[10px]">{t.subtitle}</p>
        </div>

        {/* Chapter Navigation Bar */}
        <div className="z-10 w-full max-w-md px-4 mb-4 flex items-center justify-between">
          <button 
            onClick={prevChapter}
            disabled={currentChapterIndex === 0}
            className={`p-2 rounded-full transition-all ${currentChapterIndex === 0 ? 'text-[var(--text-sub)] opacity-30 cursor-not-allowed' : 'text-[var(--text-main)] hover:bg-[var(--btn-hover)]'}`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
              {language === Language.ZH ? `第 ${currentChapterIndex + 1} 章` : `Chapter ${currentChapterIndex + 1}`}
            </span>
            <h2 className="text-xl font-serif font-bold text-[var(--text-main)]">{chapterTitle}</h2>
          </div>

          <button 
            onClick={nextChapter}
            disabled={currentChapterIndex === levelChapters.length - 1}
            className={`p-2 rounded-full transition-all ${currentChapterIndex === levelChapters.length - 1 ? 'text-[var(--text-sub)] opacity-30 cursor-not-allowed' : 'text-[var(--text-main)] hover:bg-[var(--btn-hover)]'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Scrollable Level Grid Area */}
        <div className="z-10 flex-1 w-full max-w-md px-6 overflow-y-auto pb-20">
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-right-8 duration-500" key={currentChapterIndex}>
            {currentChapterLevels.map((lvl, idx) => {
              const globalIndex = currentChapterIndex * 10 + idx;
              const stat = levelStats[lvl.level] || { best: 0, unlocked: globalIndex === 0 };
              const isLocked = !IS_DEV_MODE && !stat.unlocked;
              const localizedName = lvl.name[language];

              // For menu thumbnails, we also use online URLs fallback logic. 
              // Ideally we would use a Thumbnail component, but for simplicity we stick to online for menu 
              // to avoid 100 network requests to check local files simultaneously.
              const thumbUrl = `https://picsum.photos/seed/${lvl.imageKeyword}-v2/200/150`;

              return (
                <button
                  key={lvl.level}
                  disabled={isLocked}
                  onClick={() => handleStartGame(globalIndex)}
                  className={`
                    relative group w-full aspect-[3/2] rounded-xl overflow-hidden border transition-all duration-300 text-left
                    ${isLocked 
                      ? 'border-[var(--border-color)] bg-[var(--bg-card)] opacity-50 grayscale cursor-not-allowed' 
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-rose-500/50 hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]'}
                  `}
                >
                  {/* Background Image */}
                  <img 
                    src={thumbUrl} 
                    alt={localizedName}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                  />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-[var(--bg-overlay)] to-transparent">
                     <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isLocked ? 'bg-[var(--bg-panel)] text-[var(--text-sub)]' : 'bg-rose-500 text-white'}`}>
                          {lvl.gridSize}x{lvl.gridSize}
                        </span>
                        {stat.best > 0 && (
                          <div className="flex items-center gap-1">
                             <Zap size={10} className="text-yellow-400 fill-yellow-400" />
                             <span className="text-[10px] font-bold text-yellow-400">{stat.best}</span>
                          </div>
                        )}
                     </div>

                     <div className="flex items-end justify-between">
                        <div className="text-left w-full">
                          <h3 className="text-sm font-medium text-[var(--text-main)] leading-tight truncate w-full pr-2">{localizedName}</h3>
                        </div>
                        {isLocked && <Lock size={12} className="text-[var(--text-sub)] shrink-0" />}
                     </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 flex gap-2 z-20">
          {levelChapters.map((_, idx) => (
            <div 
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentChapterIndex ? 'bg-rose-500 w-3' : 'bg-[var(--text-sub)] opacity-30'}`}
            />
          ))}
        </div>

      </div>
    );
  }

  // --- GAME VIEW ---
  const currentStats = levelStats[currentLevel.level] || { best: 0 };
  const localizedLevelName = currentLevel.name[language];

  return (
    <div className="h-[100dvh] w-full bg-[var(--bg-main)] flex flex-col items-center relative overflow-hidden touch-none transition-colors duration-500">
      
      {/* Ambient Background */}
      <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] -left-[20%] w-[60%] h-[60%] bg-rose-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Nav */}
      <div className="w-full max-w-md px-6 py-6 flex items-center justify-between z-20">
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--btn-hover)] text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors"
        >
           <ArrowLeft size={24} />
        </button>
        <div className="text-sm font-bold text-[var(--text-sub)] tracking-widest uppercase">
          {t.level} {currentLevel.level}
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 rounded-full bg-[var(--bg-panel)] border border-[var(--border-color)] flex items-center gap-2">
              <Zap size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-[var(--text-main)]">{currentStats.best}</span>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-md px-6 flex flex-col items-center z-10 justify-center pb-12">
        
        {/* Title & Timer */}
        <div className="w-full flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[var(--text-main)] leading-tight">{localizedLevelName}</h1>
            <p className="text-xs text-[var(--text-sub)] mt-1">{moves} {t.moves}</p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-mono font-light text-[var(--text-main)] opacity-80">
               {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}
             </div>
          </div>
        </div>

        {/* Puzzle Container */}
        <div className="w-full relative mb-8">
          <PuzzleBoard 
            key={`${currentLevel.level}-${gameId}`} 
            level={currentLevel}
            gameState={gameState}
            onMove={handleMove}
            onSolve={handleSolve}
          />

          {/* Hint Overlay */}
          <div 
             className={`absolute inset-0 rounded-xl overflow-hidden transition-all duration-500 pointer-events-none z-30
               ${showHint ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
             `}
           >
             <div className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm"></div>
             <img src={getHintUrl()} alt="Hint" className="absolute inset-0 w-full h-full object-cover opacity-90" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                  {t.referenceImage}
                </div>
             </div>
           </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full grid grid-cols-2 gap-4">
           <button 
             onMouseDown={() => setShowHint(true)}
             onMouseUp={() => setShowHint(false)}
             onMouseLeave={() => setShowHint(false)}
             onTouchStart={() => setShowHint(true)}
             onTouchEnd={() => setShowHint(false)}
             className="glass-button h-14 rounded-2xl flex items-center justify-center gap-2 text-[var(--text-sub)] hover:text-[var(--text-main)] active:scale-95"
           >
             <Eye size={20} />
             <span className="text-sm font-bold">{t.holdToPeek}</span>
           </button>

           <button 
             onClick={() => handleStartGame(currentLevelIndex)}
             className="glass-button h-14 rounded-2xl flex items-center justify-center gap-2 text-[var(--text-sub)] hover:text-rose-400 active:scale-95"
           >
             <span className="text-sm font-bold">{t.restart}</span>
           </button>
        </div>

      </div>

      {/* Modals */}
      {gameState === GameState.WON && (
        <VictoryModal 
          stats={{ 
            moves, 
            timeElapsed, 
            level: currentLevel.level,
            score: currentScore,
            stars: earnedStars,
            bestScore: levelStats[currentLevel.level].best,
            avgScore: levelStats[currentLevel.level].avg,
            isNewBest: isNewBest
          }}
          levelName={localizedLevelName}
          imageKeyword={currentLevel.imageKeyword}
          language={language}
          onNextLevel={handleNextLevel}
          onReplay={() => handleStartGame(currentLevelIndex)}
          onHome={() => setGameState(GameState.MENU)}
          hasNextLevel={currentLevelIndex < LEVELS.length - 1}
        />
      )}
    </div>
  );
}