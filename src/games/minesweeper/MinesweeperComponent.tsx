import React, { useState, useEffect, useCallback } from 'react';
import { MinesweeperGame, Difficulty, Cell } from './MinesweeperGame';
import './MinesweeperComponent.css';

interface MinesweeperComponentProps {
  onGameComplete?: (won: boolean, time: number) => void;
}

const MinesweeperComponent: React.FC<MinesweeperComponentProps> = ({ onGameComplete }) => {
  const [game, setGame] = useState<MinesweeperGame>(new MinesweeperGame('beginner'));
  const [gameState, setGameState] = useState(game.getGameState());
  const [currentTime, setCurrentTime] = useState(0);

  // ゲーム状態を更新
  const updateGameState = useCallback(() => {
    const newState = game.getGameState();
    setGameState(newState);
    setCurrentTime(game.getGameTime());
    
    // ゲーム完了時のコールバック
    if ((game.isWon() || game.isLost()) && onGameComplete) {
      onGameComplete(game.isWon(), game.getGameTime());
    }
  }, [game, onGameComplete]);

  // タイマー更新
  useEffect(() => {
    const interval = setInterval(() => {
      if (game.isPlaying()) {
        setCurrentTime(game.getGameTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game]);

  // セルクリック処理
  const handleCellClick = (row: number, col: number, isRightClick: boolean = false) => {
    if (isRightClick) {
      game.toggleFlag(row, col);
    } else {
      game.clickCell(row, col);
    }
    updateGameState();
  };

  // セル右クリック処理
  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    handleCellClick(row, col, true);
  };

  // セル中クリック処理（コード）
  const handleCellMiddleClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (e.button === 1) { // 中クリック
      game.chordClick(row, col);
      updateGameState();
    }
  };

  // 新しいゲーム開始
  const handleNewGame = (difficulty: Difficulty) => {
    const newGame = new MinesweeperGame(difficulty);
    setGame(newGame);
    setGameState(newGame.getGameState());
    setCurrentTime(0);
  };

  // セルの表示内容を取得
  const getCellContent = (cell: Cell): string => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines.toString();
  };

  // セルのクラス名を取得
  const getCellClassName = (cell: Cell): string => {
    let className = 'minesweeper-cell';
    
    if (cell.isRevealed) {
      className += ' revealed';
      if (cell.isMine) {
        className += ' mine';
      } else if (cell.neighborMines > 0) {
        className += ` number-${cell.neighborMines}`;
      }
    } else {
      className += ' hidden';
      if (cell.isFlagged) {
        className += ' flagged';
      }
    }
    
    return className;
  };

  // ゲーム状態のアイコンを取得
  const getGameStatusIcon = (): string => {
    if (game.isWon()) return '😎';
    if (game.isLost()) return '😵';
    return '🙂';
  };

  return (
    <div className="minesweeper-container">
      <div className="minesweeper-header">
        <h3>マインスイーパ</h3>
        <div className="game-info">
          <span className="difficulty">
            難易度: {gameState.config.rows}×{gameState.config.cols} ({gameState.config.mines}個)
          </span>
        </div>
      </div>

      <div className="minesweeper-status">
        <div className="status-item">
          <span className="label">💣</span>
          <span className="value">{gameState.remainingMines}</span>
        </div>
        
        <button 
          className="status-face"
          onClick={() => handleNewGame('beginner')}
          title="新しいゲーム"
        >
          {getGameStatusIcon()}
        </button>
        
        <div className="status-item">
          <span className="label">⏱️</span>
          <span className="value">{currentTime}s</span>
        </div>
      </div>

      <div 
        className="minesweeper-grid"
        style={{
          gridTemplateColumns: `repeat(${gameState.config.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gameState.config.rows}, 1fr)`
        }}
      >
        {gameState.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(cell)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
              onMouseDown={(e) => handleCellMiddleClick(e, rowIndex, colIndex)}
              disabled={game.isWon() || game.isLost()}
            >
              {getCellContent(cell)}
            </button>
          ))
        )}
      </div>

      <div className="minesweeper-controls">
        <div className="difficulty-buttons">
          <button onClick={() => handleNewGame('beginner')}>
            初級 (9×9)
          </button>
          <button onClick={() => handleNewGame('intermediate')}>
            中級 (16×16)
          </button>
          <button onClick={() => handleNewGame('expert')}>
            上級 (16×30)
          </button>
        </div>
        
        <div className="game-instructions">
          <p>左クリック: セルを開く | 右クリック: 旗を立てる</p>
          <p>中クリック: 数字セルで周辺を一括開示</p>
        </div>
      </div>

      {(game.isWon() || game.isLost()) && (
        <div className="game-result">
          <h4>{game.isWon() ? '🎉 クリア!' : '💥 ゲームオーバー'}</h4>
          <p>時間: {currentTime}秒</p>
          {game.isWon() && (
            <p>おめでとうございます！</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MinesweeperComponent;
