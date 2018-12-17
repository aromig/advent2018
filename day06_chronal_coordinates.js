// Advent of Code 2018 - Day 6: Chronal Coordinates
// https://adventofcode.com/2018/day/6

const { range, maxBy, max, min, sum } = require('lodash');
const file = require('./file');
const input = file.read('day6').split(/\n/g);

function distance([x1, y1], [x2, y2]) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

const points = input.map(x => x.split(', ').map(x => +x));
const upper = max(maxBy(points, pair => max(pair))) + 1;
const closest = Array(upper).fill().map((x, i) => Array(upper));
let regionSize = 0;

range(0, upper).forEach(x => {
    range(0, upper).forEach(y => {
        const distances = points.map(pair => distance(pair, [x,y]));
        const shortest = min(distances);

        if (distances.filter(d => d === shortest).length === 1)
            closest[x][y] = distances.indexOf(shortest);

        if (sum(distances) < 10000)
            regionSize++;
    });
});

const ignore = new Set();

range(0, upper).forEach(n => {
    ignore.add(closest[0][n]);
    ignore.add(closest[n][0]);
    ignore.add(closest[closest.length - 1][n]);
    ignore.add(closest[n][closest.length - 1]);
});

const regionSizes = Array(points.length).fill(0);
range(0, upper).forEach(x => {
    range(0, upper).forEach(y => {
        const point = closest[x][y];
        if (!ignore.has(point))
            regionSizes[point]++;
    });
});

const largestRegionSize = max(regionSizes);

console.log(`Part 1: ${largestRegionSize}`);
console.log(`Part 2: ${regionSize}`);