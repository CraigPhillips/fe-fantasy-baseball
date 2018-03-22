const fs = require('fs');

const ignoreFile = fs
  .readFileSync('exclusions/drafted.txt')
  .toString()
  .trim()
  .split('\n');
const ignores = [];
for (let player of ignoreFile) {
  ignores.push(player
    .trim()
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ""));
}

const keeperFile = fs
  .readFileSync('keeper-ranks.txt')
  .toString()
  .trim()
  .split('\n');
const keeperRanks = [];
const keeperIgnored = [];
for (let i = 1; i < keeperFile.length; i += 3) {
  const player = keeperFile[i]
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "");

  if (ignores.indexOf(player) === -1) keeperRanks.push(player);
  else keeperIgnored.push(player);
}
for (let ignore of ignores) {
  if (keeperRanks.indexOf(ignore) + keeperIgnored.indexOf(ignore) === -2) {
    throw new Error(`${ignore} missing from keeper file`);
  }
}

const rankFile = fs
  .readFileSync('filtered-ranks.txt')
  .toString()
  .trim()
  .split('\n');
const ranks = [];
const ranksIgnored = [];
for (let i of rankFile.keys()) {
  const player = rankFile[i]
    .trim()
    .toLowerCase()
    .match(/(?<=\. ).*/)[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "");

  if (ignores.indexOf(player) === -1) ranks.push(player);
  else ranksIgnored.push(player);
}
for (let ignore of ignores) {
  if (ranks.indexOf(ignore) + keeperIgnored.indexOf(ignore) === -2) {
    throw new Error(`${ignore} missing from ranks file`);
  }
}

const diffs = [];
for (let keeperI of keeperRanks.keys()) {
  const player = keeperRanks[keeperI];
  const rankI = ranks.indexOf(player);
  if (rankI === -1) throw new Error(`${player} missing from ranks file`);

  const diff = rankI - keeperI;
  if (diff > 0) {
    diffs.push({ diff, keeperI, player, rankI });
  }
}

diffs.sort((a, b) => b.diff - a.diff);
for (let i of diffs.keys()) {
  const diff = diffs[i];
  console.log(
    `${(i + 1).toString().padStart(3)}. ${diff.player} - ${diff.diff} ` +
    `(${diff.rankI + 1} -> ${diff.keeperI + 1})`
  );
}
// for (let i of keeperRanks.keys()) {
//   console.log(`${(i + 1).toString().padStart(3)}. ${keeperRanks[i]}`);
// }
