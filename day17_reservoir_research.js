// Advent of Code 2018 - Day 17: Reservoir Research
// https://adventofcode.com/2018/day/17

const file = require('./file');
// const input = file.read('day17').split(/\n/);

const input = `x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`.split(/\n/);

const CLAY = '#';
const WATER = '~';
const WATER_FLOWING = '|';
const POCKETS = []; // Clay & Water

const re