// tests/1_unit-tests.js

const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function () {

    suite('Function convertHandler.getNum(input)', function () {

        test('Whole number input', function (done) {
            const input = '32L';
            assert.equal(convertHandler.getNum(input), 32);
            done();
        });

        test('Decimal Input', function (done) {
            const input = '3.1mi';
            assert.equal(convertHandler.getNum(input), 3.1);
            done();
        });

        test('Fractional Input', function (done) {
            const input = '1/2km';
            assert.equal(convertHandler.getNum(input), 0.5);
            done();
        });

        test('Fractional Input w/ Decimal', function (done) {
            const input = '5.4/3lbs';
            assert.approximately(convertHandler.getNum(input), 1.8, 0.1);
            done();
        });

        test('Invalid Input (double fraction)', function (done) {
            const input = '3/2/3kg';
            assert.equal(convertHandler.getNum(input), 'invalid number');
            done();
        });

        test('No Numerical Input', function (done) {
            const input = 'kg';
            assert.equal(convertHandler.getNum(input), 1);
            done();
        });
    });

    suite('Function convertHandler.getUnit(input)', function () {

        test('For Each Valid Unit', function (done) {
            const input = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
            const expected = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
            input.forEach((ele, index) => {
                assert.equal(convertHandler.getUnit(ele), expected[index]);
            });
            done();
        });

        test('Unknown Unit Input', function (done) {
            assert.equal(convertHandler.getUnit('34kilograms'), 'invalid unit');
            done();
        });
    });

    suite('Function convertHandler.getReturnUnit(initUnit)', function () {

        test('For Each Valid Unit', function (done) {
            const input = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
            const expected = ['L', 'gal', 'km', 'mi', 'kg', 'lbs'];
            input.forEach((ele, index) => {
                assert.equal(convertHandler.getReturnUnit(ele), expected[index]);
            });
            done();
        });
    });

    suite('Function convertHandler.spellOutUnit(unit)', function () {

        test('For Each Valid Unit', function (done) {
            const input = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
            const expected = ['gallons', 'liters', 'miles', 'kilometers', 'pounds', 'kilograms'];
            input.forEach((ele, index) => {
                assert.equal(convertHandler.spellOutUnit(ele), expected[index]);
            });
            done();
        });
    });

    suite('Function convertHandler.convert(num, unit)', function () {

        test('Gal to L', function (done) {
            assert.approximately(
                convertHandler.convert(5, 'gal'),
                18.92705,
                0.1
            );
            done();
        });

        test('L to Gal', function (done) {
            assert.approximately(
                convertHandler.convert(5, 'L'),
                1.32086,
                0.1
            );
            done();
        });

        test('Mi to Km', function (done) {
            assert.approximately(
                convertHandler.convert(5, 'mi'),
                8.0467,
                0.1
            );
            done();
        });

        test('Km to Mi', function (done) {
            assert.approximately(
                convertHandler.convert(5, 'km'),
                3.10686,
                0.1
            );
            done();
        });

        test('Lbs to Kg', function (done) {
            assert.approximately(
                convertHandler.convert(5, 'lbs'),
                2.26796,
                0.1
            );
            done();
        });

        test('Kg to Lbs', function (done) {
            assert.approximately(
                convertHandler.convert(5, 'kg'),
                11.02312,
                0.1
            );
            done();
        });
    });
});