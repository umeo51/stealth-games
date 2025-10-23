// ソリティア（クロンダイク）ゲームのロジック

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: number; // 1-13 (A, 2-10, J, Q, K)
  faceUp: boolean;
  id: string;
}

export interface Pile {
  cards: Card[];
  type: 'tableau' | 'foundation' | 'stock' | 'waste';
}

export class SolitaireGame {
  private tableau: Pile[]; // 7つのタブロー
  private foundation: Pile[]; // 4つのファウンデーション
  private stock: Pile; // ストック
  private waste: Pile; // ウェイスト
  private moves: number;
  private score: number;
  private startTime: number;

  constructor() {
    this.tableau = [];
    this.foundation = [];
    this.stock = { cards: [], type: 'stock' };
    this.waste = { cards: [], type: 'waste' };
    this.moves = 0;
    this.score = 0;
    this.startTime = Date.now();
    this.initializeGame();
  }

  // ゲームを初期化
  private initializeGame(): void {
    const deck = this.createDeck();
    this.shuffleDeck(deck);
    
    // タブローを初期化（7列）
    this.tableau = Array(7).fill(null).map(() => ({ cards: [], type: 'tableau' as const }));
    
    // ファウンデーションを初期化（4つのスート）
    this.foundation = Array(4).fill(null).map(() => ({ cards: [], type: 'foundation' as const }));
    
    // タブローにカードを配る
    let cardIndex = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck[cardIndex++];
        card.faceUp = row === col; // 最後のカードのみ表向き
        this.tableau[col].cards.push(card);
      }
    }
    
    // 残りのカードをストックに
    this.stock.cards = deck.slice(cardIndex).map(card => ({ ...card, faceUp: false }));
  }

  // デッキを作成
  private createDeck(): Card[] {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const deck: Card[] = [];
    
    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({
          suit,
          rank,
          faceUp: false,
          id: `${suit}-${rank}`
        });
      }
    }
    
    return deck;
  }

  // デッキをシャッフル
  private shuffleDeck(deck: Card[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  // カードの色を取得
  private getCardColor(card: Card): 'red' | 'black' {
    return card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
  }

  // タブローでの移動が有効かチェック
  private isValidTableauMove(card: Card, targetPile: Pile): boolean {
    if (targetPile.cards.length === 0) {
      return card.rank === 13; // キングのみ空のタブローに置ける
    }
    
    const topCard = targetPile.cards[targetPile.cards.length - 1];
    return (
      this.getCardColor(card) !== this.getCardColor(topCard) &&
      card.rank === topCard.rank - 1
    );
  }

  // ファウンデーションでの移動が有効かチェック
  private isValidFoundationMove(card: Card, targetPile: Pile): boolean {
    if (targetPile.cards.length === 0) {
      return card.rank === 1; // エースのみ空のファウンデーションに置ける
    }
    
    const topCard = targetPile.cards[targetPile.cards.length - 1];
    return (
      card.suit === topCard.suit &&
      card.rank === topCard.rank + 1
    );
  }

  // 公開メソッド

  // ゲーム状態を取得
  getGameState() {
    return {
      tableau: this.tableau,
      foundation: this.foundation,
      stock: this.stock,
      waste: this.waste,
      moves: this.moves,
      score: this.score,
      timeElapsed: Math.floor((Date.now() - this.startTime) / 1000)
    };
  }

  // ストックからウェイストにカードを引く
  drawFromStock(): boolean {
    if (this.stock.cards.length === 0) {
      // ストックが空の場合、ウェイストをストックに戻す
      if (this.waste.cards.length === 0) return false;
      
      this.stock.cards = this.waste.cards.reverse().map(card => ({ ...card, faceUp: false }));
      this.waste.cards = [];
      this.moves++;
      return true;
    }
    
    const card = this.stock.cards.pop();
    if (card) {
      card.faceUp = true;
      this.waste.cards.push(card);
      this.moves++;
      return true;
    }
    
    return false;
  }

  // カードを移動
  moveCard(
    fromPile: Pile,
    toPile: Pile,
    cardIndex: number,
    cardCount: number = 1
  ): boolean {
    if (fromPile.cards.length <= cardIndex) return false;
    
    const cardsToMove = fromPile.cards.slice(cardIndex, cardIndex + cardCount);
    const topCard = cardsToMove[0];
    
    // 移動の有効性をチェック
    let isValid = false;
    
    if (toPile.type === 'tableau') {
      isValid = this.isValidTableauMove(topCard, toPile);
    } else if (toPile.type === 'foundation') {
      isValid = cardCount === 1 && this.isValidFoundationMove(topCard, toPile);
    }
    
    if (!isValid) return false;
    
    // カードを移動
    fromPile.cards.splice(cardIndex, cardCount);
    toPile.cards.push(...cardsToMove);
    
    // 移動元のタブローで新しいカードを表向きにする
    if (fromPile.type === 'tableau' && fromPile.cards.length > 0) {
      const lastCard = fromPile.cards[fromPile.cards.length - 1];
      if (!lastCard.faceUp) {
        lastCard.faceUp = true;
        this.score += 5; // 新しいカードを表向きにしたボーナス
      }
    }
    
    // スコア計算
    if (toPile.type === 'foundation') {
      this.score += 10;
    } else if (fromPile.type === 'waste' && toPile.type === 'tableau') {
      this.score += 5;
    }
    
    this.moves++;
    return true;
  }

  // ダブルクリックでファウンデーションに自動移動
  autoMoveToFoundation(fromPile: Pile, cardIndex: number): boolean {
    if (fromPile.cards.length <= cardIndex) return false;
    
    const card = fromPile.cards[cardIndex];
    if (!card.faceUp) return false;
    
    // 適切なファウンデーションを見つける
    for (const foundation of this.foundation) {
      if (this.isValidFoundationMove(card, foundation)) {
        return this.moveCard(fromPile, foundation, cardIndex, 1);
      }
    }
    
    return false;
  }

  // ダブルタップで最適な場所に自動移動
  autoMoveCard(fromPile: Pile, cardIndex: number): boolean {
    if (fromPile.cards.length <= cardIndex) return false;
    
    const card = fromPile.cards[cardIndex];
    if (!card.faceUp) return false;
    
    // 1. まずファウンデーションへの移動を試行
    for (const foundation of this.foundation) {
      if (this.isValidFoundationMove(card, foundation)) {
        return this.moveCard(fromPile, foundation, cardIndex, 1);
      }
    }
    
    // 2. 次にタブローへの移動を試行（単一カードの場合のみ）
    if (cardIndex === fromPile.cards.length - 1) {
      for (const tableau of this.tableau) {
        if (tableau !== fromPile && this.isValidTableauMove(card, tableau)) {
          return this.moveCard(fromPile, tableau, cardIndex, 1);
        }
      }
    }
    
    return false;
  }

  // 全ての裏向きカードが表になっているかチェック
  areAllCardsFaceUp(): boolean {
    return this.tableau.every(pile => 
      pile.cards.every(card => card.faceUp)
    );
  }

  // 自動上がり機能：可能なカードを全てファウンデーションに移動
  performAutoComplete(): boolean {
    let moved = false;
    let continueMoving = true;
    
    while (continueMoving) {
      continueMoving = false;
      
      // ウェイストからファウンデーションへの移動
      if (this.waste.cards.length > 0) {
        const topCard = this.waste.cards[this.waste.cards.length - 1];
        for (const foundation of this.foundation) {
          if (this.isValidFoundationMove(topCard, foundation)) {
            this.moveCard(this.waste, foundation, this.waste.cards.length - 1, 1);
            moved = true;
            continueMoving = true;
            break;
          }
        }
      }
      
      // タブローからファウンデーションへの移動
      if (!continueMoving) {
        for (const tableau of this.tableau) {
          if (tableau.cards.length > 0) {
            const topCard = tableau.cards[tableau.cards.length - 1];
            if (topCard.faceUp) {
              for (const foundation of this.foundation) {
                if (this.isValidFoundationMove(topCard, foundation)) {
                  this.moveCard(tableau, foundation, tableau.cards.length - 1, 1);
                  moved = true;
                  continueMoving = true;
                  break;
                }
              }
            }
          }
          if (continueMoving) break;
        }
      }
    }
    
    return moved;
  }

  // ゲームが完了しているかチェック
  isGameComplete(): boolean {
    return this.foundation.every(pile => pile.cards.length === 13);
  }

  // ゲームが行き詰まっているかチェック（簡易版）
  isGameStuck(): boolean {
    // 実装を簡略化：ストックとウェイストが空で、有効な移動がない場合
    if (this.stock.cards.length > 0 || this.waste.cards.length > 0) {
      return false;
    }
    
    // より詳細な行き詰まり判定は複雑なので、ここでは基本的なチェックのみ
    return false;
  }

  // 自動上がりが可能かチェック
  canAutoComplete(): boolean {
    // 全ての裏向きカードが表になっている場合のみ自動上がり可能
    return this.areAllCardsFaceUp();
  }

  // ヒント機能：可能な移動を取得
  getHint(): { from: Pile; to: Pile; cardIndex: number } | null {
    // ウェイストからファウンデーションへの移動をチェック
    if (this.waste.cards.length > 0) {
      const topCard = this.waste.cards[this.waste.cards.length - 1];
      for (const foundation of this.foundation) {
        if (this.isValidFoundationMove(topCard, foundation)) {
          return {
            from: this.waste,
            to: foundation,
            cardIndex: this.waste.cards.length - 1
          };
        }
      }
    }
    
    // タブローからファウンデーションへの移動をチェック
    for (const tableau of this.tableau) {
      if (tableau.cards.length > 0) {
        const topCard = tableau.cards[tableau.cards.length - 1];
        if (topCard.faceUp) {
          for (const foundation of this.foundation) {
            if (this.isValidFoundationMove(topCard, foundation)) {
              return {
                from: tableau,
                to: foundation,
                cardIndex: tableau.cards.length - 1
              };
            }
          }
        }
      }
    }
    
    // その他の移動は省略（実装が複雑になるため）
    return null;
  }

  // 新しいゲームを開始
  newGame(): void {
    this.moves = 0;
    this.score = 0;
    this.startTime = Date.now();
    this.initializeGame();
  }

  // 最終スコアを計算
  getFinalScore(): number {
    const timeBonus = Math.max(0, 700000 - (Date.now() - this.startTime));
    return this.score + Math.floor(timeBonus / 1000);
  }
}
