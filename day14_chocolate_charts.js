// Advent of Code 2018 - Day 14: Chocolate Charts
// https://adventofcode.com/2018/day/14

const file = require('./file');
const input = file.read('day14');

let recipes = [3, 7];
const num = +input;
const targetNumRecipes = num + 10;
let scores = null;
let recipesLeftOfInput = -1;

let elf1 = 0;
let elf2 = 1;

while (!scores || recipesLeftOfInput < 0) {
    let new_recipes = (recipes[elf1] + recipes[elf2]).toString().split('').map(x => +x);
    recipes.push(...new_recipes);

    elf1 = (elf1 + 1 + recipes[elf1]) % recipes.length;
    elf2 = (elf2 + 1 + recipes[elf2]) % recipes.length;

    if (!scores && recipes.length >= targetNumRecipes) {
        scores = recipes.slice(num, num + 10).join('');
    }

    if (recipesLeftOfInput < 0) {
        let offset = recipes.length - new_recipes.length - input.length;
        let subset = recipes.slice(offset, recipes.length).join('');
        let idx = subset.indexOf(input);
        if (idx > -1)
            recipesLeftOfInput = idx + offset;
    }
}

console.log(`Part 1: ${scores}`);
console.log(`Part 2: ${recipesLeftOfInput}`);