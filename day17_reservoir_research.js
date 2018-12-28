// Advent of Code 2018 - Day 17: Reservoir Research
// https://adventofcode.com/2018/day/17

const file = require('./file');
const input = file.read('day17').split(/\n/);

const CLAY = '#';
const WATER = '~';
const WATER_FLOWING = '|';
const POCKETS = []; // Clay & Water

const regex = /([xy])=(\d+)(..)?(\d+)?, ([xy])=(\d+)(..)?(\d+)?/;

input.forEach(line => {
    let match = regex.exec(line);
    if (match) {
        let [/* match */, xy1, start1, /*..*/, end1, xy2, start2, /*..*/, end2] = [...match];
        let contents = parseLine(xy1, start1, end1, xy2, start2, end2);
        
        for (let i_x = contents.x.from; i_x <= contents.x.to; i_x++)
            for (let i_y = contents.y.from; i_y <= contents.y.to; i_y++) {
                POCKETS.push( { x: i_x, y: i_y } );
            }
    }
});

let results = runSim(POCKETS);

//printMap(results);

console.log(`Part 1: ${results.part1}`);
console.log(`Part 2: ${results.part2}`);

// Functions

function runSim(pockets) {
    let data = {
        part1: null,
        part2: null,
        minY: pockets.reduce((min, {y}) => (min === null || y < min ? y : min), null),
        maxY: pockets.reduce((max, {y}) => (max === null || y > max ? y : max), null),
        filled: pockets.reduce((map, {x,y}) => {
            map[XY({x,y})] = CLAY;
            return map;
        }, {})
    };

    let cursor = { x: 500, y: 0 };
    letWaterFlow(data, {...cursor});

    data.part1 = Object.values(data.filled).filter(content => [WATER, WATER_FLOWING].indexOf(content) > -1).length;

    data.part2 = Object.values(data.filled).filter(content => [WATER].indexOf(content) > -1).length;

    return data;
}

function parseLine(xy1, start1, end1, xy2, start2, end2) {
    let contents = {};
    contents[xy1] = {
        from: +start1,
        to: end1 !== undefined ? +end1 : +start1
    };
    contents[xy2] = {
        from: +start2,
        to: end2 !== undefined ? +end2 : +start2
    };

    return contents;
}

function XY( { x, y } ) {
    return `${x},${y}`;
}

function letWaterFlow(data, cursor) {
    if (cursor.y >= data.maxY)
        return;
    
    let cursorDOWN  = { ...cursor, y: cursor.y + 1 };
    let cursorLEFT  = { ...cursor, x: cursor.x - 1 };
    let cursorRIGHT = { ...cursor, x: cursor.x + 1 };

    if (isEmpty(data, cursorDOWN)) {
        if (cursorDOWN.y >= data.minY) {
            fill(data, cursorDOWN, WATER_FLOWING);
        }
        letWaterFlow(data, cursorDOWN);
    }

    if (isFilled(data, cursorDOWN, [WATER, CLAY]) && isEmpty(data, cursorLEFT)) {
        fill(data, cursorLEFT, WATER_FLOWING);
        letWaterFlow(data, cursorLEFT);
    }

    if (isFilled(data, cursorDOWN, [WATER, CLAY]) && isEmpty(data, cursorRIGHT)) {
        fill(data, cursorRIGHT, WATER_FLOWING);
        letWaterFlow(data, cursorRIGHT);
    }

    if (isFilled(data, cursorDOWN, [WATER, CLAY]) && isWallToLeft(data, cursor) && isWallToRight(data, cursor)) {
        fillToLeft(data, cursor, WATER);
        fillToRight(data, cursor, WATER);
        fill(data, cursor, WATER);
    }
}

function getContents(data, cursor) {
    return data.filled[XY(cursor)];
}
function isEmpty(data, cursor) {
    return !getContents(data, cursor);
}
function isFilled(data, cursor, contents) {
    return contents.indexOf(getContents(data, cursor)) > -1;
}

function fill(data, cursor, contents) {
    data.filled[XY(cursor)] = contents;
}
function fillToLeft(data, cursor, contents) {
    let offset = -1;
    while (true) {
        let cursorOffset = { ...cursor, x: cursor.x + offset };
        if (isFilled(data, cursorOffset, [CLAY]))
            return;
        
        fill(data, cursorOffset, contents);
        offset--;
    }
}
function fillToRight(data, cursor, contents) {
    let offset = 1;
    while (true) {
        let cursorOffset = { ...cursor, x: cursor.x + offset };
        if (isFilled(data, cursorOffset, [CLAY]))
            return;

        fill(data, cursorOffset, contents);
        offset++;
    }
}

function isWallToLeft(data, cursor) {
    let offset = -1;
    while (true) {
        let cursorOffset = { ...cursor, x: cursor.x + offset };
        if (isEmpty(data, cursorOffset))
            return false;
        if (isFilled(data, cursorOffset, [CLAY]))
            return true;
        offset--;
    }
}
function isWallToRight(data, cursor) {
    let offset = 1;
    while (true) {
        let cursorOffset = { ...cursor, x: cursor.x + offset };
        if (isEmpty(data, cursorOffset))
            return false;
        if (isFilled(data, cursorOffset, [CLAY]))
            return true;
        offset++;
    }
}

function printMap(data) {
    let bounds = Object.keys(data.filled)
                    .map(xy => xy.split(',')
                    .map(x => +x))
                    .reduce((acc, [x, y]) => {
                            acc.minX = Math.min(acc.minX, x);
                            acc.maxX = Math.max(acc.maxX, x);
                            acc.minY = Math.min(acc.minY, y);
                            acc.maxY = Math.max(acc.maxY, y);
                            return acc;
                        },
                        {
                            minX: Infinity,
                            maxX: -Infinity,
                            minY: Infinity,
                            maxY: -Infinity
                        }
                    );
    let MAP = '';
    for (let i_y = bounds.minY; i_y <= bounds.maxY; i_y++) {
        for (let i_x = bounds.minX; i_x <= bounds.maxX; i_x++) {
            MAP += getContents(data, {x: i_x, y: i_y }) || '.';
        }
        MAP += '\n';
    }

    console.log(bounds);
    console.log(MAP);
}