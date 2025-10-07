// 数独ゲームのロジック

export type SudokuCell = {
  value: number;
  isFixed: boolean;
  isValid: boolean;
  notes: number[];
};

export type SudokuGrid = SudokuCell[][];

export class SudokuGame {
  private grid: SudokuGrid;
  private solution: number[][];
  private difficulty: 'easy' | 'medium' | 'hard';
  private startTime: number;

  constructor(difficulty: 'easy' | 'medium' | 'hard' = 'easy') {
    this.difficulty = difficulty;
    this.grid = this.createEmptyGrid();
    this.solution = [];
    this.startTime = Date.now();
    this.generatePuzzle();
  }

  // 空のグリッドを作成
  private createEmptyGrid(): SudokuGrid {
    return Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value: 0,
        isFixed: false,
        isValid: true,
        notes: []
      }))
    );
  }

  // 数独パズルを生成
  private generatePuzzle(): void {
    // 完全な解答を生成
    this.solution = this.generateCompleteSolution();
    
    // 難易度に応じてセルを削除
    const cellsToRemove = this.getCellsToRemove();
    const cellsToKeep = 81 - cellsToRemove;
    
    // 解答をグリッドにコピー
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        this.grid[row][col].value = this.solution[row][col];
        this.grid[row][col].isFixed = true;
      }
    }

    // ランダムにセルを削除
    const positions = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push([row, col]);
      }
    }
    
    // シャッフル
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // 指定された数のセルを削除
    for (let i = 0; i < cellsToRemove; i++) {
      const [row, col] = positions[i];
      this.grid[row][col].value = 0;
      this.grid[row][col].isFixed = false;
    }

    this.validateGrid();
  }

  // 完全な数独解答を生成
  private generateCompleteSolution(): number[][] {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    this.solveSudoku(grid);
    return grid;
  }

  // バックトラッキングで数独を解く
  private solveSudoku(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          // 数字をシャッフル（ランダムな解答を生成するため）
          for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
          }

          for (const num of numbers) {
            if (this.isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              if (this.solveSudoku(grid)) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // 数字の配置が有効かチェック
  private isValidPlacement(grid: number[][], row: number, col: number, num: number): boolean {
    // 行をチェック
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // 列をチェック
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // 3x3ボックスをチェック
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  // 難易度に応じて削除するセル数を決定
  private getCellsToRemove(): number {
    switch (this.difficulty) {
      case 'easy': return 40;
      case 'medium': return 50;
      case 'hard': return 60;
      default: return 40;
    }
  }

  // グリッド全体の有効性をチェック
  private validateGrid(): void {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = this.grid[row][col];
        if (cell.value !== 0) {
          cell.isValid = this.isValidMove(row, col, cell.value);
        } else {
          cell.isValid = true;
        }
      }
    }
  }

  // 指定された位置への数字の配置が有効かチェック
  private isValidMove(row: number, col: number, num: number): boolean {
    // 一時的に値をクリア
    const originalValue = this.grid[row][col].value;
    this.grid[row][col].value = 0;

    const isValid = this.isValidPlacement(
      this.grid.map(row => row.map(cell => cell.value)),
      row,
      col,
      num
    );

    // 値を復元
    this.grid[row][col].value = originalValue;
    return isValid;
  }

  // 公開メソッド

  // グリッドを取得
  getGrid(): SudokuGrid {
    return this.grid;
  }

  // セルに数字を設定
  setCellValue(row: number, col: number, value: number): boolean {
    if (this.grid[row][col].isFixed) return false;
    
    this.grid[row][col].value = value;
    this.validateGrid();
    return true;
  }

  // セルのメモを設定
  setCellNotes(row: number, col: number, notes: number[]): boolean {
    if (this.grid[row][col].isFixed) return false;
    
    this.grid[row][col].notes = notes;
    return true;
  }

  // ゲームが完了しているかチェック
  isComplete(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = this.grid[row][col];
        if (cell.value === 0 || !cell.isValid) {
          return false;
        }
      }
    }
    return true;
  }

  // ヒントを提供
  getHint(): { row: number; col: number; value: number } | null {
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col].value === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) return null;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return {
      row: randomCell.row,
      col: randomCell.col,
      value: this.solution[randomCell.row][randomCell.col]
    };
  }

  // 新しいゲームを開始
  newGame(difficulty?: 'easy' | 'medium' | 'hard'): void {
    if (difficulty) {
      this.difficulty = difficulty;
    }
    this.grid = this.createEmptyGrid();
    this.generatePuzzle();
  }

  // 難易度を取得
  getDifficulty(): string {
    return this.difficulty;
  }

  // 開始時間を取得
  getStartTime(): number {
    return this.startTime;
  }
}
