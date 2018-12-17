// Advent of Code 2018 - Day 7: The Sum of Its Parts
// https://adventofcode.com/2018/day/7

const file = require('./file');
const input = file.read('day7').split(/\n/g);

const regex = /Step ([A-Z]) must be finished before step ([A-Z]) can begin/;

let steps = [];
let depends = {};

input.forEach(line => {
    const [/* match */, before, after] = regex.exec(line);
    if (!depends.hasOwnProperty(after))
        depends[after] = [];
    if (!depends.hasOwnProperty(before))
        depends[before] = [];
    depends[after].push(before);
});

let stepsCount = Object.keys(depends).length;

while (steps.length < stepsCount) {
    nextStep = Object.entries(depends)
                     .filter(([step, dependentSteps]) => dependentSteps.length === 0)
                     .map(([step]) => step)
                     .sort()[0];
    steps.push(nextStep);

    delete depends[nextStep];

    Object.keys(depends).forEach(step => {
        const idx = depends[step].indexOf(nextStep);
        if (idx > -1)
            depends[step].splice(idx, 1);
    });
}

console.log(`Part 1: ${steps.join('')}`);

/* PART 2 */

steps = [];
depends = {};
const workerCount = 5;
const stepDuration = 60;
const workers = [];

input.forEach(line => {
    const [/* match */, before, after] = regex.exec(line);
    if (!depends.hasOwnProperty(after))
        depends[after] = [];
    if (!depends.hasOwnProperty(before))
        depends[before] = [];
    depends[after].push(before);
});

stepsCount = Object.keys(depends).length;

for (let i = 0; i < workerCount; i++) {
    workers.push({
        ends: null,
        step: null
    });
}

let time = 0;

while (steps.length < stepsCount) {
    time++;

    workers.forEach((worker, i) => {
        if (worker.step !== null && worker.ends === time) {
            steps.push(worker.step);

            delete depends[worker.step];

            Object.keys(depends).forEach(step => {
                const idx = depends[step].indexOf(worker.step);

                if (idx > -1)
                    depends[step].splice(idx, 1);
            });

            worker.ends = null;
            worker.step = null;

            workers.splice(i, 1, worker);
        }
    });

    const availableSteps = Object.entries(depends)
        .filter(([step, dependentSteps]) => {
            for (const worker of workers) {
                if (worker.step === step)
                    return false;
            }
            return dependentSteps.length === 0;
        })
        .map(([step]) => step)
        .sort();

    workers.forEach((worker, i) => {
        if (availableSteps.length > 0 && worker.step === null) {
            const step = availableSteps.shift();

            worker.step = step;
            worker.ends = time + (step.charCodeAt(0) - 64) + stepDuration;

            workers.splice(i, 1, worker);
        }
    });
}

console.log(`Part 2: ${--time}`);