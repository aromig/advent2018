// Advent of Code 2018 - Day 4: Repose Record
// https://adventofcode.com/2018/day/4

const file = require('./file');
const input = file.read('day4').split(/\n/g);

const reDate = /[0-9]{4}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}/;
const reGuard = /\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (Guard #|)(\d+|wakes|falls)/;

input.sort((a, b) => new Date(a.match(reDate)) - new Date(b.match(reDate)));

let guards = [];
let guard;
let sleep;

input.forEach(line => {
    [/* match */,/* year */,/* month */,/* day */,/* hour */,minute,/* guard? */,state] = reGuard.exec(line);

    if (state === 'wakes') {
        for (let i = sleep; i < +minute; i++) {
            guards[guard][i]++;
        }
    } else if (state === 'falls') {
        sleep = +minute;
    } else {
        guard = state;
        if (!guards[guard]) guards[guard] = new Array(60).fill(0);
    }
});

function maxMinute(arr) {
    const times = Math.max(...arr);
    const minute = arr.findIndex(x => x == times );
    return [times, minute];
}

let sleptMost = [-1, -1, -1];

guards.forEach((arr, id) => {
    const minutes = arr.reduce((a, b) => a + b, 0);
    [,minute] = maxMinute(arr);
    if (minutes > sleptMost[1]) {
        sleptMost = [id, minutes, minute];
    }
});

/*
// Running through the data to see what should be happening
let mostest = 0;
let result = 0;

for (let guard of guards) {
    if (guard !== undefined) {
        let guard_id = guards.indexOf(guard);
        let most = Math.max(...guard);
        let minute = guard.findIndex(x => x == most);
        console.log(`Guard # ${guard_id} -> minute ${minute} - ${most} times`);
        if (most > mostest) {
            mostest = most;
            result = guard_id * minute;
        }
    }
}
console.log(result);
*/

let sleptMostTimes = [-1, -1, -1];

guards.forEach((arr, id) => {
    [times, minute] = maxMinute(arr);
    if (times > sleptMostTimes[1]) {
        sleptMostTimes = [id, times, minute];
    }
});

console.log(`Guard # ${sleptMost[0]} slept ${sleptMost[1]} minutes; the most spent at minute ${sleptMost[2]}`);
console.log(`Part 1: ${sleptMost[0]*sleptMost[2]}`);

console.log(`Guard # ${sleptMostTimes[0]} slept most consistently, ${sleptMostTimes[1]} times on the same minute (00:${sleptMostTimes[2]})`);
console.log(`Part 2: ${sleptMostTimes[0]*sleptMostTimes[2]}`);