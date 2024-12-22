const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

suite('Unit Tests', () => {
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validate(validPuzzle));
  });

  test('Logic handles a puzzle string with invalid characters', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37x';
    const result = solver.validate(invalidPuzzle);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '1.5..2.84..63.12.7.2';
    const result = solver.validate(shortPuzzle);
    assert.deepEqual(result, { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 'A', 2, '5'));
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(validPuzzle, 'A', 2, '6'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 'A', 2, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 'A', 2, '5'));
  });

  test('Valid puzzle strings pass the solver', () => {
    const result = solver.solve(validPuzzle);
    assert.property(result, 'solution');
    assert.isString(result.solution);
    assert.equal(result.solution.length, 81);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(invalidPuzzle);
    assert.deepEqual(result, { error: 'Puzzle cannot be solved' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    const result = solver.solve(validPuzzle);
    assert.equal(result.solution, solution);
  });
});
