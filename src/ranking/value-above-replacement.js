const _ = require('privatize')();
const categories = require('../scoring/categories.js');

class ValueAboveReplacement {
  constructor(batterCount, pitcherCount, teamCount) {
    _(this).batterCount = batterCount;
    _(this).pitcherCount = pitcherCount;
    _(this).teamCount = teamCount;
  }

  applyTo(playerStats) {
    categories.all().forEach((cat) => {
      const higherIsBetter = categories.detailsFor(cat).higherIsBetter;

      playerStats.sort((a, b) => {
        const aVal = a[cat];
        const bVal = b[cat];

        
        if(aVal !== undefined && bVal !== undefined) {
          return higherIsBetter? bVal - aVal : aVal - bVal;
        }
        else if(aVal === undefined && bVal == undefined) return 0;
        else if(aVal === undefined) return -1;
        
        return 1;
      });

      console.log(cat);
      console.log(playerStats[0]);
      console.log(playerStats[1]);
      console.log(playerStats[2]);
      console.log();
    });
  }
}

module.exports = ValueAboveReplacement;
