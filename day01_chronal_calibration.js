// Advent of Code 2018 - Day 1: Chronal Calibration
// https://adventofcode.com/2018/day/1

const file = require('./file');
const input = file.read('day1').split(/\n/g).map(Number);

const finalFrequency = input.reduce((acc, freq) => acc + freq, 0);
const firstDuplicate = findFirstDuplicate(input);

function findFirstDuplicate(arr) {
    let frequency = 0;
    const seen = new Set();

    while (true) {
        for (const freq of arr) {
            frequency += freq;
            if (seen.has(frequency)) {
                return frequency;
            } else {
                seen.add(frequency);
            }
        }
    }
}

console.log(`Part 1: ${finalFrequency}`);
console.log(`Part 2: ${firstDuplicate}`);