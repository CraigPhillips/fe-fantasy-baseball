const _ = require('privatize')();
const fs = require('fs');
const VError = require('verror');

const categories = require('../scoring/categories');

function noQ(val) { return val ? val.replace(/\"/g, '') : val; }

function parseProjectionFile(fileName, categories, stash) {
  const file = fs.readFileSync(fileName).toString().split('\n');
  const meta = file.splice(0, 1)[0].split(',').map(e => noQ(e.toLowerCase()));
  const columnMap = {};

  categories.forEach((cat) => {
    const index = meta.indexOf(cat);
    if (index === -1) {
      throw new Error(`missing category from projections: ${cat}`);
    }

    columnMap[cat] = index;
  });

  file.forEach((rawData) => {
    const data = rawData.split(',');
    const player = { name: noQ(data[0]) };

    if (player.name) {
      categories.forEach((cat) => {
        player[cat] = parseFloat(noQ(data[columnMap[cat]]));
      });

      stash.push(player);
    }
  });
}

class SteamerProjections {
  constructor(projectionFilePrefix) {
    try {
      const batters = `${projectionFilePrefix}-steamer-batters.csv`;
      const pitchers = `${projectionFilePrefix}-steamer-pitchers.csv`;

      _(this).batters = [];
      _(this).pitchers = [];

      parseProjectionFile(batters, categories.batting(), _(this).batters);
      parseProjectionFile(pitchers, categories.pitching(), _(this).pitchers);
    } catch(projectionParseError) {
      throw new VError(projectionParseError, 'Steamer projection load failed');
    }
  }

  getBatters() { return JSON.parse(JSON.stringify(_(this).batters)); }
  getPitchers() { return JSON.parse(JSON.stringify(_(this).pitchers)); }
};

module.exports = SteamerProjections;
