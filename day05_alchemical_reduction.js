// Advent of Code 2018 - Day 5: Alchemical Reduction
// https://adventofcode.com/2018/day/5

const file = require('./file');
const input = file.read('day5');

function makePolymer(seq) {
    let i = 0;

    while (seq[i + 1] !== undefined) {
        let current = seq.charCodeAt(i);
        let next = seq.charCodeAt(i + 1);
        if (current === next + 32 || current === next - 32) {
            seq = seq.slice(0, i) + seq.slice(i + 2);
            i--;
        } else {
            i++;
        }
    }

    return seq;
}

function optimize(seq) {
    let upper = 65;
    let lower = 97;
    let result = seq.length;

    for (let i = 0; i < 25; i++) {
        let regex = `(${String.fromCharCode(upper + i)}|${String.fromCharCode(lower + i)})`;
        let trial = seq.replace(RegExp(regex, 'g'), '');
        let count = makePolymer(trial).length;
        if (count < result)
            result = count;
    }

    return result;
}

let polymer = makePolymer(input);

console.log(`Part 1: ${polymer.length}`);
console.log(`Part 2: ${optimize(polymer)}`);