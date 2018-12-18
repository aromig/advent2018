// Advent of Code 2018 - Day 9: Marble Mania
// https://adventofcode.com/2018/day/9

const file = require('./file');
const input = file.read('day9');

const [players, marbleWorth] = input.match(/\d+/g).map(x => +x);

function insertAfter(marble, value) {
    const newMarble = {
        value,
        previous: marble,
        next: marble.next
    };

    marble.next.previous = newMarble;
    marble.next = newMarble;

    return newMarble;
}

function playGame(players, marbleWorth) {
    const scores = {};

    for (let i = 1; i <= players; i++)
        scores[i] = 0;

    let currentPlayer = 1;
    let currentMarble = {
        value: 0
    }

    currentMarble.next = currentMarble;
    currentMarble.previous = currentMarble;

    for (let marble = 1; marble <= marbleWorth; marble++) {
        if (marble % 23 === 0) {
            scores[currentPlayer] += marble;
            currentMarble = currentMarble.previous.previous.previous.previous.previous.previous;
            scores[currentPlayer] += currentMarble.previous.value;
            currentMarble.previous.previous.next = currentMarble;
            currentMarble.previous = currentMarble.previous.previous;
        } else {
            currentMarble = insertAfter(currentMarble.next, marble);
        }
        currentPlayer = currentPlayer % players + 1;
    }

    return Math.max(...Object.values(scores));
}

console.log(`Part 1: ${playGame(players, marbleWorth)}`);
console.log(`Part 2: ${playGame(players, marbleWorth * 100)}`);