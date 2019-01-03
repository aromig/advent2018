// Advent of Code 2018 - Day 19: Go With The Flow
// https://adventofcode.com/2018/day/19

const file = require('./file');
const input = file.read('day19').split(/\n/);

const OPCODES = {
    addr: (reg, A, B, C) => (reg[C] = reg[A] + reg[B]),
    addi: (reg, A, B, C) => (reg[C] = reg[A] + B),
    mulr: (reg, A, B, C) => (reg[C] = reg[A] * reg[B]),
    muli: (reg, A, B, C) => (reg[C] = reg[A] * B),
    banr: (reg, A, B, C) => (reg[C] = reg[A] & reg[B]),
    bani: (reg, A, B, C) => (reg[C] = reg[A] & B),
    borr: (reg, A, B, C) => (reg[C] = reg[A] | reg[B]),
    bori: (reg, A, B, C) => (reg[C] = reg[A] | B),
    setr: (reg, A, B, C) => (reg[C] = reg[A]),
    seti: (reg, A, B, C) => (reg[C] = A),
    gtir: (reg, A, B, C) => (reg[C] = A > reg[B] ? 1 : 0),
    gtri: (reg, A, B, C) => (reg[C] = reg[A] > B ? 1 : 0),
    gtrr: (reg, A, B, C) => (reg[C] = reg[A] > reg[B] ? 1 : 0),
    eqir: (reg, A, B, C) => (reg[C] = A === reg[B] ? 1 : 0),
    eqri: (reg, A, B, C) => (reg[C] = reg[A] === B ? 1 : 0),
    eqrr: (reg, A, B, C) => (reg[C] = reg[A] === reg[B] ? 1 : 0)
};

let IP_REGISTER;
const program = [];
let reIP = /#ip (\d+)/;
let reInstr = /([a-z]+) (\d+) (\d+) (\d+)/;

input.forEach(line => {
    if (match = reInstr.exec(line)) {
        let [opcode, A, B, C] = match.slice(1).map((x, idx) => (idx > 0 ? +x : x));
        program.push( { opcode, A, B, C } );
        return;
    } else if (match = reIP.exec(line)) {
        IP_REGISTER = +match[1];
        return;
    }
});

//console.log(`Instruction Pointer bound to Register ${IP_REGISTER}`);
console.log(`Part 1: ${runProgram(program)}`);
console.log(`Part 2: ${runProgram(program, [1, 0, 0, 0, 0, 0])}`);

// Functions

function runProgram(program, initialRegister = [0, 0, 0, 0, 0, 0]) {
    let register = [...initialRegister];
    let ip = 0;
    let count = 0;

    while (ip < program.length) {
        register[IP_REGISTER] = ip;
        let instr = program[ip];

        OPCODES[instr.opcode](register, instr.A, instr.B, instr.C);

        ip = register[IP_REGISTER];
        ip++;
        count++;

        /* Part 2 only:
        After a quick sample, add up the divisors of the value of
        register 5 to get the eventual value of register 0.*/
        if (initialRegister[0] === 1 && count > 20) {
            return sumDivisors(register[5]);
        }
    }

    return register[0];
}

function sumDivisors(n) {
    return [...Array(n + 1).keys()]
        .slice(1)
        .reduce((acc, x) => acc + (!(n % x) && x), 0);
}