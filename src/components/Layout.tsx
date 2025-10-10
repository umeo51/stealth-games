import React, { ReactNode, useState } from 'react';
import { User, LogIn } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showProfile, setShowProfile] = useState(false);

  const handleUserClick = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>Business Research Portal</h1>
          </div>
          <nav className="nav">
            <button className="nav-button">ニュース</button>
            <button className="nav-button">ゲーム</button>
            <button className="nav-button">ランキング</button>
            <button className="nav-button">実績</button>
          </nav>
          <div className="user-section">
            <button 
              className="user-button"
              onClick={handleUserClick}
            >
              <User size={20} />
              <span>ゲスト</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="main">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 Business Research Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
