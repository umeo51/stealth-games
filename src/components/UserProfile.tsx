import React, { useState, useEffect } from 'react';
import { User, Settings, Trophy, Clock, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { gameHelpers, UserStats } from '../lib/supabase';
import './UserProfile.css';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadUserStats();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
    }
  }, [profile]);

  const loadUserStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await gameHelpers.getUserStats(user.id);
      
      if (!error && data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!username.trim()) return;
    
    try {
      const { error } = await updateProfile({ username: username.trim() });
      
      if (!error) {
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    } else if (minutes > 0) {
      return `${minutes}分${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  const getGameTypeLabel = (gameType: string): string => {
    switch (gameType) {
      case 'sudoku': return '数独';
      case 'solitaire': return 'ソリティア';
      case 'minesweeper': return 'マインスイーパ';
      default: return gameType;
    }
  };

  if (!isOpen || !user || !profile) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <div className="profile-info">
            <div className="avatar">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="アバター" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="user-details">
              {editMode ? (
                <div className="edit-username">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="username-input"
                  />
                  <div className="edit-actions">
                    <button onClick={handleUpdateProfile} className="save-btn">
                      保存
                    </button>
                    <button 
                      onClick={() => {
                        setEditMode(false);
                        setUsername(profile.username);
                      }} 
                      className="cancel-btn"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="username-display">
                  <h3>{profile.username}</h3>
                  <button 
                    onClick={() => setEditMode(true)} 
                    className="edit-btn"
                    title="ユーザー名を編集"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              )}
              <p className="email">{profile.email}</p>
            </div>
          </div>
          
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="profile-content">
          <div className="stats-section">
            <h4>
              <Trophy size={20} />
              ゲーム統計
            </h4>
            
            {loading ? (
              <div className="loading">統計を読み込み中...</div>
            ) : stats.length > 0 ? (
              <div className="stats-grid">
                {stats.map((stat) => (
                  <div key={stat.game_type} className="stat-card">
                    <h5>{getGameTypeLabel(stat.game_type)}</h5>
                    
                    <div className="stat-item">
                      <Target size={16} />
                      <span className="label">プレイ回数:</span>
                      <span className="value">{stat.games_played}</span>
                    </div>
                    
                    <div className="stat-item">
                      <Trophy size={16} />
                      <span className="label">完了回数:</span>
                      <span className="value">{stat.games_completed}</span>
                    </div>
                    
                    {stat.best_time && (
                      <div className="stat-item">
                        <Clock size={16} />
                        <span className="label">最短時間:</span>
                        <span className="value">{formatTime(stat.best_time)}</span>
                      </div>
                    )}
                    
                    <div className="stat-item">
                      <span className="label">連続成功:</span>
                      <span className="value">{stat.current_streak}</span>
                    </div>
                    
                    <div className="stat-item">
                      <span className="label">最長連続:</span>
                      <span className="value">{stat.longest_streak}</span>
                    </div>
                    
                    <div className="completion-rate">
                      <span className="label">完了率:</span>
                      <span className="value">
                        {stat.games_played > 0 
                          ? Math.round((stat.games_completed / stat.games_played) * 100)
                          : 0
                        }%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-stats">
                <p>まだゲームをプレイしていません。</p>
                <p>ゲームを完了すると統計が表示されます。</p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-footer">
          <button onClick={handleSignOut} className="signout-btn">
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
