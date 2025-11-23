export interface Tile {
  id: number;
  correctIndex: number; // Where it should be (0 to N-1)
  currentIndex: number; // Where it is currently on the grid
}

export interface GameStats {
  moves: number;
  timeElapsed: number;
  level: number;
  score: number;
  stars: number;
  bestScore: number;
  avgScore: number;
  isNewBest: boolean;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  WON = 'WON'
}

export enum Language {
  EN = 'en',
  ZH = 'zh'
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface LocalizedString {
  en: string;
  zh: string;
}

export interface LevelConfig {
  level: number;
  gridSize: number; // e.g., 3 for 3x3
  name: LocalizedString;
  description: LocalizedString;
  imageKeyword: string; // For picsum
}