import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './MainContent.css';

const MainContent: React.FC = () => {
  const [gameVisible, setGameVisible] = useState(false);

  const toggleGameVisibility = () => {
    setGameVisible(!gameVisible);
  };

  return (
    <div className="main-content">
      <div className="content-grid">
        {/* ニュースセクション */}
        <section className="news-section">
          <div className="section-header">
            <h2>最新ビジネスニュース</h2>
            <button 
              className="stealth-toggle"
              onClick={toggleGameVisibility}
              title={gameVisible ? "ゲームを隠す" : "ゲームを表示"}
            >
              {gameVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          <div className="news-list">
            <article className="news-item">
              <h3>2025年第1四半期の経済見通し</h3>
              <p>専門家による最新の経済分析と市場予測をお届けします。インフレ率の動向と企業業績への影響について詳しく解説...</p>
              <span className="news-time">2時間前</span>
            </article>
            
            <article className="news-item">
              <h3>テクノロジー業界の最新動向</h3>
              <p>AI技術の進歩が各業界に与える影響と、今後の投資機会について分析します。特に注目すべき企業と技術トレンド...</p>
              <span className="news-time">4時間前</span>
            </article>
            
            <article className="news-item">
              <h3>グローバル市場レポート</h3>
              <p>世界各国の株式市場の動向と、為替相場の変動要因について詳細に分析。投資家が注目すべきポイントを整理...</p>
              <span className="news-time">6時間前</span>
            </article>
          </div>
        </section>

        {/* サイドバー（ゲームエリア） */}
        <aside className="sidebar">
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
          <div className={`game-widget ${gameVisible ? 'visible' : 'hidden'}`}>
            <h3>分析ツール</h3>
            <div className="game-container">
              {gameVisible ? (
                <div className="game-placeholder">
                  <p>ゲームエリア</p>
                  <p>（数独、ソリティアなど）</p>
                </div>
              ) : (
                <div className="tool-placeholder">
                  <p>データ分析中...</p>
                  <div className="loading-bar">
                    <div className="loading-progress"></div>
                  </div>
                </div>
              )}
            </div>
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
        </aside>
      </div>
    </div>
  );
};

export default MainContent;
