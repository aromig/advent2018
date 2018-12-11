// Advent of Code 2018 - Day 3: No Matter How You Slice It
// https://adventofcode.com/2018/day/3

const file = require('./file');
const input = file.read('day3').split(/\n/g);

const regex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
let tiles = {};
let numOverlapTiles = 0;

let claims = input.map(line => {
    const matches = regex.exec(line);
    return { id: +matches[1], x: +matches[2], y: +matches[3], w: +matches[4], l: +matches[5] }
});

claims.forEach(rect => {
    for (let x = rect.x; x < rect.x + rect.w; ++x) {
        for (let y = rect.y; y < rect.y + rect.l; ++y) {
            tiles[`${x},${y}`] = (tiles[`${x},${y}`] || 0) + 1;
            //console.log(`${x},${y}: ${tiles}`);
        }
    }
});

const values = Object.keys(tiles).map(x => tiles[x]);
for (value of values) {
    if (value > 1)
        numOverlapTiles++;
}

// Determines if two tiles overlap each other
function doesOverlap(a, b) {
    return (a.x < b.x + b.w) &&
           (a.y < b.y + b.l) &&
           (b.x < a.x + a.w) &&
           (b.y < a.y + a.l)
}

// Run through each combination and check for an overlap
function findLoneClaim() {
    for (let a = 0; a < claims.length; ++a) {
        let loneClaim = true;
        for (let b = 0; b < claims.length; ++b) {
            if (a === b) continue;
            if (doesOverlap(claims[a], claims[b])) {
                loneClaim = false;
                break;
            }
        }
        if (loneClaim)
            return claims[a].id;
    }
}

console.log(`Part 1: ${numOverlapTiles}`);
console.log(`Part 2: ${findLoneClaim()}`);