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

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <section className="news-section">
      <div className="section-header">
        <h2>最新ニュース</h2>
        <div className="header-actions">
          <button 
            className="refresh-button"
            onClick={loadNews}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            更新
          </button>
          <button 
            className="game-toggle-button"
            onClick={onToggleGame}
          >
            {gameVisible ? 'ゲームを隠す' : 'ゲームを表示'}
          </button>
        </div>
      </div>

      <div className="news-list">
        {loading ? (
          <div className="loading">ニュースを読み込み中...</div>
        ) : (
          news.map((article) => (
            <article key={article.uuid} className="news-item">
              <div className="news-content">
                {article.image_url && (
                  <div className="news-thumbnail">
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <div className="thumbnail-placeholder" style={{ display: 'none' }}>
                      📰
                    </div>
                  </div>
                )}
                <div className="news-text">
                  <h4>{article.title}</h4>
                  <p className="news-description">{article.description}</p>
                  <div className="news-meta">
                    <span className="news-source">{article.source}</span>
                    <span className="news-date">
                      {new Date(article.published_at).toLocaleDateString('ja-JP')}
                    </span>
                    {article.categories && (
                      <div className="news-categories">
                        {article.categories.map((category) => (
                          <span key={category} className="category-tag">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default NewsSection;
