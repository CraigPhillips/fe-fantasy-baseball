const argv = require('yargs').argv;

const SteamerProjections = require('../projections/steamer-projections');
const ValueAboveAverage = require('./value-above-replacement');

const steamerProjections = new SteamerProjections('projection-data/2018/03-19');
const valueAboveAverage = new ValueAboveAverage(11, 8, 10);

const combinedRanks = valueAboveAverage.applyTo(
  steamerProjections.getBatters().concat(steamerProjections.getPitchers()));

let i = 0;
combinedRanks.forEach((player) => {
  let printable = argv.query?
    player.name.toLowerCase().indexOf(argv.query.toLowerCase()) > -1 :
    player.var >= 0;

  if (printable) {
    let rank = (i + 1).toString();
    if (rank.length == 1) rank = ` ${rank}`;

    console.log(`${rank}) ${player.name}: ${player.var}`);
  }

  i++;
});
