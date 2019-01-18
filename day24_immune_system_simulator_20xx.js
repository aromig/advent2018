// Advent of Code 2018 - Day 24: Immune System Simulator 20XX
// https://adventofcode.com/2018/day/24

const file = require('./file');
const input = file.read('day24').split(/\n/);

/* const input = `Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4`.split(/\n/); */


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
let IMMUNE_SYS = [];
let INFECTION = [];

parseInput(input);

let ImmuneLeft = IMMUNE_SYS.length;
let InfectionLeft = INFECTION.length;

while (ImmuneLeft > 0 && InfectionLeft > 0) {
    // target phase
    const sortByPower = (grp) => {
        return grp.concat().sort((a, b) => {
            if (calcPower(b) === calcPower(a)) {
                return b.initiative - a.initiative;
            }
            return calcPower(a) < calcPower(b) ? 1 : -1;
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

        const damage = calcDamage(attacker, defender);
        
        const deaths = Math.min(Math.floor(damage / defender.hp), defender.units);
        defender.units -= deaths;
        
        let attackerIndex = (team === TEAM_IMMUNE_SYS) ?
            IMMUNE_SYS.findIndex(x => x === attacker) :
            INFECTION.findIndex(x => x === attacker);

        attacker.targetIndex = null;
        defender.targeted = false;
    }

    ImmuneLeft = IMMUNE_SYS.filter(x => x.units > 0).reduce((acc, x) => acc + x.units, 0);
    InfectionLeft = INFECTION.filter(x => x.units > 0).reduce((acc, x) => acc + x.units, 0);
}

const winningArmy = ImmuneLeft > 0 ?
                    IMMUNE_SYS.reduce((acc, x) => acc + x.units, 0) :
                    INFECTION.reduce((acc, x) => acc + x.units, 0);

console.log(`Part 1: ${winningArmy}`);

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
            if (weaknesses.length > 0) {
                weaknesses = [...weaknesses[0].split(', ')];
            }
            if (immunities.length > 0) {
                immunities = [...immunities[0].split(', ')];
            }
            
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
            const damage = calcDamage(attacker, defender);
            if (damage > maxDamage) {
                maxDamage = damage;
                currentTarget = defender;
            } else if (damage === maxDamage) {
                const defenderPower = calcPower(defender);
                const currentTargetPower = calcPower(currentTarget);
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

function calcPower(grp) {
    return grp.units * grp.atk;
}

function calcDamage(attacker, defender) {
    if (defender.immunities.includes(attacker.type)) {
        return 0;
    } else if (defender.weaknesses.includes(attacker.type)) {
        return 2 * calcPower(attacker);
    } else {
        return calcPower(attacker);
    }
}