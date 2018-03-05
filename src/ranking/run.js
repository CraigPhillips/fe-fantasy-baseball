const SteamerProjections = require('../projections/steamer-projections');
const ValueAboveAverage = require('./value-above-replacement');

const steamerProjections = new SteamerProjections('projection-data/2018/02-25');
const valueAboveAverage = new ValueAboveAverage(11, 8, 10);


const combinedRanks = valueAboveAverage.applyTo(
  steamerProjections.getBatters().concat(steamerProjections.getPitchers()));

let i = 0;
while(combinedRanks[i].var > 0) {
  const player = combinedRanks[i];
  let rank = (i + 1).toString();
  if (rank.length == 1) rank = ` ${rank}`;

  console.log(`${rank}) ${player.name}: ${player.var}`);

  i++;
}
