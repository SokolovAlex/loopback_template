module.exports = function(app) {
    var ds = app.datasources['db'];
    if(ds.connected) {
        ds.autoupdate();
    } else {
        ds.once('connected', function() {
            ds.autoupdate();
        });
    }
};