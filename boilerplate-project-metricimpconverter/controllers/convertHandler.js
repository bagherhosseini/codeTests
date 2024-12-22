// controllers/convertHandler.js

function ConvertHandler() {

  this.getNum = function (input) {
    if (!input) return 1;

    // Find where the number ends and unit begins
    const numRegex = /[a-zA-Z]/;
    const unitIndex = input.match(numRegex)?.index || 0;
    const numberStr = unitIndex === 0 ? "1" : input.slice(0, unitIndex);

    // Check for double fraction
    if ((numberStr.match(/\//g) || []).length > 1) {
      return "invalid number";
    }

    try {
      // Handle fractions
      if (numberStr.includes('/')) {
        const [numerator, denominator] = numberStr.split('/');
        return parseFloat(numerator) / parseFloat(denominator);
      }
      // Handle decimals and whole numbers
      return numberStr === "" ? 1 : parseFloat(numberStr);
    } catch (e) {
      return "invalid number";
    }
  };

  this.getUnit = function (input) {
    if (!input) return "invalid unit";

    // Extract unit part
    const numRegex = /[a-zA-Z]/;
    const unitIndex = input.match(numRegex)?.index || 0;
    const unit = input.slice(unitIndex);

    // Valid units
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    const normalizedUnit = unit.toLowerCase();

    if (!validUnits.includes(normalizedUnit)) {
      return "invalid unit";
    }

    // Return 'L' for liters, lowercase for others
    return normalizedUnit === 'l' ? 'L' : normalizedUnit;
  };

  this.getReturnUnit = function (initUnit) {
    const unitMappings = {
      'gal': 'L',
      'L': 'gal',
      'mi': 'km',
      'km': 'mi',
      'lbs': 'kg',
      'kg': 'lbs'
    };

    return unitMappings[initUnit] || "invalid unit";
  };

  this.spellOutUnit = function (unit) {
    const spellings = {
      'gal': 'gallons',
      'L': 'liters',
      'mi': 'miles',
      'km': 'kilometers',
      'lbs': 'pounds',
      'kg': 'kilograms'
    };

    return spellings[unit] || "invalid unit";
  };

  this.convert = function (initNum, initUnit) {
    const conversions = {
      'gal': { to: 'L', factor: 3.78541 },
      'L': { to: 'gal', factor: 1 / 3.78541 },
      'mi': { to: 'km', factor: 1.60934 },
      'km': { to: 'mi', factor: 1 / 1.60934 },
      'lbs': { to: 'kg', factor: 0.453592 },
      'kg': { to: 'lbs', factor: 1 / 0.453592 }
    };

    if (initNum === "invalid number") return "invalid number";
    if (!conversions[initUnit]) return "invalid unit";

    const result = initNum * conversions[initUnit].factor;
    return parseFloat(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    if (initNum === "invalid number" && initUnit === "invalid unit") {
      return "invalid number and unit";
    }
    if (initNum === "invalid number") return "invalid number";
    if (initUnit === "invalid unit") return "invalid unit";

    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;