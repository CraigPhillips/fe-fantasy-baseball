const fs = require('fs');

const rankedFile = fs.readFileSync('filtered-ranks.txt').toString().trim();
const projectionsFile = fs.readFileSync('steamer-ranks.txt').toString().trim();

const rankedPlayers = rankedFile.split('\n');
const projectedPlayers = projectionsFile.split('\n');
const diffs = [];

// to do: clean up each list for comparison purposes
