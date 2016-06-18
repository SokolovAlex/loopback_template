var role = {
    id: 1,
    title: "admin"
};

module.exports = function(app) {
    var ds = app.datasources['db'];

    const update_db = () => {
        ds.autoupdate();
        app.models.Role.updateOrCreate([role]);
    };

    if(ds.connected) {
        update_db();
    } else {
        ds.once('connected', update_db);
    }

};