// Advent of Code 2018 - Day 2: Inventory Management System
// https://adventofcode.com/2018/day/2

const file = require('./file');
const input = file.read('day2').split(/\n/g);

// Part 1

let twos = 0;
let threes = 0;

input.forEach(box => {
    counts = [];
    for (const letter of box) {
        counts[letter] = counts[letter] === undefined ? 1 : ++counts[letter];
    }
    for (const key in counts) {
        const count = counts[key];
        if (count === 2) {
            twos++;
            break;
        }
    }
    for (const key in counts) {
        const count = counts[key];
        if (count === 3) {
            threes++;
            break;
        }
    }
});

const checksum = twos * threes;

// Part 2

let common_letters = [];

for (let item of input) {
    let letters_A = item.split('');
    for (let i = input.indexOf(item) + 1; i < input.length; ++i) {
        let diff = [];
        let letters_B = input[i].split('');
        for (let j = 0; j < letters_A.length; ++j) {
            if (letters_A[j] !== letters_B[j]) {
                if (diff.push(letters_A[j]) >= 2)
                break;
            }
        }
        if (diff.length === 1) {
            common_letters[1] = item.replace(diff[0], '');
            break;
        }
    }
}

common_letters = common_letters.reduce((a, b) => a.concat(b));

console.log(`Part 1: ${checksum}`);
console.log(`Part 2: ${common_letters}`);
