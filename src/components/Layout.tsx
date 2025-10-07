import React, { ReactNode, useState } from 'react';
import { User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import Leaderboard from './Leaderboard';
import Achievements from './Achievements';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const handleUserClick = () => {
    if (user) {
      setShowProfile(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Business Research Portal</h1>
          <nav className="nav">
            <a href="#news">ニュース</a>
            <a href="#research">リサーチ</a>
            <a href="#analytics">分析</a>
            <a href="#reports">レポート</a>
            
            <button 
              className="nav-btn"
              onClick={() => setShowLeaderboard(true)}
              title="リーダーボード"
            >
              🏆 ランキング
            </button>
            
            <button 
              className="nav-btn"
              onClick={() => setShowAchievements(true)}
              title="称号・実績"
            >
              🏅 称号
            </button>
            
            <button 
              className="user-btn"
              onClick={handleUserClick}
              disabled={loading}
            >
              {user ? (
                <>
                  <User size={16} />
                  <span>{profile?.username || 'ユーザー'}</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>ログイン</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </header>
      
      <main className="main">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 Business Research Portal. All rights reserved.</p>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
      
      <Leaderboard 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />
      
      <Achievements 
        isOpen={showAchievements} 
        onClose={() => setShowAchievements(false)} 
      />
    </div>
  );
};

export default Layout;
