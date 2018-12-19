// Advent of Code 2018 - Day 10: The Stars Align
// https://adventofcode.com/2018/day/10

const file = require('./file');
const input = file.read('day10');

const points = input.split(/\n/)
                    .map(line => {
                        const [posX, posY, velX, velY] = line.match(/(-?\d+)/g).map(x => +x);
                        return {
                            posX: posX,
                            posY: posY,
                            velX: velX,
                            velY: velY
                        }
                    });

let min = Number.MAX_SAFE_INTEGER;
let seconds = 0;

while (true) {
    let max = Number.MIN_SAFE_INTEGER;
    points.forEach(point => {
        point.posX += point.velX;
        point.posY += point.velY;
        if (Math.abs(point.posY) > max)
            max = Math.abs(point.posY);
    });

    if (max < min) {
        min = max;
    } else {
        points.forEach(point => {
            point.posX -= point.velX;
            point.posY -= point.velY;
        });
        break;
    }
    
    seconds++;
}

let minX = Number.MAX_SAFE_INTEGER;
let minY = Number.MAX_SAFE_INTEGER;
let maxX = Number.MIN_SAFE_INTEGER;
let maxY = Number.MIN_SAFE_INTEGER;

points.forEach(point => {
    if (point.posX < minX)
        minX = point.posX;
    if (point.posY < minY)
        minY = point.posY;
    if (point.posX > maxX)
        maxX = point.posX;
    if (point.posY > maxY)
        maxY = point.posY;
});

function drawSky(points) {
    let grid = [];
    let boundaryX = Math.abs(maxX) + 4;
    let boundaryY = Math.abs(maxY) + 4;

    for (let y = 0; y < boundaryY; y++) {
        grid.push([]);
        for (let x = 0; x < boundaryX; x++) {
            grid[y].push('.');
        }
    }

    points.forEach(point => grid[point.posY][point.posX] = '#');

    if (minY > 0)
        grid = grid.slice(minY - 1);
    if (minX > 0)
        grid = grid.map(g => g.slice(minX - 1));
    
    let sky = '';

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            sky += grid[y][x];
        }
        sky += '\n';
    }

    return sky;
}

console.log(`Part 1:\n${drawSky(points)}`);
console.log(`Part 2: ${seconds} seconds`);