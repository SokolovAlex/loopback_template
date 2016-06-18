/**
 * Created by alexs_000 on 15.06.2016.
 */
const storage = require('../common/localStorage/storage.js');
const Jasmine = require('jasmine');

var jasmine = new Jasmine();

module.exports = () => {

    describe("local storage", () => {
        it("clear storage", () => {

            storage.clear(() => {


                storage.all((err, data) => {


                    console.log("!@@", data);

                });


            });


        });
    });

};
