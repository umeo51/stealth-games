import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gameHelpers } from '../lib/supabase';
import SudokuComponent from '../games/sudoku/SudokuComponent';
import SolitaireComponent from '../games/solitaire/SolitaireComponent';
import MinesweeperComponent from '../games/minesweeper/MinesweeperComponent';
import './GameArea.css';

interface GameAreaProps {
  visible: boolean;
}

type GameType = 'sudoku' | 'solitaire' | 'minesweeper' | null;

const GameArea: React.FC<GameAreaProps> = ({ visible }) => {
  const [currentGame, setCurrentGame] = useState<GameType>('sudoku');
  const [gamesCompleted, setGamesCompleted] = useState(0);
  const { user } = useAuth();

  // ゲーム完了時の処理
  const handleGameComplete = async (gameType: string, won: boolean, timeOrScore: number, difficulty?: string) => {
    setGamesCompleted(prev => prev + 1);
    
    if (!user) return;

    try {
      // ゲームセッションを保存
      const gameSession = {
        user_id: user.id,
        game_type: gameType as any,
        difficulty: difficulty || 'normal',
        game_data: { won, timeOrScore },
        completed: won,
        score: gameType === 'solitaire' ? timeOrScore : undefined,
        time_spent: gameType !== 'solitaire' ? timeOrScore : 0,
      };

      await gameHelpers.saveGameSession(gameSession);
      
      // ユーザー統計を更新
      await gameHelpers.updateUserStats(user.id, gameType as any, {
        ...gameSession,
        id: '',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving game session:', error);
    }
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'sudoku':
        return (
          <SudokuComponent 
            onGameComplete={(won, time, difficulty) => 
              handleGameComplete('sudoku', won, time, difficulty)
            }
          />
        );
      case 'solitaire':
        return (
          <SolitaireComponent 
            onGameComplete={(won, score, time) => 
              handleGameComplete('solitaire', won, score)
            }
          />
        );
      case 'minesweeper':
        return (
          <MinesweeperComponent 
            onGameComplete={(won, time) => 
              handleGameComplete('minesweeper', won, time)
            }
          />
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
      
      {!user && (
        <div className="guest-notice">
          <p>ゲストとしてプレイ中です。ログインすると進行状況が保存されます。</p>
        </div>
      )}
    </div>
  );
};

export default GameArea;
