import React, { useState, useEffect } from 'react'
import SudokuComponent from './games/sudoku/SudokuComponent'
import SolitaireComponent from './games/solitaire/SolitaireComponent'
import MinesweeperComponent from './games/minesweeper/MinesweeperComponent'
import { User } from 'lucide-react'
import { newsService, NewsArticle } from './services/newsService'
import './App.css'

function App() {
  const [gameVisible, setGameVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState<'sudoku' | 'solitaire' | 'minesweeper'>('sudoku');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // モバイル表示の検知
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ニュースを取得
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const newsData = await newsService.fetchNews(25); // 25件以上のニュースを取得
        setNews(newsData);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
    
    // 10分ごとにニュースを更新
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 数独ゲーム完了ハンドラー
  const handleSudokuComplete = (won: boolean, time: number, difficulty: string) => {
    console.log(`Sudoku completed: won: ${won}, time: ${time}, difficulty: ${difficulty}`);
  };

  // ソリティアゲーム完了ハンドラー
  const handleSolitaireComplete = (won: boolean, score: number, time: number) => {
    console.log(`Solitaire completed: won: ${won}, score: ${score}, time: ${time}`);
  };

  // マインスイーパーゲーム完了ハンドラー
  const handleMinesweeperComplete = (won: boolean, time: number) => {
    console.log(`Minesweeper completed: won: ${won}, time: ${time}`);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'sudoku':
        return <SudokuComponent onGameComplete={handleSudokuComplete} />;
      case 'solitaire':
        return <SolitaireComponent onGameComplete={handleSolitaireComplete} />;
      case 'minesweeper':
        return <MinesweeperComponent onGameComplete={handleMinesweeperComplete} />;
      default:
        return <div>ゲームを選択してください</div>;
    }
  };

  return (
    <div className="App">
      {/* ヘッダー */}
      <header style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: isMobile ? '0.5rem' : '0'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: isMobile ? '1.2rem' : '1.5rem',
          width: isMobile ? '100%' : 'auto',
          textAlign: isMobile ? 'center' : 'left',
          order: isMobile ? -1 : 0
        }}>Business Research Portal</h1>
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '0.5rem' : '1rem',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          justifyContent: isMobile ? 'center' : 'flex-end',
          width: isMobile ? '100%' : 'auto'
        }}>
          <button style={{ 
            backgroundColor: '#e8f5e8', 
            color: '#2d5016', 
            border: 'none', 
            padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: isMobile ? '0.875rem' : '1rem',
            minHeight: isMobile ? '40px' : 'auto'
          }}>
            ニュース
          </button>
          <button 
            onClick={() => setGameVisible(!gameVisible)}
            style={{ 
              backgroundColor: gameVisible ? '#ffebcd' : '#e6f3ff', 
              color: gameVisible ? '#8b4513' : '#1e3a8a', 
              border: 'none', 
              padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: isMobile ? '0.875rem' : '1rem',
              minHeight: isMobile ? '40px' : 'auto'
            }}
          >
            {gameVisible ? 'ゲームを隠す' : 'ゲームを表示'}
          </button>
          <button style={{ 
            backgroundColor: '#fff4e6', 
            color: '#cc7a00', 
            border: 'none', 
            padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: isMobile ? '0.875rem' : '1rem',
            minHeight: isMobile ? '40px' : 'auto'
          }}>
            ランキング
          </button>
          {/* 修正項目：初期アバター表示 */}
          <button style={{ 
            backgroundColor: '#f0f0f0', 
            color: '#333', 
            border: 'none', 
            padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: isMobile ? '0.875rem' : '1rem',
            minHeight: isMobile ? '40px' : 'auto'
          }}>
            <User size={isMobile ? 16 : 20} />
            <span>ゲスト</span>
          </button>
        </div>
      </header>

      {/* ヘッダー広告エリア（修正項目：追従しない固定表示） */}
      {!isMobile && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          textAlign: 'center',
          borderBottom: '1px solid #ddd'
        }}>
          ヘッダー広告エリア
        </div>
      )}

      {/* メインコンテンツ（修正項目：ニュースと広告が同じスクロール、画面幅最大活用） */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: isMobile ? 'auto' : 'calc(100vh - 200px)',
        gap: isMobile ? '0.5rem' : '1rem',
        padding: isMobile ? '0.5rem' : '1rem'
      }}>
        {/* ニュースセクション */}
        <div style={{ 
          flex: isMobile ? '1' : '3',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: isMobile ? '1rem' : '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          order: isMobile ? 1 : 0
        }}>
          <h2 style={{ 
            marginTop: 0, 
            marginBottom: isMobile ? '1rem' : '1.5rem',
            color: '#2c3e50',
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            最新ニュース
          </h2>
          
          {/* ニュース記事一覧 */}
          {newsLoading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#666'
            }}>
              ニュースを読み込み中...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
              {news.map((article) => (
              <div key={article.uuid} style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '0.75rem' : '1rem',
                padding: isMobile ? '0.75rem' : '1rem',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}>
                {/* サムネイル画像 */}
                {article.image_url && (
                  <div style={{ 
                    flexShrink: 0,
                    alignSelf: isMobile ? 'center' : 'flex-start'
                  }}>
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      style={{ 
                        width: isMobile ? '100%' : '200px', 
                        maxWidth: isMobile ? '300px' : '200px',
                        height: isMobile ? 'auto' : '120px', 
                        objectFit: 'cover',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onError={(e) => {
                        // 画像読み込みエラー時のフォールバック
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* 記事内容 */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    color: '#2c3e50',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    {article.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 0.75rem 0',
                    color: '#666',
                    lineHeight: '1.6',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    {article.snippet ? article.snippet.substring(0, 200) + '...' : article.description}
                  </p>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: '#888',
                    borderTop: '1px solid #eee',
                    paddingTop: '0.5rem'
                  }}>
                    <span style={{ fontWeight: '500' }}>{article.source}</span>
                    <span>{article.published_at}</span>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
          
          {/* ニュース件数表示 */}
          {!newsLoading && (
            <div style={{
              textAlign: 'center',
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '0.875rem',
              color: '#666'
            }}>
              表示中: {news.length}件のニュース
            </div>
          )}
        </div>

        {/* ゲームエリア（修正項目：表示幅を1.5倍程度） */}
        {gameVisible && (
          <div style={{ 
            flex: isMobile ? '1' : '2',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: isMobile ? '1rem' : '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            order: isMobile ? 0 : 1
          }}>
            <h2 style={{ 
              marginTop: 0, 
              marginBottom: '1rem',
              color: '#2c3e50',
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              ゲームエリア
            </h2>
            
            {/* ゲーム選択ボタン */}
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? '0.25rem' : '0.5rem', 
              marginBottom: '1rem',
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <button
                onClick={() => setCurrentGame('sudoku')}
                style={{
                  backgroundColor: currentGame === 'sudoku' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  minHeight: isMobile ? '40px' : 'auto',
                  flex: isMobile ? '1' : 'none'
                }}
              >
                数独
              </button>
              <button
                onClick={() => setCurrentGame('solitaire')}
                style={{
                  backgroundColor: currentGame === 'solitaire' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  minHeight: isMobile ? '40px' : 'auto',
                  flex: isMobile ? '1' : 'none'
                }}
              >
                ソリティア
              </button>
              <button
                onClick={() => setCurrentGame('minesweeper')}
                style={{
                  backgroundColor: currentGame === 'minesweeper' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  minHeight: isMobile ? '40px' : 'auto',
                  flex: isMobile ? '1' : 'none'
                }}
              >
                マインスイーパー
              </button>
            </div>

            {/* ゲームコンポーネント */}
            <div style={{ 
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: isMobile ? '0.5rem' : '1rem',
              backgroundColor: '#f8f9fa',
              overflow: 'auto'
            }}>
              {renderGame()}
            </div>
          </div>
        )}

        {/* サイドバー広告（修正項目：固定表示、追従しない） */}
        {!isMobile && (
          <div style={{ 
            width: '300px',
            flexShrink: 0
          }}>
          <div style={{ 
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6c757d' }}>サイドバー広告</h4>
            <div style={{ 
              height: '200px',
              backgroundColor: '#e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              borderRadius: '4px'
            }}>
              広告スペース
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6c757d' }}>追加広告</h4>
            <div style={{ 
              height: '150px',
              backgroundColor: '#e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              borderRadius: '4px'
            }}>
              追加広告スペース
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
