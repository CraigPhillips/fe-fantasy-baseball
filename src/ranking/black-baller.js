const _ = require('privatize')();
const fs = require('fs');

const BlackBaller = class BlackBaller {
  constructor(exclusionFile) {
    const exclusionContents = fs.readFileSync(exclusionFile).toString().trim();
    const exclusionEntries = exclusionContents.split('\n');
    _(this).playersToExclude = [];
    exclusionEntries.forEach(n => _(this).playersToExclude.push(n.trim()));

    if (_(this).playersToExclude.length == 1 && !_(this).playersToExclude[0]) {
      _(this).playersToExclude = [];
    }
  }

  trimExcludedFromProjections(projections) {
    const remainingBatters = [];
    const remainingPitchers = [];
    const trimmedBatters = [];
    const trimmedPitchers = [];
    const trimmedCount = 0;

    projections.getBatters().forEach((batter) => {
      const name = batter.name.toLowerCase().trim();
      if (_(this).playersToExclude.indexOf(name) > -1) {
        if (trimmedBatters.indexOf(name) > -1) {
          throw new Error(`${name} appears more than once in batter list`);
        }
        trimmedBatters.push(name);
      } else { remainingBatters.push(batter); }
    });

    projections.getPitchers().forEach((pitcher) => {
      const name = pitcher.name.toLowerCase().trim();
      if (_(this).playersToExclude.indexOf(name) > -1) {
        if (trimmedPitchers.indexOf(name) > -1) {
          throw new Error(`${name} appears more than once in pitcher list`);
        }
        trimmedPitchers.push(name);
      } else { remainingPitchers.push(pitcher); }
    });

    _(this).playersToExclude.forEach((name) => {
      if (trimmedBatters.indexOf(name) + trimmedPitchers.indexOf(name) === -2) {
        throw new Error(`could not locate player to exclude: ${name}`);
      }
    });

    return {
      getBatters: () => remainingBatters,
      getPitchers: () => remainingPitchers,
    };
  }
};

module.exports = BlackBaller;
