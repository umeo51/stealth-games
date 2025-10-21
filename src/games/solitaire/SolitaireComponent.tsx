// ソリティアコンポーネント - 裏向きカード表示修正版 v2.1
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
    
    // 修正項目: 空の列への移動を許可
    if (!card && selectedCard) {
      // 空の列にカードを移動しようとしている場合
      const cardCount = selectedCard.pile.cards.length - selectedCard.cardIndex;
      const success = game.moveCard(selectedCard.pile, pile, selectedCard.cardIndex, cardCount);
      
      if (success) {
        setSelectedCard(null);
        updateGameState();
      }
      return;
    }
    
    if (!card || !card.faceUp) return;
    
    if (selectedCard) {
      // カードが選択されている場合、移動を試行
      if (selectedCard.pile === pile && selectedCard.cardIndex === cardIndex) {
        // 同じカードをクリックした場合、選択解除
        setSelectedCard(null);
      } else {
        // 修正項目: 別のカードを選択した場合、選択状態を更新
        // まず移動を試行
        const cardCount = selectedCard.pile.cards.length - selectedCard.cardIndex;
        const success = game.moveCard(selectedCard.pile, pile, selectedCard.cardIndex, cardCount);
        
        if (success) {
          setSelectedCard(null);
          updateGameState();
        } else {
          // 移動できない場合、新しいカードを選択
          setSelectedCard({ pile, cardIndex });
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
            {/* 左上に数字と記号を表示 */}
            <div className="card-corner top-left">
              <div className="rank-large">{rankSymbols[card.rank]}</div>
              <div className="suit-small">{suitSymbols[card.suit]}</div>
            </div>
            {/* 中央の大きな表示 */}
            <div className="card-center">
              {card.rank === 'J' || card.rank === 'Q' || card.rank === 'K' ? (
                <div className="face-card">
                  <div className="face-rank">{rankSymbols[card.rank]}</div>
                  <div className="face-suit">{suitSymbols[card.suit]}</div>
                </div>
              ) : (
                <div className="number-card">
                  <div className="number-rank">{rankSymbols[card.rank]}</div>
                  <div className="number-suit">{suitSymbols[card.suit]}</div>
                </div>
              )}
            </div>
            {/* 右下に数字と記号を表示 */}
            <div className="card-corner bottom-right">
              <div className="rank-large">{rankSymbols[card.rank]}</div>
              <div className="suit-small">{suitSymbols[card.suit]}</div>
            </div>
          </>
        ) : (
          <div className="card-back-design">
            <div className="back-pattern"></div>
          </div>
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
    
    // 標準的なソリティアの表示ロジック - 簡素化版
    if (pileType === 'tableau') {
      return (
        <div className={`pile ${pileType}`}>
          {pile.cards.map((card: Card, index: number) => {
            const isSelected = selectedCard?.pile === pile && selectedCard?.cardIndex === index;
            const isFaceUpCard = card.faceUp;
            
            // 裏向きカードは3pxずつ、表向きカードは25pxずつずらす
            const topOffset = isFaceUpCard ? 
              (pile.cards.slice(0, index).filter(c => !c.faceUp).length * 3) + (pile.cards.slice(0, index).filter(c => c.faceUp).length * 25) :
              index * 3;
            
            return (
              <div
                key={`${card.suit}-${card.rank}-${index}`}
                className={`card-container tableau-card ${isFaceUpCard ? 'face-up-stacked' : 'face-down'}`}
                style={{
                  position: 'absolute',
                  top: `${topOffset}px`,
                  left: '0px',
                  zIndex: index + 1
                }}
                onClick={() => handleCardClick(pile, index)}
                onDoubleClick={() => handleCardDoubleClick(pile, index)}
              >
                {renderCard(card, isSelected)}
              </div>
            );
          })}
        </div>
      );
    }
    
    // その他のパイル（ストック、ウェイスト、ファウンデーション）
    return (
      <div className={`pile ${pileType || ''}`}>
        {pile.cards.map((card: Card, index: number) => {
          const isSelected = selectedCard?.pile === pile && selectedCard?.cardIndex === index;
          const isTopCard = index === pile.cards.length - 1;
          
          return (
            <div
              key={card.id}
              className="card-container"
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
