// Advent of Code 2018 - Day 22: Mode Maze
// https://adventofcode.com/2018/day/22

const file = require('./file');
const input = file.read('day22').split(/\n/);

const depth = +(input[0].split(/\s/)[1]);
const targetCoords = input[1].match(/(\d+),(\d+)/);
const target = { x: +targetCoords[1], y: +targetCoords[2] };

const [ROCKY, WET, NARROW] = ['.', '=', '|'];
const [MOUTH, TARGET] = ['M', 'T'];
const [TORCH, GEAR, NEITHER] = [0, 1, 2];
const TOOLS = ['TORCH', 'CLIMBING GEAR', 'NEITHER'];

let [width, height] = [target.x, target.y];
let cave = [];

console.time('buildmap');
buildMap(width, height);
console.timeEnd('buildmap');

// console.log(cave);
// printMap(cave, width);

console.time('part1');
console.log(`Part 1: ${getRiskLevel(cave, target)}`);
console.timeEnd('part1');

cave = [];              // Reset the cave map
width = target.x + 50;  // Give some buffer around the target
height = target.y + 20; // as path may go around it

console.time('buildmap');
buildMap(width, height);
console.timeEnd('buildmap');

// printMap(cave, width);

console.time('part2');
console.log(`Part 2: ${findQuickestPath()}`);
console.timeEnd('part2');

function buildMap(width, height) {
    for (let y = 0; y <= height; y++) {
        for (let x = 0; x <= width; x++) {
            const region = {
                x: x,
                y: y,
                type: null,
                erosion: null,
                risk: 0,
                tools: null
            };

            region.erosion = getErosionLevel(x, y);
            const regionType = region.erosion % 3;

            if (x === 0 && y === 0) {
                region.type = MOUTH;
                region.tools = [TORCH];
            } else if (x === target.x && y === target.y) {
                region.type = TARGET;
                region.tools = [TORCH];
            } else {
                region.type = regionType === 0 ? ROCKY : regionType === 1 ? WET : NARROW;
                region.risk = regionType;
                region.tools = region.type === ROCKY ? [GEAR, TORCH] : region.type === WET ? [GEAR, NEITHER] : [TORCH, NEITHER];
            }

            cave.push(region);
        }
    }
}

function getGeologicIndex(x, y) {
    if (x === 0 && y === 0) {
        return 0;
    } else if (x === target.x && y === target.y) {
        return 0;
    } else if (y === 0) {
        return x * 16807;
    } else if (x === 0) {
        return y * 48271;
    } else {
        let region = getRegion(x, y);
        if (region === undefined) {
            return getErosionLevel(x - 1, y) * getErosionLevel(x, y - 1);
        } else {
            let regionToLeft = getRegion(x - 1, y);
            let regionAbove = getRegion(x, y - 1);
            return regionToLeft.erosion * regionAbove.erosion;
        }
    }
}

function getRegion(x, y) {
    return cave.find(r => r.x === x && r.y === y);
}

function getErosionLevel(x, y) {
    return ((getGeologicIndex(x,y) + depth) % 20183);
}

function getRiskLevel(map, { x, y } ) {
    return map.filter(r => r.x <= x && r.y <= y)
        .reduce((acc, r) => acc + r.risk, 0);
}

function printMap(map, width) {
    let printMap = map.map(x => x.type).join('');

    for (let i = 0; i < printMap.length; i = i + width + 1) {
        console.log(printMap.slice(i, i + width + 1));
    }
}

function getAllowedTools(x, y) {
    return getRegion(x, y).tools;
}

function addToSet(set, key) {
    if (set.has(key)) {
        return false;
    } else {
        set.add(key);
        return true;
    }
}

function key(x, y, tool) {
    return `${x},${y},${tool}`;
}

function findQuickestPath() {
    const queue = [];
    const visited = new Set();

    queue.push([0, 0, TORCH, 0, 0]);
    visited.add(key(0, 0, TORCH));

    while (queue.length > 0) {
        const [x, y, tool, minutes, waitTime] = queue.shift();
        const visitedKey = key(x, y, tool);
        // console.log(`${x},${y} -> ${TOOLS[tool]}`);

        if (waitTime > 0) {
            if (waitTime !== 1 || addToSet(visited, visitedKey)) {
                queue.push([x, y, tool, minutes + 1, waitTime - 1]);
            }
            continue;
        }
        
        if (target.x === x  && target.y === y && tool === TORCH) {
            return minutes;
        }

        for (const [nx, ny] of [[x - 1, y], [x, y + 1], [x + 1, y], [x, y - 1]]) {
            if (nx < 0 || nx >= width || ny < 0 || ny >= height)
                continue;

            if (getAllowedTools(nx, ny).includes(tool) && addToSet(visited, key(nx, ny, tool))) {
                queue.push([nx, ny, tool, minutes + 1, 0]);
            }
        }

        const newTool = getAllowedTools(x, y).filter(t => t !== tool)[0];
        queue.push([x, y, newTool, minutes + 1, 6]);
    }

    return -1;
}