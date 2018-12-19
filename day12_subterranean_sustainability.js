// Advent of Code 2018 - Day 12: Subterranean Substainability
// https://adventofcode.com/2018/day/12

const file = require('./file');
const input = file.read('day12').split(/\n/);

function newGeneration(plantArea, changes) {
    plantArea = `..${plantArea}...`;
    let newPlantArea = '';

    for (let i = 2; i < plantArea.length - 2; i++) {
        let section = plantArea.slice(i - 2, i + 3);
        let pot = changes.get(section) || '.';
        newPlantArea += pot;
    }

    return newPlantArea;
}

const init_state = `${input.shift().slice(15)}`;
let nextGen = '.' + init_state;

let changes = new Map();
input.slice(1).forEach(x => {
    const [pattern, /* => */, next] = x.split(/ /);
    changes.set(pattern, next);
});

function runSimulation(generations) {
    let i = 0;
    for (; i < generations; i++) {
        nextGen = newGeneration(nextGen, changes);
    }

    let sum = 0;
    let plants = 0;
    let idx = -1;

    for (let i = 0; i < nextGen.length; i++) {
        if (nextGen[i] === '#') {
            sum += idx;
            plants++;
            //console.log(i, idx);
        }
        idx++;
    }

    return [sum, plants, i];
}

const [part1_sum, ,] = runSimulation(20);
console.log(`Part 1: ${part1_sum}`);

nextGen = '.' + init_state; // Reset!
const [part2_sum, plants, remaining] = runSimulation(5000);
const remainingGenerations = 50000000000 - remaining;
console.log(`Part 2: ${plants * remainingGenerations + part2_sum}`);