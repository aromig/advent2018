// Advent of Code 2018 - Day 16: Chronal Classification
// https://adventofcode.com/2018/day/16

const file = require('./file');
const input = file.read('day16').split(/\n/);

const OPCODES = [
    'addr',
    'addi',
    'mulr',
    'muli',
    'banr',
    'bani',
    'borr',
    'bori',
    'setr',
    'seti',
    'gtir',
    'gtri',
    'gtrr',
    'eqir',
    'eqri',
    'eqrr'
];

let sampleCount = 0;
let before = null;
let after = null;
let instr = null;
let opCodes = {};
let testprogram_started = false;
let registers = [0, 0, 0 ,0];

const reBefore = /Before: \[(\d+), (\d+), (\d+), (\d+)\]/;
const reAfter  = /After:  \[(\d+), (\d+), (\d+), (\d+)\]/;
const reInstr  = /(\d+) (\d+) (\d+) (\d+)/;

input.forEach(line => {
    if ((match = reBefore.exec(line))) {
        before = [match[1], match[2], match[3], match[4]].map(x => +x);
        return;
    }
    
    if ((match = reAfter.exec(line))) {
        after = [match[1], match[2], match[3], match[4]].map(x => +x);

        let possibleOps = findPossibleOps(before, after, instr);
        if (possibleOps.length >= 3) {
            sampleCount++;
        }
        
        opCodes[instr.opCode] = opCodes[instr.opCode] || [...OPCODES];
        opCodes[instr.opCode] = opCodes[instr.opCode].filter(op => possibleOps.indexOf(op) > -1);

        before = null;
        after = null;
        instr = null;
        
        return;
    }
    
    if ((match = reInstr.exec(line))) {
        instr = {
            opCode: match[1],
            A: +match[2],
            B: +match[3],
            C: +match[4]
        };

        if (!before) {
            if (!testprogram_started) {
                opCodes = refineOpCodes(opCodes);
                testprogram_started = true;
            }
            let op = opCodes[instr.opCode];
            registers = runOpCode(registers, op, instr.A, instr.B, instr.C);
        }
    }
});

console.log(`Part 1: ${sampleCount}`);
console.log(`Part 2: ${registers[0]}`);
console.log('\nopcode # -> name');
console.log(opCodes);

// Functions

function findPossibleOps(before, after, { opCode, A, B, C }) {
    return OPCODES.filter(op => {
        let opAfter = runOpCode(before, op, A, B, C);
        let match = JSON.stringify(opAfter) === JSON.stringify(after);
        return match;
    });
}

function runOpCode(reg, opCode, A, B, C) {
    let result = [...reg];

    switch (opCode) {
        case 'addr':
            if (!isRegister(A) || !isRegister(B))
                return;
            result[C] = reg[A] + reg[B];
            break;
        case 'addi':
            if (!isRegister(A))
                return;
            result[C] = reg[A] + B;
            break;
        case 'mulr':
            if (!isRegister(A) || (!isRegister(B)))
                return;
            result[C] = reg[A] * reg[B];
            break;
        case 'muli':
            if (!isRegister(A))
                return;
            result[C] = reg[A] * B;
            break;
        case 'banr':
            if (!isRegister(A) || !isRegister(B))
                return;
            result[C] = reg[A] & reg[B];
            break;
        case 'bani':
            if (!isRegister(A))
                return;
            result[C] = reg[A] & B;
            break;
        case 'borr':
            if (!isRegister(A) || !isRegister(B))
                return;
            result[C] = reg[A] | reg[B];
            break;
        case 'bori':
            if (!isRegister(A))
                return;
            result[C] = reg[A] | B;
            break;
        case 'setr':
            if (!isRegister(A))
                return;
            result[C] = reg[A];
            break;
        case 'seti':
            result[C] = A;
            break;
        case 'gtir':
            if (!isRegister(B))
                return;
            result[C] = A > reg[B] ? 1 : 0;
            break;
        case 'gtri':
            if (!isRegister(A))
                return;
            result[C] = reg[A] > B ? 1 : 0;
            break;
        case 'gtrr':
            if (!isRegister(A) || !isRegister(B))
                return;
            result[C] = reg[A] > reg[B] ? 1 : 0;
            break;
        case 'eqir':
            if (!isRegister(B))
                return;
            result[C] = A === reg[B] ? 1 : 0;
            break;
        case 'eqri':
            if (!isRegister(A))
                return;
            result[C] = reg[A] === B ? 1 : 0;
            break;
        case 'eqrr':
            if (!isRegister(A) || !isRegister(B))
                return;
            result[C] = reg[A] === reg[B] ? 1 : 0;
            break;
        default:
            throw new Error(`Unknown Operation: ${opCode}`);
    }

    return result;
}

function isRegister(x) {
    return x >= 0 && x <= 3;
}

function refineOpCodes(opCodes) {
    while (Object.values(opCodes).find(x => x.length > 1)) {
        Object.keys(opCodes).filter(oc => opCodes[oc].length === 1)
                            .forEach(oc => {
                                let op = opCodes[oc][0];
                                Object.keys(opCodes).filter(oc2 => oc2 !== oc)
                                                    .forEach(oc2 => {
                                                        opCodes[oc2] = opCodes[oc2].filter(op2 => op2 !== op);
                                                    });
                            });
    }

    Object.keys(opCodes).forEach(oc => {
        opCodes[oc] = opCodes[oc][0];
    });

    return opCodes;
}