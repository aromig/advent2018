// Advent of Code 2018 - Day 24: Immune System Simulator 20XX
// https://adventofcode.com/2018/day/24

const file = require('./file');
const input = file.read('day24').split(/\n/);

class group {
    constructor (units, hp, atk, type, init, weakness, immunity) {
        this.units = units;                 // int
        this.hp = hp;                       // int
        this.atk = atk;                     // int
        this.type = type;                   // string
        this.initiative = init;             // int
        this.weaknesses = weakness;         // array of strings
        this.immunities = immunity;         // array of strings
        this.targetIndex = null;            // int
        this.targeted = false;              // bool
    }
}

const TEAM_IMMUNE_SYS = 0;
const TEAM_INFECTION = 1;

// Part 1

let IMMUNE_SYS = [];
let INFECTION = [];
parseInput(input);

let [teamImmuneLeft, teamInfectionLeft] = runSimulation();

const winningArmy = teamImmuneLeft > 0 ? teamImmuneLeft : teamInfectionLeft;

console.log(`Part 1: ${winningArmy}`);

// Part 2

let boost = 1;

let infectionLeft = 1;
let immuneLeft;

while (true)  {
    IMMUNE_SYS = [];
    INFECTION = [];
    parseInput(input);
    
    infectionLeft = INFECTION.reduce((acc, x) => acc + x.units, 0);
    
    for (grp of IMMUNE_SYS) {
        grp.atk += boost;
    }
    
    // console.log(`Boosting atk by ${boost}...`);
    [immuneLeft, infectionLeft] = runSimulation();
    
    if (infectionLeft === 0) {
        // console.log(immuneLeft, infectionLeft);
        break;
    }

    boost++;
}

console.log(`Part 2: ${immuneLeft}`);

// Functions

function runSimulation() {
    let ImmuneLeft = IMMUNE_SYS.length;
    let InfectionLeft = INFECTION.length;

    while (ImmuneLeft > 0 && InfectionLeft > 0) {
        // target phase
        const sortByPower = (grp) => {
            return grp.concat().sort((a, b) => {
                if (calculatePower(b) === calculatePower(a)) {
                    return b.initiative - a.initiative;
                }
                return calculatePower(a) < calculatePower(b) ? 1 : -1;
            });
        }
        
        for (grp of sortByPower(IMMUNE_SYS)) {
            if (grp.units > 0)
                chooseTarget(TEAM_IMMUNE_SYS, grp, INFECTION);
        }
        
        for (grp of sortByPower(INFECTION)) {
            if (grp.units > 0)
                chooseTarget(TEAM_INFECTION, grp, IMMUNE_SYS);
        }

        // attack phase
        const initiatives = [
            ...IMMUNE_SYS.filter(x => x.units > 0)
            .map(x => x.initiative),
            ...INFECTION.filter(x => x.units > 0)
            .map(x => x.initiative)
        ].sort((a, b) => b - a);

        let totalKills = 0;

        for (const init of initiatives) {
            let attacker = IMMUNE_SYS.find(x => x.initiative === init);
            let team = (attacker !== undefined) ? TEAM_IMMUNE_SYS : TEAM_INFECTION;
            
            if (team === TEAM_INFECTION)
                attacker = INFECTION.find(x => x.initiative === init);

            if (attacker.targetIndex === null)
                continue;

            const defender = (team === TEAM_IMMUNE_SYS) ?
                                INFECTION[attacker.targetIndex] :
                                IMMUNE_SYS[attacker.targetIndex];

            const damage = calculateDamage(attacker, defender);
            
            const deaths = Math.min(Math.floor(damage / defender.hp), defender.units);
            defender.units -= deaths;
            totalKills += deaths;

            attacker.targetIndex = null;
            defender.targeted = false;
        }

        ImmuneLeft = IMMUNE_SYS.filter(x => x.units > 0).reduce((acc, x) => acc + x.units, 0);
        InfectionLeft = INFECTION.filter(x => x.units > 0).reduce((acc, x) => acc + x.units, 0);

        // If no group has suffered any deaths, break out to avoid infinite loop.
        if (totalKills === 0) {
            // console.log('Stalemate, skipping...');
            return [ImmuneLeft, InfectionLeft];
        }
    }

    return [ImmuneLeft, InfectionLeft];
}

function parseInput(input) {
    const regexInfection = /Infection:/;
    let team = TEAM_IMMUNE_SYS;

    const regexGroup = /(\d+) units each with (\d+) hit points (\(.+\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/;
    const regexWeak = /weak to ([\w, ]+)/;
    const regexImmune = /immune to ([\w, ]+)/;

    input.forEach(line => {
        if (line.match(regexInfection))
            team = TEAM_INFECTION;

        if (match = line.match(regexGroup)) {
            let [units, hp, resists, atk, type, initiative] = match.slice(1);
            [units, hp, atk, initiative] = [units, hp, atk, initiative].map(x => +x);
            let weaknesses = ((resists || '').match(regexWeak) || []).slice(1);
            let immunities = ((resists || '').match(regexImmune) || []).slice(1);
            if (weaknesses.length > 0) { weaknesses = [...weaknesses[0].split(', ')]; }
            if (immunities.length > 0) { immunities = [...immunities[0].split(', ')]; }
            
            if (team === TEAM_IMMUNE_SYS) {
                IMMUNE_SYS.push(new group(
                    units, hp, atk, type, initiative, weaknesses, immunities
                    ))
            } else {
                INFECTION.push(new group(
                    units, hp, atk, type, initiative, weaknesses, immunities
                    ))
            }
        }
    });
}

function chooseTarget(team, attacker, defenders) {
    let maxDamage = -1;
    let currentTarget = null;

    for (const defender of defenders) {
        if (defender.units !== 0 && defender.targeted === false) {
            const damage = calculateDamage(attacker, defender);
            if (damage > maxDamage && damage > 0) {
                maxDamage = damage;
                currentTarget = defender;
            } else if (damage === maxDamage) {
                const defenderPower = calculatePower(defender);
                const currentTargetPower = calculatePower(currentTarget);
                if (defenderPower > currentTargetPower) {
                    currentTarget = defender;
                } else if (defenderPower === currentTargetPower) {
                    const defenderInitiative = defender.initiative;
                    const currentTargetInitiative = currentTarget.initiative;
                    if (defenderInitiative > currentTargetInitiative) {
                        currentTarget = defender;
                    }
                }
            }
        }
    }

    if (currentTarget !== null) {
        attacker.targetIndex = (team === TEAM_IMMUNE_SYS) ?
                                INFECTION.findIndex(x => x === currentTarget) :
                                IMMUNE_SYS.findIndex(x => x === currentTarget);
        
        currentTarget.targeted = true;
    }
}

function calculatePower(grp) {
    return grp.units * grp.atk;
}

function calculateDamage(attacker, defender) {
    if (defender.immunities.includes(attacker.type)) {
        return 0;
    } else if (defender.weaknesses.includes(attacker.type)) {
        return 2 * calculatePower(attacker);
    } else {
        return calculatePower(attacker);
    }
}