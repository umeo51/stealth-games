import React, { useState } from 'react'
import SudokuComponent from './games/sudoku/SudokuComponent'
import SolitaireComponent from './games/solitaire/SolitaireComponent'
import MinesweeperComponent from './games/minesweeper/MinesweeperComponent'
import { User } from 'lucide-react'
import './App.css'

// 簡単なニュース記事の型定義
interface NewsArticle {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  source: string;
  published_at: string;
}

// モックニュースデータ（修正項目：実際に動作するサムネイル画像付き）
const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "最新技術トレンドについて",
    description: "今年注目すべき技術トレンドをまとめました。AI、クラウド、セキュリティなど幅広い分野での進歩が期待されています。",
    image_url: "https://picsum.photos/150/100?random=1",
    source: "Tech News",
    published_at: "2025-10-10"
  },
  {
    id: 2,
    title: "ビジネス戦略の新しいアプローチ",
    description: "デジタル変革時代における効果的なビジネス戦略について専門家が解説します。",
    image_url: "https://picsum.photos/150/100?random=2",
    source: "Business Today",
    published_at: "2025-10-10"
  },
  {
    id: 3,
    title: "市場分析レポート2025",
    description: "2025年の市場動向と投資機会について詳細な分析を提供します。",
    image_url: "https://picsum.photos/150/100?random=3",
    source: "Market Watch",
    published_at: "2025-10-10"
  }
];

function App() {
  const [gameVisible, setGameVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState<'sudoku' | 'solitaire' | 'minesweeper'>('sudoku');

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
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Business Research Portal</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ 
            backgroundColor: '#e8f5e8', 
            color: '#2d5016', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            ニュース
          </button>
          <button 
            onClick={() => setGameVisible(!gameVisible)}
            style={{ 
              backgroundColor: gameVisible ? '#ffebcd' : '#e6f3ff', 
              color: gameVisible ? '#8b4513' : '#1e3a8a', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {gameVisible ? 'ゲームを隠す' : 'ゲームを表示'}
          </button>
          <button style={{ 
            backgroundColor: '#fff4e6', 
            color: '#cc7a00', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            ランキング
          </button>
          {/* 修正項目：初期アバター表示 */}
          <button style={{ 
            backgroundColor: '#f0f0f0', 
            color: '#333', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <User size={20} />
            <span>ゲスト</span>
          </button>
        </div>
      </header>

      {/* ヘッダー広告エリア（修正項目：追従しない固定表示） */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1rem', 
        textAlign: 'center',
        borderBottom: '1px solid #ddd'
      }}>
        ヘッダー広告エリア
      </div>

      {/* メインコンテンツ（修正項目：ニュースと広告が同じスクロール、画面幅最大活用） */}
      <div style={{ 
        display: 'flex', 
        minHeight: 'calc(100vh - 200px)',
        gap: '1rem',
        padding: '1rem'
      }}>
        {/* ニュースセクション */}
        <div style={{ 
          flex: '3',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            marginTop: 0, 
            marginBottom: '1.5rem',
            color: '#2c3e50',
            fontSize: '1.5rem'
          }}>
            最新ニュース
          </h2>
          
          {/* 修正項目：ニュースにサムネイル表示追加 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mockNews.map((article) => (
              <div key={article.id} style={{ 
                display: 'flex', 
                gap: '1rem',
                padding: '1rem',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}>
                {/* サムネイル画像 */}
                {article.image_url && (
                  <div style={{ flexShrink: 0 }}>
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      style={{ 
                        width: '150px', 
                        height: '100px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
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
                    fontSize: '1.1rem',
                    color: '#2c3e50'
                  }}>
                    {article.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 0.5rem 0',
                    color: '#555',
                    lineHeight: '1.5'
                  }}>
                    {article.description}
                  </p>
                  <div style={{ 
                    fontSize: '0.875rem',
                    color: '#6c757d'
                  }}>
                    {article.source} • {article.published_at}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ゲームエリア（修正項目：表示幅を1.5倍程度） */}
        {gameVisible && (
          <div style={{ 
            flex: '2',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              marginTop: 0, 
              marginBottom: '1rem',
              color: '#2c3e50'
            }}>
              ゲームエリア
            </h2>
            
            {/* ゲーム選択ボタン */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setCurrentGame('sudoku')}
                style={{
                  backgroundColor: currentGame === 'sudoku' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
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
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
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
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                マインスイーパー
              </button>
            </div>

            {/* ゲームコンポーネント */}
            <div style={{ 
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              overflow: 'auto'
            }}>
              {renderGame()}
            </div>
          </div>
        )}

        {/* サイドバー広告（修正項目：固定表示、追従しない） */}
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
      </div>
    </div>
  );
}

export default App;
