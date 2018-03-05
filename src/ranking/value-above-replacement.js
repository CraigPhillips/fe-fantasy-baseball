const _ = require('privatize')();
const categories = require('../scoring/categories.js');

const categoryMods = {
  sb: .25,
  sv: .04,
};

class ValueAboveReplacement {
  constructor(batterCount, pitcherCount, teamCount) {
    _(this).batterCount = batterCount;
    _(this).pitcherCount = pitcherCount;2591848396
    _(this).teamCount = teamCount;
  }

  applyTo(playerStats) {
    const teamCount = _(this).teamCount;
    const replacementLevelBatterIndex = _(this).batterCount * teamCount;
    const replacementLevelPitcherIndex = _(this).pitcherCount * teamCount

    playerStats.forEach((player) => { player.valuesAboveReplacement = {}; });

    categories.all().forEach((cat) => {
      const biggerIsBetter = categories.detailsFor(cat).biggerIsBetter;
      const catMod = categoryMods[cat] ? categoryMods[cat] : 1;
      const replacementLevelIndex =
        categories.detailsFor(cat).type == categories.types.batting ?
          replacementLevelBatterIndex : replacementLevelPitcherIndex;

      if (playerStats.length <= replacementLevelIndex) {
        throw new Error(`player count too low (${playerStats.length})`);
      }

      playerStats.sort((a, b) => {
        const aVal = a[cat];
        const bVal = b[cat];


        if(aVal !== undefined && bVal !== undefined) {
          return biggerIsBetter? bVal - aVal : aVal - bVal;
        }
        else if(aVal === undefined && bVal == undefined) return 0;
        else if(aVal === undefined) return 1;

        return -1;
      });

      const replacementLevel = playerStats[replacementLevelIndex][cat];
      if (replacementLevel === 0) throw new Error(`${cat} has a 0 repl. level`);

      playerStats.forEach((player) => {
        const valueAboveReplacement =
          (catMod * (player[cat] - replacementLevel)) / replacementLevel;

        player.valuesAboveReplacement[cat] = valueAboveReplacement;
      });

      if (!biggerIsBetter) {
        playerStats.forEach((player) => {
          player.valuesAboveReplacement[cat] =
            player.valuesAboveReplacement[cat] * -1;
        });
      }
    });

    playerStats.forEach((player) => {
      let overall = 0;

      categories.all().forEach((cat) => {
        const catScore = player.valuesAboveReplacement[cat];
        if (catScore) overall += catScore;
      });

      player.var = overall;
    });

    playerStats.sort((a, b) => b.var - a.var);

    return playerStats;
  }
}

module.exports = ValueAboveReplacement;
