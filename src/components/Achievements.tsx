import React, { useState, useEffect } from 'react';
import { Award, Star, Target, Clock, Zap, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { gameHelpers, UserStats } from '../lib/supabase';
import './Achievements.css';

interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'games' | 'time' | 'streak' | 'special';
  requirement: (stats: UserStats[]) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [earnedAchievements, setEarnedAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  // 称号の定義
  const achievementDefinitions: AchievementDefinition[] = [
    // ゲーム完了系
    {
      id: 'first_win',
      name: '初勝利',
      description: '初めてゲームをクリアしました',
      icon: <Star size={24} />,
      category: 'games',
      requirement: (stats) => stats.some(s => s.games_completed >= 1),
      rarity: 'common'
    },
    {
      id: 'ten_wins',
      name: '熟練者',
      description: '10回ゲームをクリアしました',
      icon: <Target size={24} />,
      category: 'games',
      requirement: (stats) => stats.reduce((sum, s) => sum + s.games_completed, 0) >= 10,
      rarity: 'common'
    },
    {
      id: 'fifty_wins',
      name: 'エキスパート',
      description: '50回ゲームをクリアしました',
      icon: <Award size={24} />,
      category: 'games',
      requirement: (stats) => stats.reduce((sum, s) => sum + s.games_completed, 0) >= 50,
      rarity: 'rare'
    },
    {
      id: 'hundred_wins',
      name: 'マスター',
      description: '100回ゲームをクリアしました',
      icon: <Trophy size={24} />,
      category: 'games',
      requirement: (stats) => stats.reduce((sum, s) => sum + s.games_completed, 0) >= 100,
      rarity: 'epic'
    },
    
    // 連続成功系
    {
      id: 'streak_5',
      name: '連勝スタート',
      description: '5連勝を達成しました',
      icon: <Zap size={24} />,
      category: 'streak',
      requirement: (stats) => stats.some(s => s.longest_streak >= 5),
      rarity: 'common'
    },
    {
      id: 'streak_10',
      name: '連勝記録',
      description: '10連勝を達成しました',
      icon: <Zap size={24} />,
      category: 'streak',
      requirement: (stats) => stats.some(s => s.longest_streak >= 10),
      rarity: 'rare'
    },
    {
      id: 'streak_20',
      name: '無敗神話',
      description: '20連勝を達成しました',
      icon: <Zap size={24} />,
      category: 'streak',
      requirement: (stats) => stats.some(s => s.longest_streak >= 20),
      rarity: 'epic'
    },
    
    // 時間系
    {
      id: 'speed_sudoku',
      name: '数独スピードスター',
      description: '数独を3分以内でクリアしました',
      icon: <Clock size={24} />,
      category: 'time',
      requirement: (stats) => stats.some(s => s.game_type === 'sudoku' && s.best_time && s.best_time <= 180),
      rarity: 'rare'
    },
    {
      id: 'speed_minesweeper',
      name: 'マインスイーパ名人',
      description: 'マインスイーパ初級を30秒以内でクリアしました',
      icon: <Clock size={24} />,
      category: 'time',
      requirement: (stats) => stats.some(s => s.game_type === 'minesweeper' && s.best_time && s.best_time <= 30),
      rarity: 'epic'
    },
    
    // 特別系
    {
      id: 'all_games',
      name: 'オールラウンダー',
      description: '全てのゲームをクリアしました',
      icon: <Award size={24} />,
      category: 'special',
      requirement: (stats) => {
        const gameTypes = ['sudoku', 'solitaire', 'minesweeper'];
        return gameTypes.every(type => stats.some(s => s.game_type === type && s.games_completed >= 1));
      },
      rarity: 'rare'
    },
    {
      id: 'dedication',
      name: '献身的プレイヤー',
      description: '総プレイ時間が10時間を超えました',
      icon: <Clock size={24} />,
      category: 'time',
      requirement: (stats) => stats.reduce((sum, s) => sum + s.total_time, 0) >= 36000, // 10時間
      rarity: 'epic'
    },
    {
      id: 'perfectionist',
      name: '完璧主義者',
      description: '完了率100%を達成しました（10ゲーム以上プレイ）',
      icon: <Star size={24} />,
      category: 'special',
      requirement: (stats) => {
        const totalPlayed = stats.reduce((sum, s) => sum + s.games_played, 0);
        const totalCompleted = stats.reduce((sum, s) => sum + s.games_completed, 0);
        return totalPlayed >= 10 && totalPlayed === totalCompleted;
      },
      rarity: 'legendary'
    }
  ];

  useEffect(() => {
    if (isOpen && user) {
      loadUserAchievements();
    }
  }, [isOpen, user]);

  const loadUserAchievements = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // ユーザーの統計を取得
      const { data: stats, error } = await gameHelpers.getUserStats(user.id);
      
      if (!error && stats) {
        setUserStats(stats);
        
        // 達成した称号を計算
        const earned: UserAchievement[] = [];
        
        achievementDefinitions.forEach(achievement => {
          if (achievement.requirement(stats)) {
            earned.push({
              id: achievement.id,
              name: achievement.name,
              description: achievement.description,
              icon: achievement.icon,
              earnedAt: new Date(), // 実際の実装では達成日時を保存
              rarity: achievement.rarity
            });
          }
        });
        
        setEarnedAchievements(earned);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return '#6c757d';
      case 'rare': return '#007bff';
      case 'epic': return '#6f42c1';
      case 'legendary': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  const getRarityLabel = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'コモン';
      case 'rare': return 'レア';
      case 'epic': return 'エピック';
      case 'legendary': return 'レジェンダリー';
      default: return '';
    }
  };

  const getProgressStats = () => {
    const totalAchievements = achievementDefinitions.length;
    const earnedCount = earnedAchievements.length;
    const progress = totalAchievements > 0 ? (earnedCount / totalAchievements) * 100 : 0;
    
    return { totalAchievements, earnedCount, progress };
  };

  if (!isOpen) return null;

  const { totalAchievements, earnedCount, progress } = getProgressStats();

  return (
    <div className="achievements-overlay" onClick={onClose}>
      <div className="achievements-modal" onClick={(e) => e.stopPropagation()}>
        <div className="achievements-header">
          <h2>
            <Award size={24} />
            称号・実績
          </h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="achievements-progress">
          <div className="progress-info">
            <span className="progress-text">
              {earnedCount} / {totalAchievements} 達成
            </span>
            <span className="progress-percentage">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="achievements-content">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>称号を読み込み中...</p>
            </div>
          ) : (
            <div className="achievements-grid">
              {achievementDefinitions.map(achievement => {
                const isEarned = earnedAchievements.some(e => e.id === achievement.id);
                
                return (
                  <div 
                    key={achievement.id} 
                    className={`achievement-card ${isEarned ? 'earned' : 'locked'} ${achievement.rarity}`}
                  >
                    <div className="achievement-icon" style={{ color: getRarityColor(achievement.rarity) }}>
                      {achievement.icon}
                    </div>
                    
                    <div className="achievement-info">
                      <h4 className="achievement-name">
                        {achievement.name}
                      </h4>
                      <p className="achievement-description">
                        {achievement.description}
                      </p>
                      <div className="achievement-meta">
                        <span 
                          className="rarity-badge"
                          style={{ 
                            backgroundColor: getRarityColor(achievement.rarity),
                            color: 'white'
                          }}
                        >
                          {getRarityLabel(achievement.rarity)}
                        </span>
                        {isEarned && (
                          <span className="earned-badge">
                            ✓ 達成済み
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!user && (
          <div className="login-prompt">
            <p>ログインして称号を獲得しましょう！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
