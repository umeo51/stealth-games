import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { newsService, NewsArticle } from '../services/newsService';
import './NewsSection.css';

interface NewsSectionProps {
  onToggleGame: () => void;
  gameVisible: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({ onToggleGame, gameVisible }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async () => {
    try {
      setLoading(true);
      const articles = await newsService.fetchNews(5);
      setNews(articles);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    try {
      setRefreshing(true);
      const articles = await newsService.fetchNews(5);
      setNews(articles);
    } catch (error) {
      console.error('Failed to refresh news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
    
    // 5分ごとに自動更新
    const interval = setInterval(loadNews, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="news-section">
        <div className="section-header">
          <h2>最新ビジネスニュース</h2>
          <div className="header-actions">
            <button className="refresh-btn" disabled>
              <RefreshCw size={16} />
            </button>
            <button 
              className="stealth-toggle"
              onClick={onToggleGame}
              title={gameVisible ? "ゲームを隠す" : "ゲームを表示"}
            >
              {gameVisible ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
        </div>
        
        <div className="news-loading">
          <div className="loading-spinner"></div>
          <p>ニュースを読み込み中...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="news-section">
      <div className="section-header">
        <h2>最新ビジネスニュース</h2>
        <div className="header-actions">
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={refreshNews}
            disabled={refreshing}
            title="ニュースを更新"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            className="stealth-toggle"
            onClick={onToggleGame}
            title={gameVisible ? "ゲームを隠す" : "ゲームを表示"}
          >
            {gameVisible ? "👁️‍🗨️" : "👁️"}
          </button>
        </div>
      </div>
      
      <div className="news-list">
        {news.map((article) => (
          <article key={article.uuid} className="news-item">
            <h3 className="news-title">{article.title}</h3>
            <p className="news-description">{article.description}</p>
            <div className="news-meta">
              <span className="news-source">{article.source}</span>
              <span className="news-time">{article.published_at}</span>
              {article.categories.length > 0 && (
                <div className="news-categories">
                  {article.categories.slice(0, 2).map((category, index) => (
                    <span key={index} className="news-category">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      
      <div className="news-footer">
        <p className="last-updated">
          最終更新: {new Date().toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </section>
  );
};

export default NewsSection;
