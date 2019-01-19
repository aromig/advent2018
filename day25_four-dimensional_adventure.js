// Advent of Code 2018 - Day 25: Four-Dimensional Adventure
// https://adventofcode.com/2018/day/25

const file = require('./file');
const input = file.read('day25').split(/\n/);

let numPoints = input.length;
let matrix = Array(numPoints).fill().map(() => []);
let points = [];
const regex = /(-?\d+)/g;

input.forEach(line => {
    let point = line.match(regex).map(x => +x);
    points.push(point);
});

for (let i = 0; i < numPoints; i++) {
    for (let j = 0; j < numPoints; j++) {
        matrix[i][j] = manhattanDistance(points[i], points[j]) <= 3; // true / false
    }
}

let constellations = 0;

for (let i = 0; i < numPoints; i++) {
    constellations += findConstellations(matrix, i);
}

console.log(`Solution: ${constellations}`);

function manhattanDistance(p1, p2) {
    let distance = 0;
    for (let i = 0; i < p1.length; i++) {
        distance += Math.abs(p1[i] - p2[i]);
    }
    return distance;
}

function findConstellations(matrix, index) {
    let found = 0;
    
    for (let i = 0; i < numPoints; i++) {
        if (matrix[index][i] === true) {
            matrix[index][i] = false;
            found = 1;
            findConstellations(matrix, i);
        }
    }
    return found;
}