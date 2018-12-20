// Advent of Code 2018 - Day 13: Mine Cart Madness
// https://adventofcode.com/2018/day/13

const file = require('./file');
const input = file.read('day13').split(/\n/);

/*
    cart = { x, y, dir, turn }
    dir: LEFT, RIGHT, UP, DOWN
    turn: CCW, STR, CW (Counter-clockwise, Straight, Clockwise)
*/

let [tracks, carts] = init(input);
showTracks(tracks);
console.log('Carts:\n', carts, '\n');

do {
    carts.forEach(cart => {
        cart = move(cart, tracks);
        let [x, y] = checkForCollision(carts);
        if (x > -1) {
            console.log(`Crash detected @ ${x},${y}!`);
            carts = carts.filter(cart => cart.x !== x || cart.y !== y);
        }
    });

    if (carts.length === 1) {
        console.log(`Last cart remaining @ ${carts[0].x},${carts[0].y}`);
        break;
    } else if (carts.length === 0) {
        console.log(`No carts left!`);
        break;
    }

    // Need to sort after each tick so cart order is top to bottom, left to right
    carts.sort((a, b) => (a.y !== b.y) ? a.y - b.y : a.x - b.x);
} while (true);

// Functions

function init(data) {
    const width = data[0].length;
    const height = data.length;
    console.log(`Track area is ${width} x ${height}`);

    let tracks = [];
    let carts = [];
    for (let i = 0; i < height; i++)
        tracks[i] = [];

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            switch (data[i][j]) {
                case '<':
                case '>':
                    tracks[i][j] = '-';
                    cart = (data[i][j] === '<') ?
                        { x: j, y: i, dir: 'LEFT', turn: 'CCW' } :
                        { x: j, y: i, dir: 'RIGHT', turn: 'CCW' }
                    carts.push(cart);
                    break;
                case '^':
                case 'v':
                    tracks[i][j] = '|';
                    cart = (data[i][j] === '^') ?
                        { x: j, y: i, dir: 'UP', turn: 'CCW' } :
                        { x: j, y: i, dir: 'DOWN', turn: 'CCW' }
                    carts.push(cart);
                    break;
                default:
                    tracks[i][j] = data[i][j];
                    break;
            }
        }
    }
    return [tracks, carts];
}

function showTracks(tracks) {
    for (let i = 0; i < tracks.length; i++)
        console.log(tracks[i].join(''));
}

function move(cart, tracks) {
    const nextTurns = ['CCW', 'STR', 'CW'];
    let nextTrack;
    let [x, y] = [cart.x, cart.y];

    switch (cart.dir) {
        case 'UP':
            cart.y--;
            nextTrack = tracks[y - 1][x];
            if (nextTrack === '/') {
                cart.dir = 'RIGHT';
            } else if (nextTrack === '\\') {
                cart.dir = 'LEFT';
            } else if (nextTrack === '+') {
                cart.dir = (cart.turn === 'CCW') ? 'LEFT' :
                           (cart.turn === 'CW')  ? 'RIGHT' :
                           cart.dir;
                cart.turn = nextTurns[ (nextTurns.indexOf(cart.turn) + 1) % 3 ];
            } else if (nextTrack === '-') {
                throw new Error(`Cart @ ${cart.x},${cart.y} going ${cart.dir} hit a wall! How in the world?`);
            }
            break;
        case 'DOWN':
            cart.y++;
            nextTrack = tracks[y + 1][x];
            if (nextTrack === '/') {
                cart.dir = 'LEFT';
            } else if (nextTrack === '\\') {
                cart.dir = 'RIGHT';
            } else if (nextTrack === '+') {
                cart.dir = (cart.turn === 'CCW') ? 'RIGHT' :
                           (cart.turn === 'CW') ? 'LEFT' :
                           cart.dir;
                cart.turn = nextTurns[(nextTurns.indexOf(cart.turn) + 1) % 3];
            } else if (nextTrack === '-') {
                throw new Error(`Cart @ ${cart.x},${cart.y} going ${cart.dir} hit a wall! How in the world?`);
            }
            break;
        case 'LEFT':
            cart.x--;
            nextTrack = tracks[y][x - 1];
            if (nextTrack === '/') {
                cart.dir = 'DOWN';
            } else if (nextTrack === '\\') {
                cart.dir = 'UP';
            } else if (nextTrack === '+') {
                cart.dir = (cart.turn === 'CCW') ? 'DOWN' :
                           (cart.turn === 'CW') ? 'UP' :
                           cart.dir;
                cart.turn = nextTurns[(nextTurns.indexOf(cart.turn) + 1) % 3];
            } else if (nextTrack === '|') {
                throw new Error(`Cart @ ${cart.x},${cart.y} going ${cart.dir} hit a wall! How in the world?`);
            }
            break;
        case 'RIGHT':
            cart.x++;
            nextTrack = tracks[y][x + 1];
            if (nextTrack === '/') {
                cart.dir = 'UP';
            } else if (nextTrack === '\\') {
                cart.dir = 'DOWN';
            } else if (nextTrack === '+') {
                cart.dir = (cart.turn === 'CCW') ? 'UP' :
                           (cart.turn === 'CW') ? 'DOWN' :
                           cart.dir;
                cart.turn = nextTurns[(nextTurns.indexOf(cart.turn) + 1) % 3];
            } else if (nextTrack === '|') {
                throw new Error(`Cart @ ${cart.x},${cart.y} going ${cart.dir} hit a wall! How in the world?`);
            }
            break;
    }

    return cart;
}

function checkForCollision(carts) {
    let x = -1;
    let y = -1;

    for (let i = carts.length - 1; i >= 0; i--) {
        let currentCart = carts[i];
        // find a cart that matches currentCart's coords
        let idx = carts.findIndex(cart => cart.x === currentCart.x && cart.y === currentCart.y);
        // if cart is a different one, we have a collision
        if (idx !== i)
            return [currentCart.x, currentCart.y];
    }
    return [x, y];
}