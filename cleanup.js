const fs = require('fs');

const rankedFile = fs.readFileSync('default-ranks.txt').toString().trim();
const rankedPlayers = rankedFile.split('\n');
const ignoreFile = fs.readFileSync('exclusions/drafted.txt').toString().trim();
const ignorePlayers = ignoreFile.split('\n');

let rank = 0;
let ignoreCount = 0;
for (let i of rankedPlayers.keys()) {
  let player = rankedPlayers[i].match(/(?<=\. )(.)*(?= [\D]{2,3} \-)/)[0];

  if (ignorePlayers.indexOf(player.toLowerCase()) > -1) {
    ignoreCount++;
  } else {
    rank++;
    console.log(`${rank}. ${player}`);
  }
}
