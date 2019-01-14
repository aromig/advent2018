// Advent of Code 2018 - Day 23: Experimental Emergency Teleportation
// https://adventofcode.com/2018/day/23

const file = require('./file');
const input = file.read('day23').split(/\n/);

const regex = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/;

const nanobots = input.map(line => {
    const match = line.match(regex);
    const nanobot = {
        x: +match[1],
        y: +match[2],
        z: +match[3],
        r: +match[4]
    };

    return nanobot;
});

const largestRadius = Math.max.apply(null, nanobots.map(bot => bot.r));
const strongestBot = nanobots.filter(bot => bot.r === largestRadius)[0];

const botsInRangeOfStrongest = nanobots.filter(bot => getDistance(bot, strongestBot) <= strongestBot.r);

console.log(`Part 1: ${botsInRangeOfStrongest.length}`);

[minX, minY, minZ] = lowestCoord();
[maxX, maxY, maxZ] = highestCoord();

let mostBots = 0;
let bestCoords = null;
let size = maxX - minX;

const origin = { x: 0, y: 0, z: 0 };

while (size > 0) {
    for (let x = minX; x <= maxX; x += size) {
        for (let y = minY; y <= maxY; y += size) {
            for (let z = minZ; z <= maxZ; z += size) {
                let currentCoords = { x: x, y: y, z: z};

                const bots = botsInRange(currentCoords);

                if (bots.length >= mostBots) {
                    if (bots.length === mostBots) {
                        if (!bestCoords || getDistance(currentCoords, origin) < getDistance(bestCoords, origin)) {
                            // console.log(currentCoords, bots.length, '=', mostBots, `size = ${size}`);
                            bestCoords = currentCoords;
                        }
                    } else {
                        // console.log(currentCoords, bots.length, '>', mostBots, `size = ${size}`);
                        mostBots = bots.length;
                        bestCoords = currentCoords;
                    }
                }
            }
        }
    }

    if (bestCoords !== null) {
        minX = bestCoords.x - size;
        maxX = bestCoords.x + size;
        minY = bestCoords.y - size;
        maxY = bestCoords.y + size;
        minZ = bestCoords.z - size;
        maxZ = bestCoords.z + size;
    }

    size = Math.floor(size / 2);
}

// console.log(bestCoords);
console.log(`Part 2: ${getDistance(bestCoords, origin)}`);

function botsInRange({ x, y, z }) {
    return nanobots.filter(bot => getDistance({ x: x, y: y, z: z }, bot) <= bot.r);
}

function lowestCoord() {
    const minX = Math.min.apply(null, nanobots.map(bot => bot.x));
    const minY = Math.min.apply(null, nanobots.map(bot => bot.y));
    const minZ = Math.min.apply(null, nanobots.map(bot => bot.z));
    return [minX, minY, minZ];
}

function highestCoord() {
    const maxX = Math.max.apply(null, nanobots.map(bot => bot.x));
    const maxY = Math.max.apply(null, nanobots.map(bot => bot.y));
    const maxZ = Math.max.apply(null, nanobots.map(bot => bot.z));
    return [maxX, maxY, maxZ];
}

function getDistance(bot1, bot2) {
    return Math.abs(bot1.x - bot2.x) + Math.abs(bot1.y - bot2.y) + Math.abs(bot1.z - bot2.z);
}