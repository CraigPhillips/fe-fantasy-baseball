const SteamerProjections = require('./projections/steamer-projections');
const ValueAboveAverage = require('./ranking/value-above-replacement');

const steamerProjections = new SteamerProjections('projection-data/2018/02-25');
const valueAboveAverage = new ValueAboveAverage(11, 8, 10); 
const projections = {
  batters: valueAboveAverage.applyTo(steamerProjections.getBatters()),
  pitchers: valueAboveAverage.applyTo(steamerProjections.getPitchers()),
};
