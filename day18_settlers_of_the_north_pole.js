// Advent of Code 2018 - Day 18: Settlers of the North Pole
// https://adventofcode.com/2018/day/18

const file = require('./file');
const input = file.read('day18').split(/\n/);

/*
    . open ground
    | trees
    # lumberyard

    every minute
    . -> | if 3+ adjacent acres === |
    | -> # if 3+ adjacent acres === #
    # stays # if adjacent to 1+ # and 1+ |
        else -> .

    changes happen at the same time and do not affect each other

    total resource value = | multiplied by #
*/

const OPEN = '.';
const TREE = '|';
const LUMBER = '#';
const lumberyard = input.map(line => line.split(''));

console.log(`Part 1: ${runSimulation(lumberyard, 10)}`);
console.log(`Part 2: ${runSimulation(lumberyard, 1000000000, true)}`);

// Functions

function runSimulation(originalArea, minutes, findPattern = false) {
    let area = JSON.parse(JSON.stringify(originalArea));
    const size = originalArea[0].length;
    let minute = 0;
    let totalResourceValue = 0;
    let areaHistory = {};

    while (minute < minutes) {
        // clearConsole();
        // printMap(area);

        area = makeChanges(area, size);
        minute++;

        if (findPattern) {
            let strArea = JSON.stringify(area);
            let previous = areaHistory[strArea];

            if (previous) {
                let loopLength = minute - previous;

                while (minute < minutes)
                    minute += loopLength;

                minute -= loopLength;

                return runSimulation(area, minutes - minute);
            } else {
                areaHistory[strArea] = minute;
            }
        }
    }

    totalResourceValue = numberOf(area, TREE) * numberOf(area, LUMBER);

    return totalResourceValue;
}

function makeChanges(area, size) {
    // create a new blank area
    let newArea = new Array(size);
    for (let i = 0; i < size; i++)
        newArea[i] = new Array(size);

    for (let i_y = 0; i_y < size; i_y++)
        for (let i_x = 0; i_x < size; i_x++)
            newArea[i_y][i_x] = changeState(area, size, i_x, i_y);
    
    return newArea;
}

function changeState(area, size, x, y) {
    let surroundingAcres = scanSurroundings(area, size, x, y);
    switch (area[y][x]) {
        case OPEN:
            return surroundingAcres.filter(x => x === TREE).length >= 3
                    ? TREE : OPEN;
        case TREE:
            return surroundingAcres.filter(x => x === LUMBER).length >= 3
                    ? LUMBER : TREE;
        case LUMBER:
            return surroundingAcres.filter(x => x === LUMBER).length >= 1 &&
                    surroundingAcres.filter(x => x === TREE).length >= 1
                    ? LUMBER : OPEN;
        default:
            throw new Error(`Whoa, are you lost? What is a ${area[y][x]} at ${[x]},${[y]}`);
    }
}

function scanSurroundings(area, size, x, y) {
    let surroundings = [];
    for (let i_x = x - 1; i_x <= x + 1; i_x++)
        for (let i_y = y - 1; i_y <= y + 1; i_y++)
            if (i_x >= 0 &&
                i_x < size &&
                i_y >= 0 &&
                i_y < size &&
                (i_x !== x || i_y !== y)
            )
                surroundings.push(area[i_y][i_x]);

    return surroundings;
}

function numberOf(area, type) {
    return area.map(x => x.filter(y => y === type).length)
               .reduce((acc, x) => acc + x, 0);
}

function printMap(map) {
    console.log(map.map(x => x.join('')).join('\n'));
}

function clearConsole() {
    process.stdout.write('\x1Bc');
}