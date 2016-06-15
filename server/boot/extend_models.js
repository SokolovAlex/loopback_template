/**
 * Extend each model with additional information fields
 * @param app
 */
module.exports = (app) => {
    /**
     * Auto update modified and created fields for each model in the system
     */
    for (var modelName in app.models) {
        app.models[modelName].observe('before save', (ctx, next) => {
            if (ctx.instance) {
                if (!ctx.instance.created) {
                    ctx.instance.created = new Date();
                }
                ctx.instance.modified = new Date();
            } else {
                ctx.data.modified = new Date();
            }

            
            next();
        });
    }


};