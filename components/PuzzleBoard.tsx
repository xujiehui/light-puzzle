import React, { useState, useEffect, useCallback } from 'react';
import { Tile, GameState, LevelConfig } from '../types';
import { TILE_GAP } from '../constants';

interface PuzzleBoardProps {
  level: LevelConfig; // Changed to accept full level config
  gameState: GameState;
  onMove: () => void;
  onSolve: () => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  level,
  gameState,
  onMove,
  onSolve
}) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);
  const [isBoardReady, setIsBoardReady] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  // Image Loading Logic: Try Local -> Fallback to Online
  useEffect(() => {
    let isMounted = true;
    setIsBoardReady(false);
    setActiveImageUrl(null);

    const localSrc = `assets/images/level_${level.level}.jpg`;
    const onlineSrc = `https://picsum.photos/seed/${level.imageKeyword}-v2/800/800`;

    // 1. Try loading local image first
    const imgLocal = new Image();
    imgLocal.onload = () => {
      if (isMounted) {
        setActiveImageUrl(localSrc);
        // Small delay for visual smoothness
        setTimeout(() => setIsBoardReady(true), 50);
      }
    };

    imgLocal.onerror = () => {
      // 2. If local fails, load online image
      const imgOnline = new Image();
      imgOnline.onload = () => {
        if (isMounted) {
          setActiveImageUrl(onlineSrc);
          setTimeout(() => setIsBoardReady(true), 50);
        }
      };
      // If online fails, we might want to retry or show error, but for now we assume online works eventually
      imgOnline.src = onlineSrc;
    };

    imgLocal.src = localSrc;

    return () => { isMounted = false; };
  }, [level]);

  // Initialize Grid
  useEffect(() => {
    if (!activeImageUrl) return; // Wait for image

    const totalTiles = level.gridSize * level.gridSize;
    const newTiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
      id: i,
      correctIndex: i,
      currentIndex: i
    }));

    if (gameState === GameState.PLAYING) {
      // Shuffle
      let shuffled = [...newTiles];
      const positions = shuffled.map(t => t.currentIndex);
      
      // High quality shuffle
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      
      // Apply shuffled positions
      shuffled = shuffled.map((tile, idx) => ({
        ...tile,
        currentIndex: positions[idx]
      }));
      
      // Prevent accidental auto-solve on start
      const isSolved = shuffled.every(t => t.currentIndex === t.correctIndex);
      if (isSolved) {
        const temp = shuffled[0].currentIndex;
        shuffled[0].currentIndex = shuffled[1].currentIndex;
        shuffled[1].currentIndex = temp;
      }

      setTiles(shuffled);
    } else {
      // Menu or Won state: show solved board
      setTiles(newTiles);
    }
    
    setSelectedTileId(null);
  }, [level.gridSize, gameState, activeImageUrl]);

  const handleTileClick = (clickedTileId: number) => {
    if (gameState !== GameState.PLAYING) return;

    if (selectedTileId === null) {
      setSelectedTileId(clickedTileId);
    } else if (selectedTileId === clickedTileId) {
      setSelectedTileId(null);
    } else {
      swapTiles(selectedTileId, clickedTileId);
      setSelectedTileId(null);
    }
  };

  const swapTiles = (id1: number, id2: number) => {
    setTiles(prev => {
      const newTiles = [...prev];
      const t1 = newTiles.find(t => t.id === id1);
      const t2 = newTiles.find(t => t.id === id2);

      if (!t1 || !t2) return prev;

      const tempPos = t1.currentIndex;
      t1.currentIndex = t2.currentIndex;
      t2.currentIndex = tempPos;

      return newTiles;
    });
    onMove();
  };

  // Check Win
  useEffect(() => {
    if (gameState === GameState.PLAYING && isBoardReady && tiles.length > 0) {
      const isSolved = tiles.every(t => t.currentIndex === t.correctIndex);
      if (isSolved) {
        setTimeout(onSolve, 350);
      }
    }
  }, [tiles, gameState, onSolve, isBoardReady]);

  const getTileStyle = useCallback((tile: Tile) => {
    if (!activeImageUrl) return {};

    const row = Math.floor(tile.correctIndex / level.gridSize);
    const col = tile.correctIndex % level.gridSize;
    
    const xPercent = (col / (level.gridSize - 1)) * 100;
    const yPercent = (row / (level.gridSize - 1)) * 100;

    return {
      backgroundImage: `url(${activeImageUrl})`,
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      backgroundSize: `${level.gridSize * 100}%`,
    };
  }, [activeImageUrl, level.gridSize]);

  return (
    <div 
      className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] bg-[var(--bg-panel)] border border-[var(--border-color)] transition-colors duration-500"
    >
      {isBoardReady && activeImageUrl ? (
        tiles.map((tile) => {
          const currentRow = Math.floor(tile.currentIndex / level.gridSize);
          const currentCol = tile.currentIndex % level.gridSize;
          const isSelected = tile.id === selectedTileId;
          const sizePct = 100 / level.gridSize;

          return (
            <div
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              className={`absolute tile-transition overflow-hidden
                ${isSelected ? 'z-20 ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-[1.02]' : 'z-10 hover:brightness-110'}
              `}
              style={{
                ...getTileStyle(tile),
                width: `calc(${sizePct}% - ${TILE_GAP}px)`,
                height: `calc(${sizePct}% - ${TILE_GAP}px)`,
                left: `${currentCol * sizePct}%`,
                top: `${currentRow * sizePct}%`,
                marginLeft: `${TILE_GAP/2}px`,
                marginTop: `${TILE_GAP/2}px`,
                borderRadius: level.gridSize > 5 ? '2px' : '6px',
              }}
            >
               {/* Selection Overlay */}
               {isSelected && (
                 <div className="absolute inset-0 bg-rose-500/20 pointer-events-none" />
               )}
            </div>
          );
        })
      ) : (
        // Loading State
        <div className="absolute inset-0 bg-[var(--bg-main)] z-30 flex items-center justify-center">
           <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};