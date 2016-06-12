const app = require('../../server/server'),
    storage = require('../localStorage/storage'),
    redisHelper = require('../utils/redisHelper'),
    _ = require("lodash"),
    crypter = require('../utils/crypter');

const access_key = "x-access";

module.exports = function(user) {
    user.registration = (data, req, res, next) => {
        if (!data.email) {
            return next(new Error('email required'));
        }

        if (!data.password) {
            return next(new Error('password required'));
        }

        app.models.User.findOne({ where: { email: data.email}}, function(err, account) {
            if (err) return next(err);

            if (account) {
                return next(new Error('email exists'));
            }

            var salt = crypter.salt();

            data.password = crypter.sha(data.password, salt);
            data.hash = crypter.md5(data.email);
            data.salt = salt;

            app.models.User.create(data, (err, res) => {
                if (err) return next(new Error());
                storage.save(res);
                next(null, res);
            });
        });
    };
    user.remoteMethod('registration', {
        accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }, { arg: 'req', type: 'object', http: { source: 'req' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        returns: { arg: 'user', type: 'object' },
        http: {
            verb: 'post'
        }
    });

    user.afterRemote('create', function(context, userInstance, next) {
        console.log('> user.afterRemote triggered');
        next();
    });
    user.beforeRemote('create', function(context, userInstance, next) {
        console.log('> user.beforeRemote triggered');
        var data = context.req.body;

        if (!data.email) {
            return next(new Error('email required'));
        }

        app.models.Account.findOne({ where: { email: data.email}}, function(err, account) {
            if (err) return next(err);

            if (account) {
                return next(new Error('email exists'));
            }

            var salt = crypter.salt();

            data.password = crypter.salt(data.password, salt);
            data.hash = crypter.md5(data.email);
            data.salt = salt;
            next();
        });
    });

    user.remoteMethod('login', {
        accepts: [{arg: 'email', type: 'string', required: true}, {arg: 'password', type: 'string', required: true}, { arg: 'req', type: 'object', http: { source: 'req' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        returns: { arg: 'token', type: 'object' },
        http: {
            verb: 'post'
        }
    });
    user.login = (email, password, req, res, next) => {
        app.models.User.findOne({ where: { email: email}}, function(err, user) {
            if (err) return next(err);
            crypter.compare(password, user.password, user.salt, (err, result) => {
                if (result) {
                    redisHelper.save(user.hash, user);
                    res.cookie(access_key, user.hash, {
                        maxAge: 1000 * 3600
                    });
                    next(null, user.hash);
                }

                setTimeout( () => {
                    redisHelper.get(user.hash, _.noop);
                }, 6000);
            });
        });
    };

    user.remoteMethod('logout', {
        accepts: [{ arg: 'req', type: 'object', http: { source: 'req' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        returns: { arg: 'token', type: 'object' },
        http: {
            verb: 'post'
        }
    });
    user.logout = (req, res, next) => {
        var hash = req.cookies[access_key];
        if(!hash) {
            return next(new Error('noone login'));
        }
        redisHelper.remove(hash, () => {
            console.log('logout user:', hash);
            res.cookie(access_key, null);
            next();
        });
    };

    user.disableRemoteMethod("updateAll", true);
    user.disableRemoteMethod("updateAttributes", false);
    user.disableRemoteMethod("confirm", true);
    user.disableRemoteMethod("count", true);
    user.disableRemoteMethod("exists", true);
    user.disableRemoteMethod("resetPassword", true);
    user.disableRemoteMethod('createChangeStream', true);
};
