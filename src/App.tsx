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

// モックニュースデータ
const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "最新技術トレンドについて",
    description: "今年注目すべき技術トレンドをまとめました。AI、クラウド、セキュリティなど幅広い分野での進歩が期待されています。",
    image_url: "https://via.placeholder.com/150x100/4A90E2/FFFFFF?text=Tech",
    source: "Tech News",
    published_at: "2025-10-10"
  },
  {
    id: 2,
    title: "ビジネス戦略の新しいアプローチ",
    description: "デジタル変革時代における効果的なビジネス戦略について専門家が解説します。",
    image_url: "https://via.placeholder.com/150x100/50C878/FFFFFF?text=Business",
    source: "Business Today",
    published_at: "2025-10-10"
  },
  {
    id: 3,
    title: "市場分析レポート2025",
    description: "2025年の市場動向と投資機会について詳細な分析を提供します。",
    image_url: "https://via.placeholder.com/150x100/FF6B6B/FFFFFF?text=Market",
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
        background: '#2c3e50', 
        color: 'white', 
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <h1>Business Research Portal</h1>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button style={{ margin: '0 0.5rem', padding: '0.5rem 1rem' }}>ニュース</button>
          <button 
            style={{ margin: '0 0.5rem', padding: '0.5rem 1rem' }}
            onClick={() => setGameVisible(!gameVisible)}
          >
            {gameVisible ? 'ゲームを隠す' : 'ゲームを表示'}
          </button>
          <button style={{ margin: '0 0.5rem', padding: '0.5rem 1rem' }}>ランキング</button>
          {/* 修正項目: 初期アバターが表示されていない問題を解決 */}
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#34495e',
            border: 'none',
            color: 'white',
            borderRadius: '4px'
          }}>
            <User size={20} />
            <span>ゲスト</span>
          </button>
        </nav>
      </header>

      {/* ヘッダー広告 */}
      <div style={{ 
        background: '#e9ecef',
        padding: '1rem',
        textAlign: 'center',
        borderBottom: '1px solid #dee2e6'
      }}>
        <p>ヘッダー広告エリア</p>
      </div>

      {/* メインコンテンツ - 修正項目: 画面幅を最大活用、ニュースと広告が別スクロールをやめる */}
      <main style={{ 
        display: 'flex', 
        minHeight: 'calc(100vh - 200px)',
        gap: '1rem',
        padding: '1rem',
        maxWidth: '100%'
      }}>
        {/* ニュースセクション - 修正項目: 右サイドの広告、ゲームの表示幅を1.5倍程度にする */}
        <section style={{ 
          flex: gameVisible ? '3' : '4', // ゲーム表示時は幅を調整
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto' // 修正項目: 別スクロールをやめる
        }}>
          <h2>最新ニュース</h2>
          <div>
            {mockNews.map((article) => (
              <article key={article.id} style={{ 
                marginBottom: '1rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                display: 'flex',
                gap: '1rem'
              }}>
                {article.image_url && (
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{article.title}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>{article.description}</p>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                    <span>{article.source}</span> • <span>{article.published_at}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ゲームエリア - 修正項目: 表示幅を1.5倍程度にする */}
        {gameVisible && (
          <aside style={{ 
            flex: '2', // 1.5倍程度の幅
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <h3>ゲームエリア</h3>
            <div style={{ marginBottom: '1rem' }}>
              <button 
                style={{ 
                  margin: '0 0.5rem 0.5rem 0', 
                  padding: '0.5rem 1rem',
                  background: currentGame === 'sudoku' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
                onClick={() => setCurrentGame('sudoku')}
              >
                数独
              </button>
              <button 
                style={{ 
                  margin: '0 0.5rem 0.5rem 0', 
                  padding: '0.5rem 1rem',
                  background: currentGame === 'solitaire' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
                onClick={() => setCurrentGame('solitaire')}
              >
                ソリティア
              </button>
              <button 
                style={{ 
                  margin: '0 0.5rem 0.5rem 0', 
                  padding: '0.5rem 1rem',
                  background: currentGame === 'minesweeper' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
                onClick={() => setCurrentGame('minesweeper')}
              >
                マインスイーパー
              </button>
            </div>
            
            <div style={{ 
              background: 'white',
              padding: '1rem',
              borderRadius: '8px',
              minHeight: '400px'
            }}>
              {renderGame()}
            </div>
          </aside>
        )}

        {/* 右サイドバー広告エリア - 修正項目: 右上の広告が追従する問題を修正 */}
        <aside style={{ 
          width: '300px',
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          {/* 修正項目: 追従しない固定広告 */}
          <div style={{ 
            background: '#e9ecef',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '8px',
            marginBottom: '1rem',
            position: 'static' // 追従をやめる
          }}>
            <p>サイドバー広告</p>
          </div>
          <div style={{ 
            background: '#e9ecef',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '8px'
          }}>
            <p>追加広告</p>
          </div>
        </aside>
      </main>

      {/* フッター広告 */}
      <div style={{ 
        background: '#e9ecef',
        padding: '1rem',
        textAlign: 'center',
        borderTop: '1px solid #dee2e6'
      }}>
        <p>フッター広告エリア</p>
      </div>

      {/* フッター */}
      <footer style={{ 
        background: '#2c3e50', 
        color: 'white', 
        padding: '1rem',
        textAlign: 'center'
      }}>
        <p>&copy; 2025 Business Research Portal. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
