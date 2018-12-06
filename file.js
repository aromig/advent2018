function read(file) {
    const fs = require('fs');
    const textFile = `./inputs/${file}.txt`;
    return fs.readFileSync(textFile, 'utf8');
}

module.exports = {
    read: read
};