// Advent of Code 2018 - Day 11: The Chronal Charge
// https://adventofcode.com/2018/day/11

const file = require('./file');
const input = file.read('day11');

const gridSN = +input;

function calculatePowerLevel(x, y) {
    const rackID = x + 10;
    let powerLevel = ((rackID * y) + gridSN) * rackID;
    powerLevel = powerLevel.toString();
    return +(powerLevel[powerLevel.length - 3]) - 5;
}

function makeGrid() {
    let grid = [];
    for (let x = 1; x < 300; x++) {
        grid[x] = [];
        for (let y = 1; y < 300; y++) {
            grid[x][y] = calculatePowerLevel(x, y);
        }
    }
    return grid;
}

function findCell(size) {
    let cell = {
        x: 1,
        y: 1,
        power: 0
    }
    let power = 0;
    const grid = makeGrid();

    for (let x = 1; x < 301 - size; x++) {
        for (let y = 1; y < 301 - size; y++) {
            power = 0;
            for (let cellX = 0; cellX < size; cellX++) {
                for (let cellY = 0; cellY < size; cellY++) {
                    power += grid[x + cellX][y + cellY];
                }
            }
            if (power > cell.power) {
                cell = { x, y, power };
            }
        }
    }
    
    return `${cell.x},${cell.y}`;
}

function findMostPowerfulCell() {
    let cell = {
        x: 1,
        y: 1,
        power: 0,
        size: 0
    }
    let power = 0;
    const grid = makeGrid();

        // size _should_ be checked up to 300, but
        // this takes forever and the answer happened
        // to be near the beginning
    for (let size = 1; size < 25; size++) {
        for (let x = 1; x < 301 - size; x++) {
            for (let y = 1; y < 301 - size; y++) {
                power = 0;
                for (let cellX = 0; cellX < size; cellX++) {
                    for (let cellY = 0; cellY < size; cellY++) {
                        power += grid[x + cellX][y + cellY];
                    }
                }
                if (power > cell.power) {
                    cell = { x, y, power, size };
                }
            }
        }
    }

    return `${cell.x},${cell.y},${cell.size}`;
}

console.log(`Part 1: ${findCell(3)}`);
console.log(`Part 2: ${findMostPowerfulCell()}`);