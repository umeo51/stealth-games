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
          
          <div className="widget">
            <h3>市場データ</h3>
            <div className="market-data">
              <div className="data-item">
                <span className="label">日経平均</span>
                <span className="value positive">38,915.87 (+0.8%)</span>
              </div>
              <div className="data-item">
                <span className="label">TOPIX</span>
                <span className="value positive">2,731.33 (+0.6%)</span>
              </div>
              <div className="data-item">
                <span className="label">USD/JPY</span>
                <span className="value negative">149.25 (-0.2%)</span>
              </div>
            </div>
          </div>

          {/* ゲームエリア */}
          <div className="game-widget">
            <h3>分析ツール</h3>
            <GameArea visible={gameVisible} />
            
            {/* ゲームエリア内広告（カモフラージュ） */}
            {gameVisible && (
              <AdManager position="game-area" size="medium" />
            )}
          </div>

          <div className="widget">
            <h3>注目記事</h3>
            <ul className="trending-list">
              <li>新興市場への投資戦略</li>
              <li>ESG投資の最新トレンド</li>
              <li>デジタル通貨の将来性</li>
              <li>サステナブル経営の重要性</li>
            </ul>
          </div>
          
          {/* サイドバー下部広告 */}
          <AdManager position="sidebar" size="small" />
        </aside>
      </div>
      
      {/* フッター広告 */}
      <AdManager position="footer" size="responsive" />
    </div>
  );
};

export default MainContent;
