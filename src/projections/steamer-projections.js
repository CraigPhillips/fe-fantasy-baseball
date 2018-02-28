const _ = require('privatize')();
const fs = require('fs');

const SteamerProjections = class SteamerProjections {
  constructor(projectionFilePrefix) {
    const batters = `${projectionFilePrefix}-steamer-batters.csv`;

    const batterFileContents = fs.readFileSync(batters).toString().split('\n');
    const meta = batterFileContents[0].split(',');

    console.log(`player count: ${batterFileContents.length - 1}`);
  }

  print() { console.log(_(this).year); }
};

module.exports = SteamerProjections;
