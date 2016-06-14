/**
 * Created by sokolov on 10.06.2016.
 */
const fs = require('fs'),
    _ = require('lodash');

const outputFilename = "common/localStorage/storage.json";

const save = (user) => {
    all((err, data) => {
        data = JSON.parse(data);
        data[user.hash] = user;
        fs.writeFile(outputFilename, JSON.stringify(data), (err) => {
            if(err) {
                return console.log(err);
            }
        });
    });
};

const all = (next) => {
    fs.readFile(outputFilename, 'utf8', next);
};

const get = (token, next) => {
    all((err, data) => {
        data = JSON.parse(data);
        return next(err, data[token]);
    });
};

const exists = (token, next) => {
    get(token, () => {
        next(err, !!user);
    });
};

const remove = (token, next) => {
    all((err, data) => {
        data = JSON.parse(data);
        delete data[token];
        fs.writeFile(outputFilename, JSON.stringify(data), (err) => {
            if(err) {
                return console.log(err);
            }
            next(err);
        });
    });
};

const clear = () => {
    fs.writeFile(outputFilename, JSON.stringify({}), _.noop);
};

var storage = {
    all: all,
    save: save,
    remove: remove,
    clear: clear,
    exists: exists,
    get: get
};

module.exports = storage;
