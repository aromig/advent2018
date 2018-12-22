// Advent of Code 2018 - Day 15: Beverage Bandits
// https://adventofcode.com/2018/day/15

const file = require('./file');
const input = file.read('day15').split(/\n/);

const OPEN = '.';
const ELF = 'E';
const GOBLIN = 'G';
const ATTACK = '3';
const MAX_HP = 200;

let MAP = [];
input.forEach(line => MAP.push(line.split('')));
let gameMap = JSON.parse(JSON.stringify(MAP));

const part1 = playLordOfTheCocoa(gameMap);
console.log(`Part 1: ${part1.outcome}`);
printStats(part1);

let part2 = null;
let elfAttack = ATTACK;
while (!part2) {
    elfAttack++;
    gameMap = JSON.parse(JSON.stringify(MAP));
    part2 = playLordOfTheCocoa(gameMap, elfAttack, true);
}

console.log(`Part 2: ${part2.outcome} (elfAttack = ${elfAttack})`);
printStats(part2);

function playLordOfTheCocoa(map, elfAttack = ATTACK, stopIfElfDies = false) {
    let mobs = init_mobs(map, elfAttack);
    let data = {
        mobs: mobs,
        map: map,
        round: 0,
        outcome: null,
        elfAttack: elfAttack
    };

    round: while (true) {
        mobs = mobs.sort((m1, m2) =>
            m1.pos.y === m2.pos.y ?
            m1.pos.x - m2.pos.x :
            m1.pos.y - m2.pos.y
        );
        for (let i = 0; i < mobs.length; i++) {
            let mob = mobs[i];
            if (mob.alive) {
                // Game over if there's no one left to fight
                if (mobs.filter(m => m.alive && m.race !== mob.race).length < 1) {
                    break round;
                }
                
                let enemy = findEnemy(mob, mobs);
                let next = enemy ? null : findNextSpace(mob, mobs, map);

                if (!enemy && next) {
                    map[mob.pos.y][mob.pos.x] = OPEN;
                    mob.pos.x = next.x;
                    mob.pos.y = next.y;
                    map[mob.pos.y][mob.pos.x] = mob.race;

                    enemy = findEnemy(mob, mobs);
                }

                if (enemy) {
                    enemy.hp -= mob.attack;

                    if (enemy.hp < 1) {
                        enemy.alive = false;
                        map[enemy.pos.y][enemy.pos.x] = OPEN;
                        // An elf died. Restart the game and buff them some more!
                        if (enemy.race === ELF && stopIfElfDies)
                            return null;
                    }
                }
            }
        }

        data.round++;
        
        //clearConsole();
        //printMap(data.map);
        //printStats(data);
    }

    data.outcome = data.round *
                   mobs.filter(m => m.alive)
                       .map(m => m.hp)
                       .reduce((acc, current) => acc+  current, 0);

    //clearConsole();
    //printMap(data.map);
    //printStats(data);

    return data;
}

function init_mobs(map, elfAttack = ATTACK) {
    let mobs = [];
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === ELF || cell === GOBLIN) {
                mobs.push({
                    race: cell,
                    hp: MAX_HP,
                    attack: cell === ELF ? elfAttack : ATTACK,
                    alive: true,
                    pos: {x, y }
                });
            }
        });
    });
    return mobs;
}

function findEnemy(mob, allMobs) {
    return (
        allMobs.filter(m => m.race !== mob.race && m.alive)
               .filter(
                    m => (Math.abs(m.pos.x - mob.pos.x) === 1 && m.pos.y === mob.pos.y)
                            ||
                         (Math.abs(m.pos.y - mob.pos.y) === 1 && m.pos.x === mob.pos.x)
               )
               .reduce((weakest, current) =>
                    weakest === null || weakest.hp > current.hp ? current : weakest, null)
        );
}

function findNextSpace(mob, allMobs, map) {
    let targets = {};
    allMobs.filter(m => m.alive && m.race !== mob.race)
           .map(m => findAdjacentSpaces(m.pos)
                .filter(pos => map[pos.y][pos.x] === OPEN))
                .reduce((acc, list) => acc.concat(...list), [])
                .forEach(pos => (targets[`${pos.x},${pos.y}`] = pos)
            );
    
    let visited = {};
    visited[`${mob.pos.x},${mob.pos.y}`] = true;

    let paths = [[mob.pos]];

    while (true) {
        let newPaths = [];
        let targetPaths = [];
        paths.forEach(path => {
            let adjacentSpaces = findAdjacentSpaces(path[path.length - 1]);
            adjacentSpaces.forEach(space => {
                let coord = `${space.x},${space.y}`;
                if (targets[coord]) {
                    targetPaths.push([...path, space, targets[coord]]);
                } else if (!visited[coord] && map[space.y][space.x] === OPEN) {
                    newPaths.push([...path, space]);
                }
                visited[coord] = true;
            });
        });

        if (targetPaths.length > 0) {
            targetPaths = targetPaths.sort((p1, p2) =>
                p1[p1.length - 1].y === p2[p2.length - 1].y ?
                    p1[p1.length - 1].x - p2[p2.length - 1].x :
                    p1[p1.length - 1].y - p2[p2.length - 1].y
            );

            return targetPaths[0][1];
        }

        paths = newPaths;

        if (paths.length < 1)
            return null;
    }
}

function findAdjacentSpaces(pos) {
    return [
        { x: pos.x,     y:pos.y - 1 },
        { x: pos.x - 1, y: pos.y },
        { x: pos.x + 1, y: pos.y },
        { x: pos.x,     y: pos.y + 1 }
    ];
}

function printMap(map) {
    console.log(map.map(x => x.join('')).join('\n'));
}

function clearConsole() {
    process.stdout.write('\x1Bc');
}

function printMobs(mobs, isAlive) {
    mobs.filter(m => !isAlive || m.alive)
        .forEach(m => console.log(`${m.race} @ ${m.pos.x},${m.pos.y} with ${m.hp} HP`));
}

function printStats(data) {
    console.log();
    console.log(`Round ${data.round}`);
    printMobs(data.mobs, true);
    console.log();
}