// Advent of Code 2018 - Day 20: A Regular Map
// https://adventofcode.com/2018/day/20

const file = require('./file');
const input = file.read('day20');

const DIRECTION = {
    N: { x: 0, y: -1, opposite: 'S' },
    E: { x: 1, y:  0, opposite: 'W' },
    S: { x: 0, y:  1, opposite: 'N' },
    W: { x: -1, y: 0, opposite: 'E' }
};

const rooms = createMap(input);
const distances = roomDistances(rooms, rooms[0]);

const largestNumberOfDoors =
    Math.max(
        ...Object.entries(distances)
        .map(([_, { distance } ]) => distance)
    );

const numberOfRoomsWithShortestPath =
    Object.entries(distances)
        .filter(([_, { distance } ]) => distance >= 1000)
        .length;

console.log(`Part 1: ${largestNumberOfDoors}`);
console.log(`Part 2: ${numberOfRoomsWithShortestPath}`);

function createMap(input) {
    const rooms = [ { x: 0, y: 0, doors: new Set() } ];

    const findRooms = (route, room) => {
        let previousRoom = room;
        for (let i = 0; i < route.length; i++) {
            const dir = route[i];
            if (dir === '(') {
                const contents = route.slice(i + 1, indexOfBranchEnd(route, i));
                i += contents.length + 1;
                findRooms(contents, previousRoom);
            } else if (dir === '|') {
                previousRoom = room;
            } else if (dir !== ')') {
                previousRoom.doors.add(dir);
                let { x, y } = previousRoom;
                x += DIRECTION[dir].x;
                y += DIRECTION[dir].y;
                const roomExists = rooms.find(room => room.x === x && rooms.y === y);
                if (roomExists) {
                    roomExists.doors.add(DIRECTION[dir].opposite);
                    previousRoom = roomExists;
                } else {
                    const newRoom = { x, y, doors: new Set() };
                    newRoom.doors.add(DIRECTION[dir].opposite);
                    rooms.push(newRoom);
                    previousRoom = newRoom;
                }
            }
        }
    }

    const reRoutes = /^\^(.*)\$$/;
    const routes = input.match(reRoutes);
    findRooms(routes[1], rooms[0]);

    return rooms;
}

function indexOfBranchEnd(route, index) {
    let nParen = 1;
    for (let i = index + 1; i < route.length; i++) {
        if (route[i] === '(')
            nParen++;
        else if (route[i] === ')')
            if (--nParen === 0)
                return i;
    }
    return -1;
}

function key( { x, y } ) {
    return `${x},${y}`;
}

// Implement a form of Dijkstra's Algorithm
// https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
function roomDistances(rooms, start) {
    const visited = [];
    let unvisited = [];
    const distances = {};

    const getAdjacent = ( { x, y, doors } ) => {
        const adjacent = [];
        for (const door of doors) {
            const door_x = DIRECTION[door].x;
            const door_y = DIRECTION[door].y;
            adjacent.push(rooms.find(r => r.x === x + door_x && r.y === y + door_y));
        }
        return adjacent;
    }
    
    const getDistance = (position) => distances[key(position)] || { distance: Infinity };

    distances[key(start)] = { distance: 0 };

    let current = start;

    while (current) {
        unvisited.push(...getAdjacent(current, rooms)
            .filter(( { x, y } ) => !unvisited.some(n => n.x === x && n.y === y))
            .filter(( { x, y } ) => !visited.some(n => n.x === x && n.y === y))
        );

        unvisited.forEach(position => {
            const distance = getDistance(current).distance + 1;
            if (distance < getDistance(position).distance)
                distances[key(position)] = { distance, previous: current };
        });

        unvisited = unvisited.filter(n => n !== current);
        visited.push(current);
        current = unvisited[0];
    }

    return distances;
}