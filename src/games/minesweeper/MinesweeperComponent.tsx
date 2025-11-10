// マインスイーパーコンポーネント v2.6.0 - 改善された地雷リセット＆レイアウト最適化
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
  const [lastTap, setLastTap] = useState<{ row: number; col: number; time: number } | null>(null);

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



  // モバイル用ダブルタップ検出
  const handleCellTap = (row: number, col: number) => {
    const now = Date.now();
    const doubleTapDelay = 300; // 300ms以内のタップをダブルタップとして認識
    const cell = gameState.grid[row][col];
    
    // 既に開いている数字セルの場合、即座にコードクリックを実行
    if (cell.isRevealed && cell.neighborMines > 0) {
      game.chordClick(row, col);
      updateGameState();
      return;
    }
    
    if (lastTap && 
        lastTap.row === row && 
        lastTap.col === col && 
        now - lastTap.time < doubleTapDelay) {
      // ダブルタップ: フラグを切り替え
      game.toggleFlag(row, col);
      setLastTap(null); // ダブルタップ後はリセット
      // バイブレーション（対応デバイスのみ）
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } else {
      // シングルタップ: セルを開く（少し遅延させてダブルタップを待つ）
      setLastTap({ row, col, time: now });
      setTimeout(() => {
        setLastTap(current => {
          if (current && current.row === row && current.col === col && current.time === now) {
            // ダブルタップが発生しなかった場合、セルを開く
            game.clickCell(row, col);
            updateGameState();
            return null;
          }
          return current;
        });
      }, doubleTapDelay);
    }
    updateGameState();
  };

  // セルクリック処理
  const handleCellClick = (row: number, col: number) => {
    const cell = gameState.grid[row][col];
    
    // 既に開いている数字セルの場合、コードクリックを実行
    if (cell.isRevealed && cell.neighborMines > 0) {
      game.chordClick(row, col);
      updateGameState();
      return;
    }
    
    // モバイルデバイスかどうかを判定
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile) {
      handleCellTap(row, col);
      return;
    }
    
    // デスクトップでは通常のクリック処理
    game.clickCell(row, col);
    updateGameState();
  };

  // セル右クリック処理（デスクトップ用フラグ）
  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    // モバイルデバイスの場合は何もしない（ダブルタップで処理）
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile) {
      return;
    }
    
    game.toggleFlag(row, col);
    updateGameState();
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
          <span className="label">❤️</span>
          <span className="value">{gameState.lives}</span>
        </div>
        
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
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
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
          <p className="desktop-instructions">左クリック: セルを開く | 右クリック: 旗を立てる</p>
          <p className="desktop-instructions">数字セルクリック: フラグ数が一致すると周辺を一括開示</p>
          <p className="mobile-instructions">タップ: セルを開く | ダブルタップ: 旗を立てる</p>
          <p className="mobile-instructions">数字セルタップ: フラグ数が一致すると周辺を一括開示</p>
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
// Force rebuild Mon Nov 10 05:28:40 EST 2025
