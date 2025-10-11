// 開発環境用のモックSupabaseライブラリ

// データベーステーブルの型定義
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  game_type: 'sudoku' | 'solitaire' | 'minesweeper';
  difficulty: string;
  game_data: any;
  completed: boolean;
  score?: number;
  time_spent: number;
  created_at: string;
  completed_at?: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  game_type: 'sudoku' | 'solitaire' | 'minesweeper';
  games_played: number;
  games_completed: number;
  total_time: number;
  best_time?: number;
  average_time?: number;
  current_streak: number;
  longest_streak: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
}

// モックSupabaseクライアント
export const supabase = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Mock mode' } }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Mock mode' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    eq: () => Promise.resolve({ data: [], error: null }),
    order: () => Promise.resolve({ data: [], error: null }),
    limit: () => Promise.resolve({ data: [], error: null })
  })
};

// 認証ヘルパー関数
export const authHelpers = {
  getCurrentUser: () => Promise.resolve(null),
  onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } })
};

// プロフィールヘルパー関数
export const profileHelpers = {
  getUserProfile: (userId: string) => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
  createUserProfile: (profile: any) => Promise.resolve({ data: profile, error: null }),
  updateUserProfile: (userId: string, updates: any) => Promise.resolve({ data: null, error: null })
};

// ゲームセッションヘルパー関数
export const gameHelpers = {
  createGameSession: (session: any) => Promise.resolve({ data: session, error: null }),
  updateGameSession: (id: string, updates: any) => Promise.resolve({ data: null, error: null }),
  getUserGameSessions: (userId: string, gameType?: string) => Promise.resolve({ data: [], error: null }),
  getUserStats: (userId: string) => Promise.resolve({ data: [], error: null }),
  getLeaderboard: (gameType: string, limit: number = 10) => Promise.resolve({ data: [], error: null })
};

// 統計ヘルパー関数
export const statsHelpers = {
  getUserStats: (userId: string) => Promise.resolve({ data: [], error: null }),
  getUserGameStats: (userId: string, gameType: string) => Promise.resolve({ data: null, error: null }),
  updateUserStats: (userId: string, gameType: string, updates: any) => Promise.resolve({ data: null, error: null }),
  getLeaderboard: (gameType: string, limit: number = 10) => Promise.resolve({ data: [], error: null })
};

// 実績ヘルパー関数
export const achievementHelpers = {
  getUserAchievements: (userId: string) => Promise.resolve({ data: [], error: null }),
  unlockAchievement: (userId: string, achievementType: string) => Promise.resolve({ data: null, error: null }),
  checkAndUnlockAchievements: (userId: string, gameType: string, stats: any) => Promise.resolve([])
};
