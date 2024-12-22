'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.post('/api/solve', (req, res) => {
    const { puzzle } = req.body;
    const result = solver.solve(puzzle);
    res.json(result);
  });

  app.post('/api/check', (req, res) => {
    const { puzzle, coordinate, value } = req.body;
    
    // Check if all fields exist
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    // Validate puzzle
    const puzzleValidation = solver.validate(puzzle);
    if (puzzleValidation !== true) {
      return res.json(puzzleValidation);
    }

    // Validate coordinate format
    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // Validate value
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const row = coordinate[0];
    const column = parseInt(coordinate[1]);
    const valueNum = parseInt(value);

    // Check if value already exists at coordinate
    const grid = solver.transformToGrid(puzzle);
    const rowIndex = row.charCodeAt(0) - 65;
    if (grid[rowIndex][column - 1] === valueNum) {
      return res.json({ valid: true });
    }

    // Check placement validity
    const rowValid = solver.checkRowPlacement(puzzle, row, column, valueNum);
    const colValid = solver.checkColPlacement(puzzle, row, column, valueNum);
    const regionValid = solver.checkRegionPlacement(puzzle, row, column, valueNum);

    const conflicts = [];
    if (!rowValid) conflicts.push('row');
    if (!colValid) conflicts.push('column');
    if (!regionValid) conflicts.push('region');

    res.json({
      valid: conflicts.length === 0,
      conflict: conflicts.length > 0 ? conflicts : undefined
    });
  });
};
