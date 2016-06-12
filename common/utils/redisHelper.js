//https://habrahabr.ru/sandbox/27636/

const redis = require('redis'),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error: " + err);
});

const save = (token, user, next) => {
    client.set(token, JSON.stringify(user), function (err, repl) {
        if (next) {
            next(err, repl);
        }
    });
};

const get = (token, next) => {
    client.get(token, function (err, repl) {
        if (err || !repl) return next(true);
        next(null, JSON.parse(repl));
    });
};

const exists = (token, next) => {
    client.get(token, next);
};

const remove = (token, next) => {
    client.del(token, next);
};

const redisInstane = {
    save: save,
    remove: remove,
    get: get,
    exists: exists
};

module.exports = redisInstane;
