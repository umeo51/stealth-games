import React, { useState, useEffect } from 'react';
import { SolitaireGame, Card } from './SolitaireGame';
import './SolitaireComponent.css';

interface SolitaireComponentProps {
  onGameComplete?: (won: boolean, score: number, time: number) => void;
}

const SolitaireComponent: React.FC<SolitaireComponentProps> = ({ onGameComplete }) => {
  const [game, setGame] = useState<SolitaireGame>(new SolitaireGame());
  const [gameState, setGameState] = useState(game.getGameState());
  const [selectedCard, setSelectedCard] = useState<{ pile: any; cardIndex: number } | null>(null);

  // ゲーム状態を更新
  const updateGameState = () => {
    const newState = game.getGameState();
    setGameState(newState);
    
    // ゲーム完了時のコールバック
    if (game.isGameComplete() && onGameComplete) {
      onGameComplete(true, game.getFinalScore(), newState.timeElapsed);
    }
  };

  // タイマー更新
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(game.getGameState());
    }, 1000);

    return () => clearInterval(interval);
  }, [game]);

  // カードクリック処理
  const handleCardClick = (pile: any, cardIndex: number) => {
    const card = pile.cards[cardIndex];
    
    if (!card || !card.faceUp) return;
    
    if (selectedCard) {
      // カードが選択されている場合、移動を試行
      if (selectedCard.pile === pile && selectedCard.cardIndex === cardIndex) {
        // 同じカードをクリックした場合、選択解除
        setSelectedCard(null);
      } else {
        // 異なるカードまたはパイルをクリックした場合、移動を試行
        const cardCount = selectedCard.pile.cards.length - selectedCard.cardIndex;
        const success = game.moveCard(selectedCard.pile, pile, selectedCard.cardIndex, cardCount);
        
        if (success) {
          setSelectedCard(null);
          updateGameState();
        }
      }
    } else {
      // カードが選択されていない場合、選択
      setSelectedCard({ pile, cardIndex });
    }
  };

  // ダブルクリック処理（ファウンデーションへの自動移動）
  const handleCardDoubleClick = (pile: any, cardIndex: number) => {
    const success = game.autoMoveToFoundation(pile, cardIndex);
    if (success) {
      setSelectedCard(null);
      updateGameState();
    }
  };

  // ストッククリック処理
  const handleStockClick = () => {
    game.drawFromStock();
    updateGameState();
  };

  // 新しいゲーム開始
  const handleNewGame = () => {
    const newGame = new SolitaireGame();
    setGame(newGame);
    setGameState(newGame.getGameState());
    setSelectedCard(null);
  };

  // ヒント機能
  const handleHint = () => {
    const hint = game.getHint();
    if (hint) {
      setSelectedCard({ pile: hint.from, cardIndex: hint.cardIndex });
    }
  };

  // カードの表示
  const renderCard = (card: Card, isSelected: boolean = false) => {
    const suitSymbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    };
    
    const rankSymbols = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    
    return (
      <div 
        className={`card ${card.faceUp ? 'face-up' : 'face-down'} ${isRed ? 'red' : 'black'} ${isSelected ? 'selected' : ''}`}
      >
        {card.faceUp ? (
          <>
            <span className="rank">{rankSymbols[card.rank]}</span>
            <span className="suit">{suitSymbols[card.suit]}</span>
          </>
        ) : (
          <span className="card-back">🂠</span>
        )}
      </div>
    );
  };

  // パイルの表示
  const renderPile = (pile: any, pileIndex?: number, pileType?: string) => {
    if (pile.cards.length === 0) {
      return (
        <div 
          className={`pile empty ${pileType || ''}`}
          onClick={() => selectedCard && handleCardClick(pile, 0)}
        >
          <div className="empty-slot">
            {pileType === 'foundation' && '🏠'}
            {pileType === 'tableau' && '📋'}
          </div>
        </div>
      );
    }
    
    return (
      <div className={`pile ${pileType || ''}`}>
        {pile.cards.map((card: Card, index: number) => {
          const isSelected = selectedCard?.pile === pile && selectedCard?.cardIndex === index;
          const isTopCard = index === pile.cards.length - 1;
          
          return (
            <div
              key={card.id}
              className={`card-container ${pileType === 'tableau' ? 'stacked' : ''}`}
              onClick={() => handleCardClick(pile, index)}
              onDoubleClick={() => handleCardDoubleClick(pile, index)}
            >
              {renderCard(card, isSelected)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="solitaire-container">
      <div className="solitaire-header">
        <h3>ソリティア</h3>
        <div className="game-info">
          <span>スコア: {gameState.score}</span>
          <span>手数: {gameState.moves}</span>
          <span>時間: {gameState.timeElapsed}s</span>
        </div>
      </div>

      <div className="solitaire-board">
        {/* 上段：ストック、ウェイスト、ファウンデーション */}
        <div className="top-row">
          <div className="stock-waste">
            <div 
              className="stock"
              onClick={handleStockClick}
            >
              {gameState.stock.cards.length > 0 ? (
                renderCard(gameState.stock.cards[gameState.stock.cards.length - 1])
              ) : (
                <div className="empty-slot">🔄</div>
              )}
            </div>
            
            <div className="waste">
              {gameState.waste.cards.length > 0 ? (
                renderPile(gameState.waste)
              ) : (
                <div className="empty-slot"></div>
              )}
            </div>
          </div>
          
          <div className="foundations">
            {gameState.foundation.map((foundation, index) => (
              <div key={index}>
                {renderPile(foundation, index, 'foundation')}
              </div>
            ))}
          </div>
        </div>

        {/* 下段：タブロー */}
        <div className="tableau-row">
          {gameState.tableau.map((tableau, index) => (
            <div key={index} className="tableau-column">
              {renderPile(tableau, index, 'tableau')}
            </div>
          ))}
        </div>
      </div>

      <div className="solitaire-controls">
        <button onClick={handleNewGame}>新しいゲーム</button>
        <button onClick={handleHint}>ヒント</button>
        {selectedCard && (
          <button onClick={() => setSelectedCard(null)}>選択解除</button>
        )}
      </div>

      {game.isGameComplete() && (
        <div className="game-result">
          <h4>🎉 クリア!</h4>
          <p>最終スコア: {game.getFinalScore()}</p>
          <p>時間: {gameState.timeElapsed}秒</p>
          <p>手数: {gameState.moves}</p>
        </div>
      )}
    </div>
  );
};

export default SolitaireComponent;
