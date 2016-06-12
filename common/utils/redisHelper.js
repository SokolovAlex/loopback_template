//https://habrahabr.ru/sandbox/27636/

const redis = require('redis'),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error: " + err);
});

const save = (token, user, next) => {
    client.set(token, JSON.stringify(user), function (err, repl) {
        client.quit();
        if (next) {
            next(err, repl);
        }
    });
};

const get = (token, next) => {
    client.get(token, function (err, repl) {
        client.quit();
        next(err, repl);
    });
};

const exists = (token, next) => {
    client.get(token, (err, res) => {
        client.quit();
        next(err, res);
    });
};

const remove = (token, next) => {
    client.del(token, (err, res) => {
        client.quit();
        next(err, res);
    });
};

const redisInstane = {
    save: save,
    remove: remove,
    get: get,
    exists: exists
};

module.exports = redisInstane;
