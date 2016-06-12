/**
 * Created by alexs_000 on 12.06.2016.
 */
const redisHelper = require('../utils/redisHelper');
const config = require('./auth.json');
const _ = require('lodash');
const loopback = require('loopback');

const access_key = "x-access";

module.exports = (app) => {
    return (req, res, next) => {
        if (config.public.indexOf(req.path) !== -1) {
            return next();
        }
        var hash = req.cookies[access_key];

        redisHelper.get(hash, (err, user) => {
            if (!user) {
                return next(new Error("Not authorized"));
            }
            var ctx = loopback.getCurrentContext();
            ctx.set(user);
            next();
        });
    }
};