export interface SudokuCell {
  value: number;
  isFixed: boolean;
  isValid: boolean;
  notes: number[];
}

export type SudokuGrid = SudokuCell[][];

export class SudokuGame {
  private grid: SudokuGrid;
  private solution: number[][];
  private difficulty: 'easy' | 'medium' | 'hard';
  private startTime: number;

  constructor(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.difficulty = difficulty;
    this.startTime = Date.now();
    this.grid = this.createEmptyGrid();
    this.solution = this.generateSolution();
    this.createPuzzle();
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

  // 完全な解を生成
  private generateSolution(): number[][] {
    const solution = Array(9).fill(null).map(() => Array(9).fill(0));
    this.solveSudoku(solution);
    return solution;
  }

  // バックトラッキングでパズルを解く
  private solveSudoku(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (this.isValidMove(grid, row, col, num)) {
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

  // 配列をシャッフル
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // 有効な手かチェック
  private isValidMove(grid: number[][], row: number, col: number, num: number): boolean {
    // 行チェック
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // 列チェック
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // 3x3ボックスチェック
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  // パズルを作成（セルを削除）
  private createPuzzle(): void {
    // 解をグリッドにコピー
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        this.grid[row][col].value = this.solution[row][col];
        this.grid[row][col].isFixed = true;
      }
    }

    // 難易度に応じてセルを削除
    const cellsToRemove = this.getCellsToRemove();
    const positions = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push({ row, col });
      }
    }

    const shuffledPositions = this.shuffleArray(positions);
    for (let i = 0; i < cellsToRemove && i < shuffledPositions.length; i++) {
      const { row, col } = shuffledPositions[i];
      this.grid[row][col].value = 0;
      this.grid[row][col].isFixed = false;
    }

    this.validateGrid();
  }

  // 難易度に応じて削除するセル数を決定
  private getCellsToRemove(): number {
    switch (this.difficulty) {
      case 'easy': return 40;
      case 'medium': return 50;
      case 'hard': return 60;
      default: return 50;
    }
  }

  // グリッド全体の妥当性をチェック
  private validateGrid(): void {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = this.grid[row][col];
        if (cell.value !== 0) {
          cell.isValid = this.isValidPlacement(row, col, cell.value);
        } else {
          cell.isValid = true;
        }
      }
    }
  }

  // 特定の位置への配置が有効かチェック
  private isValidPlacement(row: number, col: number, num: number): boolean {
    // 一時的に値をクリアしてチェック
    const originalValue = this.grid[row][col].value;
    this.grid[row][col].value = 0;
    
    const isValid = this.isValidMove(
      this.grid.map(row => row.map(cell => cell.value)),
      row,
      col,
      num
    );
    
    this.grid[row][col].value = originalValue;
    return isValid;
  }

  // 公開メソッド
  getGrid(): SudokuGrid {
    return this.grid.map(row => row.map(cell => ({ ...cell })));
  }

  getDifficulty(): string {
    return this.difficulty;
  }

  getStartTime(): number {
    return this.startTime;
  }

  // セルに値を設定
  setCellValue(row: number, col: number, value: number): boolean {
    if (this.grid[row][col].isFixed) return false;
    
    this.grid[row][col].value = value;
    this.validateGrid();
    return true;
  }

  // セルのメモを取得
  getCellNotes(row: number, col: number): number[] {
    return [...this.grid[row][col].notes];
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

  // 初期セルかどうかチェック
  isInitialCell(row: number, col: number): boolean {
    return this.grid[row][col].isFixed;
  }
}
