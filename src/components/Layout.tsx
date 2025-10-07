import React, { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
          </nav>
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
