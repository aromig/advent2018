// Advent of Code 2018 - Day 21: Chronal Conversion
// https://adventofcode.com/2018/day/21

const file = require('./file');
const input = file.read('day21').split(/\n/);

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

let TARGET_PTR = 28; // instruction 28 is the only one that even involves register 0
let IP_REGISTER;
const program = [];
let reIP = /#ip (\d+)/;
let reInstr = /([a-z]+) (\d+) (\d+) (\d+)/;

input.forEach(line => {
    if (match = reInstr.exec(line)) {
        let [opcode, A, B, C] = match.slice(1).map((x, idx) => (idx > 0 ? +x : x));
        program.push({ opcode, A, B, C });
        return;
    } else if (match = reIP.exec(line)) {
        IP_REGISTER = +match[1];
        return;
    }
});

// console.log(`Instruction Pointer bound to Register ${IP_REGISTER}`);
const results = runProgram(program);

console.log(`Part 1: ${results.part1}`);
console.log(`Part 2: ${results.part2}`);

function runProgram(program) {
    let registerZeroList = [];
    let register = [0, 0, 0, 0, 0, 0];
    let ip = 0;

    let results = {
        part1: null,
        part2: null
    };

    programLoop: while (ip < program.length) {
        register[IP_REGISTER] = ip;
        let instr = program[ip];

        if (ip === TARGET_PTR) {
            let registerZeroValue = register[instr.A];
            if (registerZeroList.includes(registerZeroValue))
                break programLoop;

            registerZeroList.push(registerZeroValue);
        }

        OPCODES[instr.opcode](register, instr.A, instr.B, instr.C);

        ip = register[IP_REGISTER];

        ip++;
    }

    results.part1 = registerZeroList[0];
    results.part2 = registerZeroList[registerZeroList.length - 1];

    return results;
}