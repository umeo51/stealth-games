import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseの設定を取得
// 本番環境では実際のSupabaseプロジェクトのURLとキーを設定してください
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  game_data: any; // ゲーム固有のデータ
  completed: boolean;
  score?: number;
  time_spent: number; // 秒単位
  created_at: string;
  completed_at?: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  game_type: 'sudoku' | 'solitaire' | 'minesweeper';
  games_played: number;
  games_completed: number;
  total_time: number; // 秒単位
  best_time?: number; // 秒単位
  average_time?: number; // 秒単位
  current_streak: number;
  longest_streak: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  earned_at: string;
}

// 認証関連のヘルパー関数
export const authHelpers = {
  // ユーザー登録
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    return { data, error };
  },

  // ログイン
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // ログアウト
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // 現在のユーザーを取得
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // 認証状態の変更を監視
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ゲームデータ関連のヘルパー関数
export const gameHelpers = {
  // ゲームセッションを保存
  async saveGameSession(gameSession: Omit<GameSession, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert([gameSession])
      .select()
      .single();
    return { data, error };
  },

  // ゲームセッションを更新
  async updateGameSession(id: string, updates: Partial<GameSession>) {
    const { data, error } = await supabase
      .from('game_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // ユーザーのゲームセッション履歴を取得
  async getUserGameSessions(userId: string, gameType?: string) {
    let query = supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // ユーザー統計を取得
  async getUserStats(userId: string, gameType?: string) {
    let query = supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId);

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // ユーザー統計を更新
  async updateUserStats(userId: string, gameType: string, sessionData: GameSession) {
    // 既存の統計を取得
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', gameType)
      .single();

    const now = new Date().toISOString();

    if (existingStats) {
      // 既存の統計を更新
      const updates: Partial<UserStats> = {
        games_played: existingStats.games_played + 1,
        total_time: existingStats.total_time + sessionData.time_spent,
        updated_at: now,
      };

      if (sessionData.completed) {
        updates.games_completed = existingStats.games_completed + 1;
        updates.current_streak = existingStats.current_streak + 1;
        updates.longest_streak = Math.max(
          existingStats.longest_streak,
          updates.current_streak || 0
        );

        if (!existingStats.best_time || sessionData.time_spent < existingStats.best_time) {
          updates.best_time = sessionData.time_spent;
        }

        const completedGames = updates.games_completed || existingStats.games_completed;
        if (completedGames > 0) {
          updates.average_time = Math.round(
            (existingStats.total_time + sessionData.time_spent) / completedGames
          );
        }
      } else {
        updates.current_streak = 0;
      }

      const { data, error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId)
        .eq('game_type', gameType)
        .select()
        .single();

      return { data, error };
    } else {
      // 新しい統計を作成
      const newStats: Omit<UserStats, 'id'> = {
        user_id: userId,
        game_type: gameType as any,
        games_played: 1,
        games_completed: sessionData.completed ? 1 : 0,
        total_time: sessionData.time_spent,
        best_time: sessionData.completed ? sessionData.time_spent : undefined,
        average_time: sessionData.completed ? sessionData.time_spent : undefined,
        current_streak: sessionData.completed ? 1 : 0,
        longest_streak: sessionData.completed ? 1 : 0,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('user_stats')
        .insert([newStats])
        .select()
        .single();

      return { data, error };
    }
  },

  // リーダーボードを取得
  async getLeaderboard(gameType: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        *,
        user_profiles (username, avatar_url)
      `)
      .eq('game_type', gameType)
      .order('best_time', { ascending: true })
      .limit(limit);

    return { data, error };
  },
};

// プロフィール関連のヘルパー関数
export const profileHelpers = {
  // ユーザープロフィールを取得
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // ユーザープロフィールを更新
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // ユーザープロフィールを作成
  async createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        ...profile,
        created_at: now,
        updated_at: now,
      }])
      .select()
      .single();
    return { data, error };
  },
};
