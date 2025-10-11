import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Clock, Target } from 'lucide-react';
import './Leaderboard.css';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  games_completed: number;
  total_time: number;
  best_time?: number;
  current_streak: number;
  longest_streak: number;
  rank: number;
}

type LeaderboardType = 'best_time' | 'games_completed' | 'current_streak';
type GameFilter = 'all' | 'sudoku' | 'solitaire' | 'minesweeper';

const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [sortBy, setSortBy] = useState<LeaderboardType>('best_time');

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen, gameFilter, sortBy]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      
      // モックデータを使用
      const mockData: LeaderboardEntry[] = [
        {
          id: '1',
          user_id: '1',
          username: 'プレイヤー1',
          games_completed: 25,
          total_time: 1500,
          best_time: 45,
          current_streak: 5,
          longest_streak: 12,
          rank: 1
        },
        {
          id: '2',
          user_id: '2',
          username: 'プレイヤー2',
          games_completed: 18,
          total_time: 1200,
          best_time: 52,
          current_streak: 3,
          longest_streak: 8,
          rank: 2
        },
        {
          id: '3',
          user_id: '3',
          username: 'プレイヤー3',
          games_completed: 30,
          total_time: 1800,
          best_time: 38,
          current_streak: 7,
          longest_streak: 15,
          rank: 3
        }
      ];

      const sortedData = [...mockData].sort((a, b) => {
        switch (sortBy) {
          case 'best_time':
            if (!a.best_time) return 1;
            if (!b.best_time) return -1;
            return a.best_time - b.best_time;
          case 'games_completed':
            return b.games_completed - a.games_completed;
          case 'current_streak':
            return b.current_streak - a.current_streak;
          default:
            return 0;
        }
      });

      const rankedData = sortedData.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

      setLeaderboardData(rankedData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="rank-icon gold" size={20} />;
      case 2:
        return <Medal className="rank-icon silver" size={20} />;
      case 3:
        return <Award className="rank-icon bronze" size={20} />;
      default:
        return <span className="rank-number">{rank}</span>;
    }
  };

  const getSortLabel = (sortType: LeaderboardType): string => {
    switch (sortType) {
      case 'best_time': return '最短時間';
      case 'games_completed': return '完了数';
      case 'current_streak': return '連続成功';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="leaderboard-overlay" onClick={onClose}>
      <div className="leaderboard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="leaderboard-header">
          <h2>
            <Trophy size={24} />
            リーダーボード
          </h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="leaderboard-filters">
          <div className="filter-group">
            <label>ゲーム:</label>
            <select 
              value={gameFilter} 
              onChange={(e) => setGameFilter(e.target.value as GameFilter)}
            >
              <option value="all">全ゲーム</option>
              <option value="sudoku">数独</option>
              <option value="solitaire">ソリティア</option>
              <option value="minesweeper">マインスイーパ</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>並び順:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as LeaderboardType)}
            >
              <option value="best_time">最短時間</option>
              <option value="games_completed">完了数</option>
              <option value="current_streak">連続成功</option>
            </select>
          </div>
        </div>

        <div className="leaderboard-content">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>リーダーボードを読み込み中...</p>
            </div>
          ) : leaderboardData.length > 0 ? (
            <div className="leaderboard-list">
              <div className="leaderboard-header-row">
                <span className="rank-col">順位</span>
                <span className="name-col">プレイヤー</span>
                <span className="stat-col">
                  {getSortLabel(sortBy)}
                </span>
                <span className="games-col">完了数</span>
                <span className="streak-col">連続</span>
              </div>
              
              {leaderboardData.map((entry) => (
                <div key={entry.id} className="leaderboard-row">
                  <div className="rank-col">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="name-col">
                    <div className="player-info">
                      <div className="avatar">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="username">
                        {entry.username}
                      </span>
                    </div>
                  </div>
                  
                  <div className="stat-col">
                    {sortBy === 'best_time' && entry.best_time ? (
                      <span className="time-value">
                        <Clock size={14} />
                        {formatTime(entry.best_time)}
                      </span>
                    ) : sortBy === 'games_completed' ? (
                      <span className="count-value">
                        <Target size={14} />
                        {entry.games_completed}
                      </span>
                    ) : (
                      <span className="streak-value">
                        🔥 {entry.current_streak}
                      </span>
                    )}
                  </div>
                  
                  <div className="games-col">
                    {entry.games_completed}
                  </div>
                  
                  <div className="streak-col">
                    {entry.current_streak}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <Trophy size={48} />
              <h3>まだデータがありません</h3>
              <p>ゲームをプレイしてリーダーボードに参加しましょう！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
