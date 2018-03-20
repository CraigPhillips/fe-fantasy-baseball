const fs = require('fs');

const missing = [
  'shohei ohtani',
];

const rankedFile = fs.readFileSync('filtered-ranks.txt').toString().trim();
const projectionsFile = fs.readFileSync('steamer-ranks.txt').toString().trim();

const rankedPlayers =
  rankedFile.split('\n').map(
    p => p
      .match(/(?<=\. ).*/)[0]
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ""));
const projectedPlayers =
  projectionsFile.split('\n').map(
    p => p.match(/(?<=\) ).*(?=\:)/)[0].toLowerCase());
const diffs = [];

// to do: clean up each list for comparison purposes
for(let i of projectedPlayers.keys()) {
  const player = projectedPlayers[i];
  let compareToI = rankedPlayers.indexOf(player);

  if (compareToI < 0 && missing.indexOf(player) === -1) {
    compareToI = rankedPlayers.length + 1;
  }

  if (compareToI > i && i <= 150) {
    diffs.push({
      player,
      projected: i,
      rank: compareToI,
      value: compareToI - i
    });
  }
}

diffs.sort((a, b) => b.value - a.value);
for(let i of diffs.keys()) {
  const diff = diffs[i];
  console.log(
    `${(i + 1).toString().padStart(3)}. ${diff.player} ` +
    `${diff.projected + 1} -> ${diff.rank + 1} (${diff.value})`
  );
}
