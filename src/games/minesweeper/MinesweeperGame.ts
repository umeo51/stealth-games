// マインスイーパゲームのロジック

export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  row: number;
  col: number;
}

export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export class MinesweeperGame {
  private grid: Cell[][];
  private config: GameConfig;
  private gameState: 'playing' | 'won' | 'lost';
  private startTime: number | null;
  private endTime: number | null;
  private firstClick: boolean;
  private revealedCount: number;
  private flaggedCount: number;
  private lives: number;
  private maxLives: number;
  private revealedMines: {row: number, col: number}[];

  constructor(difficulty: Difficulty = 'beginner') {
    this.config = this.getDifficultyConfig(difficulty);
    this.grid = [];
    this.gameState = 'playing';
    this.startTime = null;
    this.endTime = null;
    this.firstClick = true;
    this.revealedCount = 0;
    this.flaggedCount = 0;
    this.maxLives = 3;
    this.lives = this.maxLives;
    this.revealedMines = [];
    this.initializeGrid();
  }

  // 難易度設定を取得
  private getDifficultyConfig(difficulty: Difficulty): GameConfig {
    switch (difficulty) {
      case 'beginner':
        return { rows: 9, cols: 9, mines: 10 };
      case 'intermediate':
        return { rows: 16, cols: 16, mines: 40 };
      case 'expert':
        return { rows: 16, cols: 30, mines: 99 };
      default:
        return { rows: 9, cols: 9, mines: 10 };
    }
  }

  // グリッドを初期化
  private initializeGrid(): void {
    this.grid = [];
    for (let row = 0; row < this.config.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.config.cols; col++) {
        this.grid[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
          row,
          col
        };
      }
    }
  }

  // 地雷を配置
  private placeMines(excludeRow: number, excludeCol: number): void {
    let minesPlaced = 0;
    const totalCells = this.config.rows * this.config.cols;
    
    while (minesPlaced < this.config.mines) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      const row = Math.floor(randomIndex / this.config.cols);
      const col = randomIndex % this.config.cols;
      
      // 最初にクリックしたセルとその周辺には地雷を置かない
      if (
        !this.grid[row][col].isMine &&
        !(Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1)
      ) {
        this.grid[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    this.calculateNeighborMines();
  }

  // 各セルの周辺地雷数を計算
  private calculateNeighborMines(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        if (!this.grid[row][col].isMine) {
          this.grid[row][col].neighborMines = this.countNeighborMines(row, col);
        }
      }
    }
  }

  // 指定セルの周辺地雷数をカウント
  private countNeighborMines(row: number, col: number): number {
    let count = 0;
    
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (
          newRow >= 0 && newRow < this.config.rows &&
          newCol >= 0 && newCol < this.config.cols &&
          this.grid[newRow][newCol].isMine
        ) {
          count++;
        }
      }
    }
    
    return count;
  }

  // セルを開く（再帰的に空のセルを開く）
  private revealCell(row: number, col: number): void {
    if (
      row < 0 || row >= this.config.rows ||
      col < 0 || col >= this.config.cols ||
      this.grid[row][col].isRevealed ||
      this.grid[row][col].isFlagged
    ) {
      return;
    }
    
    this.grid[row][col].isRevealed = true;
    this.revealedCount++;
    
    // 周辺に地雷がない場合、周辺のセルも自動的に開く
    if (this.grid[row][col].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          this.revealCell(row + dr, col + dc);
        }
      }
    }
  }

  // 全ての地雷を表示（ゲーム終了時）
  private revealAllMines(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        if (this.grid[row][col].isMine) {
          this.grid[row][col].isRevealed = true;
        }
      }
    }
  }

  // ゲーム勝利判定
  private checkWinCondition(): boolean {
    const totalCells = this.config.rows * this.config.cols;
    const safeCells = totalCells - this.config.mines;
    return this.revealedCount === safeCells;
  }

  // 公開メソッド

  // セルをクリック
  clickCell(row: number, col: number): boolean {
    if (
      this.gameState !== 'playing' ||
      row < 0 || row >= this.config.rows ||
      col < 0 || col >= this.config.cols
    ) {
      return false;
    }
    
    // どのセルをクリックしても踏んだ地雷を非表示にする
    if (this.revealedMines.length > 0) {
      this.hideRevealedMines();
      return true; // 地雷リセットのみ実行して終了
    }
    
    // 既に開いているセルやフラグ付きセルの場合は何もしない
    if (this.grid[row][col].isRevealed || this.grid[row][col].isFlagged) {
      return false;
    }
    
    // 最初のクリック時に地雷を配置
    if (this.firstClick) {
      this.placeMines(row, col);
      this.startTime = Date.now();
      this.firstClick = false;
    }
    
    const cell = this.grid[row][col];
    
    if (cell.isMine) {
      // 地雷を踏んだ場合 - ライフを減らす
      this.lives--;
      cell.isRevealed = true; // 踏んだ地雷を一時的に表示
      this.revealedMines.push({row, col}); // 踏んだ地雷を記録
      
      if (this.lives <= 0) {
        // ライフが0になったらゲームオーバー
        this.gameState = 'lost';
        this.endTime = Date.now();
        this.revealAllMines();
      }
      
      return false;
    } else {
      // 安全なセルの場合
      this.revealCell(row, col);
      
      if (this.checkWinCondition()) {
        this.gameState = 'won';
        this.endTime = Date.now();
      }
      
      return true;
    }
  }

  // セルに旗を立てる/外す
  toggleFlag(row: number, col: number): boolean {
    if (
      this.gameState !== 'playing' ||
      row < 0 || row >= this.config.rows ||
      col < 0 || col >= this.config.cols ||
      this.grid[row][col].isRevealed
    ) {
      return false;
    }
    
    // 旗を立てる際にも踏んだ地雷を非表示にする
    this.hideRevealedMines();
    
    const cell = this.grid[row][col];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      this.flaggedCount--;
    } else {
      cell.isFlagged = true;
      this.flaggedCount++;
    }
    
    return true;
  }

  // コードクリック（旗の数が正しい場合、周辺を一括開示）
  chordClick(row: number, col: number): boolean {
    if (
      this.gameState !== 'playing' ||
      row < 0 || row >= this.config.rows ||
      col < 0 || col >= this.config.cols ||
      !this.grid[row][col].isRevealed ||
      this.grid[row][col].neighborMines === 0
    ) {
      return false;
    }
    
    const cell = this.grid[row][col];
    let flaggedNeighbors = 0;
    
    // 周辺の旗の数をカウント
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (
          newRow >= 0 && newRow < this.config.rows &&
          newCol >= 0 && newCol < this.config.cols &&
          this.grid[newRow][newCol].isFlagged
        ) {
          flaggedNeighbors++;
        }
      }
    }
    
    // 旗の数が地雷数と一致する場合、周辺の未開示セルを開く
    if (flaggedNeighbors === cell.neighborMines) {
      let hitMine = false;
      
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (
            newRow >= 0 && newRow < this.config.rows &&
            newCol >= 0 && newCol < this.config.cols &&
            !this.grid[newRow][newCol].isRevealed &&
            !this.grid[newRow][newCol].isFlagged
          ) {
            if (this.grid[newRow][newCol].isMine) {
              hitMine = true;
            } else {
              this.revealCell(newRow, newCol);
            }
          }
        }
      }
      
      if (hitMine) {
        this.gameState = 'lost';
        this.endTime = Date.now();
        this.revealAllMines();
        return false;
      }
      
      if (this.checkWinCondition()) {
        this.gameState = 'won';
        this.endTime = Date.now();
      }
      
      return true;
    }
    
    return false;
  }

  // ゲーム状態を取得
  getGameState() {
    return {
      grid: this.grid,
      gameState: this.gameState,
      config: this.config,
      remainingMines: this.config.mines - this.flaggedCount,
      timeElapsed: this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0,
      revealedCount: this.revealedCount,
      flaggedCount: this.flaggedCount,
      lives: this.lives,
      maxLives: this.maxLives
    };
  }

  // 踏んだ地雷を非表示にする
  private hideRevealedMines(): void {
    for (const minePos of this.revealedMines) {
      const cell = this.grid[minePos.row][minePos.col];
      if (cell.isMine && cell.isRevealed) {
        cell.isRevealed = false;
      }
    }
    this.revealedMines = [];
  }

  // 新しいゲームを開始
  newGame(difficulty?: Difficulty): void {
    if (difficulty) {
      this.config = this.getDifficultyConfig(difficulty);
    }
    
    this.gameState = 'playing';
    this.startTime = null;
    this.endTime = null;
    this.firstClick = true;
    this.revealedCount = 0;
    this.flaggedCount = 0;
    this.lives = this.maxLives;
    this.revealedMines = [];
    this.initializeGrid();
  }

  // ゲーム時間を取得
  getGameTime(): number {
    if (!this.startTime) return 0;
    const endTime = this.endTime || Date.now();
    return Math.floor((endTime - this.startTime) / 1000);
  }

  // 勝利判定
  isWon(): boolean {
    return this.gameState === 'won';
  }

  // 敗北判定
  isLost(): boolean {
    return this.gameState === 'lost';
  }

  // ゲーム進行中判定
  isPlaying(): boolean {
    return this.gameState === 'playing';
  }
}
