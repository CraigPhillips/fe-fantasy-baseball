const fs = require('fs');

const SteamerProjections = require('./src/projections/steamer-projections');
const steamerProjections = new SteamerProjections('projection-data/2018/03-19');
const projections = steamerProjections
  .getBatters()
  .concat(steamerProjections.getPitchers());

const draftedFile = fs
  .readFileSync('drafted.txt')
  .toString()
  .trim()
  .split('\n');

const indexedProjections = {};
for (let projection of projections) {
  const indexName = projection
    .name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "");
  if (!indexedProjections[indexName]) {
    indexedProjections[indexName] = projection;
  }
}

const score = {};
for (let player of draftedFile) {
  const projection = indexedProjections[player];
  if (!projection) throw new Error(`${player} missing from projections`);

  for (let stat of Object.keys(projection)) {
    if (stat !== 'name') {
      if (!score[stat]) score[stat] = [];
      score[stat].push (projection[stat]);
    }
  }
}

const totals = {};
const averagables = ['avg', 'whip', 'era'];
for (let stat of Object.keys(score)) {
  totals[stat] = score[stat].reduce((prev, curr) =>
    averagables.indexOf(stat) >= 0 ?
      prev + Math.round(1000 * curr / score[stat].length) / 1000 :
      prev + curr
  , 0);
}

console.log(totals);
