import React, { useState } from 'react';
import SudokuComponent from '../games/sudoku/SudokuComponent';
import './GameArea.css';

interface GameAreaProps {
  visible: boolean;
}

type GameType = 'sudoku' | 'solitaire' | 'minesweeper' | null;

const GameArea: React.FC<GameAreaProps> = ({ visible }) => {
  const [currentGame, setCurrentGame] = useState<GameType>('sudoku');
  const [gamesCompleted, setGamesCompleted] = useState(0);

  const handleGameComplete = () => {
    setGamesCompleted(prev => prev + 1);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'sudoku':
        return <SudokuComponent onGameComplete={handleGameComplete} />;
      case 'solitaire':
        return (
          <div className="game-placeholder">
            <h4>ソリティア</h4>
            <p>近日公開予定</p>
          </div>
        );
      case 'minesweeper':
        return (
          <div className="game-placeholder">
            <h4>マインスイーパ</h4>
            <p>近日公開予定</p>
          </div>
        );
      default:
        return (
          <div className="game-placeholder">
            <h4>ゲームを選択してください</h4>
          </div>
        );
    }
  };

  if (!visible) {
    return (
      <div className="game-area hidden">
        <div className="analysis-placeholder">
          <h4>データ分析中...</h4>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <div className="fake-metrics">
            <div className="metric">
              <span className="label">処理済み:</span>
              <span className="value">1,247 件</span>
            </div>
            <div className="metric">
              <span className="label">進捗:</span>
              <span className="value">67%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-area visible">
      <div className="game-header">
        <div className="game-tabs">
          <button
            className={`game-tab ${currentGame === 'sudoku' ? 'active' : ''}`}
            onClick={() => setCurrentGame('sudoku')}
          >
            数独
          </button>
          <button
            className={`game-tab ${currentGame === 'solitaire' ? 'active' : ''}`}
            onClick={() => setCurrentGame('solitaire')}
          >
            ソリティア
          </button>
          <button
            className={`game-tab ${currentGame === 'minesweeper' ? 'active' : ''}`}
            onClick={() => setCurrentGame('minesweeper')}
          >
            マインスイーパ
          </button>
        </div>
        
        {gamesCompleted > 0 && (
          <div className="stats">
            <span className="games-completed">完了: {gamesCompleted}</span>
          </div>
        )}
      </div>

      <div className="game-content">
        {renderGame()}
      </div>
    </div>
  );
};

export default GameArea;
