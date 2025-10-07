import React, { useState, useEffect } from 'react';
import { SudokuGame, SudokuGrid } from './SudokuGame';
import './SudokuComponent.css';

interface SudokuComponentProps {
  onGameComplete?: (won: boolean, time: number, difficulty: string) => void;
}

const SudokuComponent: React.FC<SudokuComponentProps> = ({ onGameComplete }) => {
  const [game, setGame] = useState<SudokuGame>(new SudokuGame('easy'));
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [noteMode, setNoteMode] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    setGrid(game.getGrid());
  }, [game]);

  useEffect(() => {
    if (game.isComplete() && !gameComplete) {
      setGameComplete(true);
      const timeElapsed = Math.floor((Date.now() - game.getStartTime()) / 1000);
      onGameComplete?.(true, timeElapsed, game.getDifficulty());
    }
  }, [grid, game, gameComplete, onGameComplete]);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isFixed) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    if (noteMode) {
      const currentNotes = [...grid[row][col].notes];
      const noteIndex = currentNotes.indexOf(num);
      
      if (noteIndex > -1) {
        currentNotes.splice(noteIndex, 1);
      } else {
        currentNotes.push(num);
        currentNotes.sort();
      }
      
      game.setCellNotes(row, col, currentNotes);
    } else {
      game.setCellValue(row, col, num);
      // 数字を入力したらメモをクリア
      game.setCellNotes(row, col, []);
    }
    
    setGrid([...game.getGrid()]);
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    game.setCellValue(row, col, 0);
    game.setCellNotes(row, col, []);
    setGrid([...game.getGrid()]);
  };

  const handleNewGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    const newGame = new SudokuGame(difficulty);
    setGame(newGame);
    setGrid(newGame.getGrid());
    setSelectedCell(null);
    setGameComplete(false);
  };

  const handleHint = () => {
    const hint = game.getHint();
    if (hint) {
      game.setCellValue(hint.row, hint.col, hint.value);
      setGrid([...game.getGrid()]);
    }
  };

  const getCellClassName = (row: number, col: number) => {
    const cell = grid[row][col];
    let className = 'sudoku-cell';
    
    if (cell.isFixed) className += ' fixed';
    if (!cell.isValid) className += ' invalid';
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      className += ' selected';
    }
    
    // 同じ行、列、ボックスをハイライト
    if (selectedCell) {
      const { row: selRow, col: selCol } = selectedCell;
      if (row === selRow || col === selCol) {
        className += ' highlighted';
      }
      
      // 3x3ボックスのハイライト
      const boxRow = Math.floor(row / 3);
      const boxCol = Math.floor(col / 3);
      const selBoxRow = Math.floor(selRow / 3);
      const selBoxCol = Math.floor(selCol / 3);
      
      if (boxRow === selBoxRow && boxCol === selBoxCol) {
        className += ' highlighted';
      }
    }
    
    return className;
  };

  const renderCell = (row: number, col: number) => {
    const cell = grid[row][col];
    
    return (
      <div
        key={`${row}-${col}`}
        className={getCellClassName(row, col)}
        onClick={() => handleCellClick(row, col)}
      >
        {cell.value !== 0 ? (
          <span className="cell-value">{cell.value}</span>
        ) : (
          <div className="cell-notes">
            {cell.notes.map(note => (
              <span key={note} className="note">{note}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sudoku-container">
      <div className="sudoku-header">
        <h3>数独</h3>
        <div className="game-info">
          <span className="difficulty">難易度: {game.getDifficulty()}</span>
          {gameComplete && <span className="complete-badge">完了!</span>}
        </div>
      </div>

      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>

      <div className="sudoku-controls">
        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              className="number-btn"
              onClick={() => handleNumberInput(num)}
              disabled={!selectedCell}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button
            className={`mode-btn ${noteMode ? 'active' : ''}`}
            onClick={() => setNoteMode(!noteMode)}
          >
            メモ
          </button>
          <button
            className="clear-btn"
            onClick={handleClearCell}
            disabled={!selectedCell}
          >
            消去
          </button>
          <button
            className="hint-btn"
            onClick={handleHint}
          >
            ヒント
          </button>
        </div>

        <div className="difficulty-buttons">
          <button onClick={() => handleNewGame('easy')}>簡単</button>
          <button onClick={() => handleNewGame('medium')}>普通</button>
          <button onClick={() => handleNewGame('hard')}>難しい</button>
        </div>
      </div>
    </div>
  );
};

export default SudokuComponent;
