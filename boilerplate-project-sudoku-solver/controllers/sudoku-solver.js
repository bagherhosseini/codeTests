class SudokuSolver {
  validate(puzzleString) {
    // Check if string exists
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }

    // Check length
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    // Check for valid characters
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
    const rowIndex = row.charCodeAt(0) - 65; // Convert A-I to 0-8
    value = parseInt(value);
    
    // Check if value already exists in row
    for (let i = 0; i < 9; i++) {
      if (grid[rowIndex][i] === value) {
        // Skip the current position we're checking
        if (i === column - 1) continue;
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
    const rowIndex = row.charCodeAt(0) - 65;
    const colIndex = column - 1;
    value = parseInt(value);
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (grid[i][colIndex] === value) {
        // Skip the current position we're checking
        if (i === rowIndex) continue;
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.transformToGrid(puzzleString);
    const rowIndex = row.charCodeAt(0) - 65;
    const colIndex = column - 1;
    value = parseInt(value);
    
    // Get region start indices
    const regionRow = Math.floor(rowIndex / 3) * 3;
    const regionCol = Math.floor(colIndex / 3) * 3;
    
    // Check 3x3 region
    for (let i = regionRow; i < regionRow + 3; i++) {
      for (let j = regionCol; j < regionCol + 3; j++) {
        if (grid[i][j] === value) {
          // Skip the current position we're checking
          if (i === rowIndex && j === colIndex) continue;
          return false;
        }
      }
    }
    return true;
  }

  transformToGrid(puzzleString) {
    const grid = [];
    let pos = 0;
    
    for (let i = 0; i < 9; i++) {
      const row = [];
      for (let j = 0; j < 9; j++) {
        row.push(puzzleString[pos] === '.' ? 0 : parseInt(puzzleString[pos]));
        pos++;
      }
      grid.push(row);
    }
    return grid;
  }

  solve(puzzleString) {
    // Validate puzzle first
    const isValid = this.validate(puzzleString);
    if (isValid !== true) return isValid;

    const grid = this.transformToGrid(puzzleString);
    
    if (this.solveSudoku(grid)) {
      return { solution: this.gridToString(grid) };
    }
    return { error: 'Puzzle cannot be solved' };
  }

  solveSudoku(grid) {
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) return true;
    
    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;
        
        if (this.solveSudoku(grid)) return true;
        
        grid[row][col] = 0;
      }
    }
    return false;
  }

  findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) return [row, col];
      }
    }
    return null;
  }

  isSafe(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }
    
    return true;
  }

  gridToString(grid) {
    return grid.flat().join('');
  }
}

module.exports = SudokuSolver;

