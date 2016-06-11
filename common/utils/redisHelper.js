var redis = require('redis'),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error: " + err);
});

const save = (token, user) => {
    client.set('token', user, function (err, repl) {
        if (err) {
            console.log('Smth wrong: ' + err);
            return client.quit();
        }
    });
};

const getUser = (token, next) => {
    client.get(token, function (err, repl) {
        client.quit();

        if (err) {
            console.log('Что то случилось при чтении: ' + err);
        } else if (repl) {
            // Ключ найден
            console.log('Ключ: ' + repl);
        } else {
            // Ключ ненайден
            console.log('Ключ не найден.')

        };

        next(err, repl);
    });
};

const exists = (token, next) => {
    client.get(token, next);
};

let redis = {
    save: save,
    getUser: getUser,
    exists: exists
};

module.exports = redis;
