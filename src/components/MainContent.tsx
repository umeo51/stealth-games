import React, { useState } from 'react';
import NewsSection from './NewsSection';
import GameArea from './GameArea';
import AdManager from './AdManager';
import './MainContent.css';

const MainContent: React.FC = () => {
  const [gameVisible, setGameVisible] = useState(false);

  const toggleGameVisibility = () => {
    setGameVisible(!gameVisible);
  };

  return (
    <div className="main-content">
      {/* ヘッダー広告 */}
      <AdManager position="header" size="responsive" />
      
      <div className="content-grid">
        {/* ニュースセクション */}
        <NewsSection 
          onToggleGame={toggleGameVisibility}
          gameVisible={gameVisible}
        />

        {/* サイドバー（ゲームエリア） */}
        <aside className="sidebar">
          {/* サイドバー広告 */}
          <AdManager position="sidebar" size="small" />
          
          {/* ゲームエリア */}
          <GameArea visible={gameVisible} />
        </aside>
      </div>
      
      {/* フッター広告 */}
      <AdManager position="footer" size="responsive" />
    </div>
  );
};

export default MainContent;
