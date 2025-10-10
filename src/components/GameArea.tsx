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

  const handleGameComplete = (gameType: string, won: boolean, timeOrScore: number, difficulty?: string) => {
    console.log(`Game completed: ${gameType}, won: ${won}, score: ${timeOrScore}`);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'sudoku':
        return <SudokuComponent onGameComplete={handleGameComplete} />;
      case 'solitaire':
        return <SolitaireComponent onGameComplete={handleGameComplete} />;
      case 'minesweeper':
        return <MinesweeperComponent onGameComplete={handleGameComplete} />;
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
