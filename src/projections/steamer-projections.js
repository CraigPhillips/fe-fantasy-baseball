const _ = require('privatize')();

const SteamerProjections = class SteamerProjections {
  constructor(year) { _(this).year = year; }

  print() { console.log(_(this).year); }
};

module.exports = SteamerProjections;
