/**
 * Created by alexs_000 on 15.06.2016.
 */
module.exports = function(app) {
    var router = app.loopback.Router();
    router.get('/tests', function(req, res) {
        res.sendFile(__dirname + '/client/tests/index.html');
    });
    app.use(router);
};