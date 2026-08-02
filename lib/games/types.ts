export interface IGameInfo {
  slug: string;
  name: string;
  description: string;
  generated: boolean;
  moveSchema: Record<string, string>;
}

export interface IGameSessionStart {
  sessionId: string;
  game: string;
  status: "active" | "finished";
  score: number;
  done: boolean;
  aiGenerated: boolean;
  view: any;
}

export interface IGameMoveResponse {
  sessionId: string;
  game: string;
  status: "active" | "finished";
  score: number;
  done: boolean;
  view: any;
  progression?: {
    level: number;
    xp: number;
    levelUp?: boolean;
    streak?: number;
    xpGained?: number;
  } | null;
  newAchievements?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface IMyScore {
  gameSlug: string;
  bestScore: number;
  totalScore: number;
  plays: number;
  lastPlayedAt: string;
}

export interface IGlobalLeaderboardEntry {
  userId: string;
  username?: string;
  email?: string;
  totalScore: number;
  totalPlays: number;
}
