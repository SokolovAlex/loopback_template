const app = require('../../server/server'),
    storage = require('../localStorage/storage'),
    crypter = require('../utils/crypter');

module.exports = function(user) {
    user.logout = (req, res, next) => {
        next();
    };

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

            data.password = crypter.salt(data.password, salt);
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

    user.logout = (req, res, next) => {
        next();
    };

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

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(data.password, salt, function(err, hash) {
                    data.password = hash;
                    data.salt = salt;
                    data.hash = crypto.createHmac('sha256', salt)
                        .update(data.email)
                        .digest('hex');
                    next();
                });
            });

        });
    });

    user.remoteMethod('login', {
        accepts: [{arg: 'email', type: 'string', required: true}, {arg: 'password', type: 'string', required: true}, { arg: 'req', type: 'object', http: { source: 'req' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        returns: { arg: 'token', type: 'object' },
        http: {
            verb: 'get'
        }
    });

    user.login = (email, password, req, res, next) => {
        app.models.Account.findOne({ where: { email: email}}, function(err, user) {
            if (err) return next(err);
            bcrypt.compare(password, user.password, function(err, result) {
                // var token = new AccessToken({id: user.hash});

                app.models.AccessToken.findById(user.id, function(err, account) {

                    console.log("");
                });

                next(result);
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

    user.disableRemoteMethod("updateAll", true);
    user.disableRemoteMethod("updateAttributes", false);
    user.disableRemoteMethod("confirm", true);
    user.disableRemoteMethod("count", true);
    user.disableRemoteMethod("exists", true);
    user.disableRemoteMethod("resetPassword", true);
    user.disableRemoteMethod('createChangeStream', true);
};
