import React, { useState } from 'react';
import SudokuComponent from '../games/sudoku/SudokuComponent';
import SolitaireComponent from '../games/solitaire/SolitaireComponent';
import MinesweeperComponent from '../games/minesweeper/MinesweeperComponent';
import './GameArea.css';

interface GameAreaProps {
  visible: boolean;
}

type GameType = 'sudoku' | 'solitaire' | 'minesweeper';

const GameArea: React.FC<GameAreaProps> = ({ visible }) => {
  const [currentGame, setCurrentGame] = useState<GameType>('sudoku');

  if (!visible) {
    return null;
  }

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
        return null;
    }
  };

  return (
    <div className="game-area">
      <div className="game-selector">
        <button 
          className={currentGame === 'sudoku' ? 'active' : ''}
          onClick={() => setCurrentGame('sudoku')}
        >
          数独
        </button>
        <button 
          className={currentGame === 'solitaire' ? 'active' : ''}
          onClick={() => setCurrentGame('solitaire')}
        >
          ソリティア
        </button>
        <button 
          className={currentGame === 'minesweeper' ? 'active' : ''}
          onClick={() => setCurrentGame('minesweeper')}
        >
          マインスイーパー
        </button>
      </div>
      
      <div className="game-container">
        {renderGame()}
      </div>
    </div>
  );
};

export default GameArea;
