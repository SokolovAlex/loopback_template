const fs = require('fs'),
    _ = require('lodash');

const outputFilename = "common/localStorage/storage.json";

const save = (user) => {
    all((err, data) => {
        data = JSON.parse(data);
        data.push(user);
        fs.writeFile(outputFilename, JSON.stringify(data), function(err) {
            if(err) {
                return console.log(err);
            }
        });
    });
};

const all = (next) => {
    fs.readFile(outputFilename, 'utf8', next);
};

const exists = (token, next) => {

};

const clear = () => {
    fs.writeFile(outputFilename, JSON.stringify([]), _.noop);
};

var storage = {
    all: all,
    save: save,
    clear: clear,
    exists: exists
};

module.exports = storage;
/**
 * Created by sokolov on 10.06.2016.
 */
