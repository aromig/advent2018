// Advent of Code 2018 - Day 8: Memory Maneuver
// https://adventofcode.com/2018/day/8

const file = require('./file');
const input = file.read('day8');

const data = input.split(/ /).map(x => +x);

// 1st value of header = # children in node
// 2nd value of header = # metadata entries in node

let metadataTotal = 0;

function parse(data) {
    const node = {
        children: [],
        metadata: [],
        value: function() {
            if (this.children.length === 0) {
                return this.metadata.reduce((acc, x) => acc + x, 0);
            } else {
                return this.metadata.filter(x => x <= this.children.length)
                                    .map(x => this.children[x - 1].value())
                                    .reduce((acc, x) => acc + x, 0);
            }
        }
    }

    let childrenCount = data.shift();
    let metadataCount = data.shift();

    while (childrenCount--)
        node.children.push(parse(data));
    
    while (metadataCount--) {
        let meta = data.shift();
        metadataTotal += meta;
        node.metadata.push(meta);
    }

    return node;
}

const nodes = parse(data);

console.log(`Part 1: ${metadataTotal}`);
console.log(`Part 2: ${nodes.value()}`);