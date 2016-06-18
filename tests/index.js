/**
 * Created by alexs_000 on 15.06.2016.
 */
const localStorageTests = require('./localStorage_tests');
const Jasmine = require('jasmine');

var jasmine = new Jasmine();

//var jasmineEnv = jasmine.getEnv();
//jasmineEnv.specFilter = (spec) => {
//    console.log(spec);
//};
//
//var jasmineEnv = jasmine.getEnv();
//var htmlReporter = new jasmine.HtmlReporter();
//jasmineEnv.addReporter(htmlReporter);
//jasmineEnv.specFilter = function(spec) {
//    return htmlReporter.specFilter(spec);
//};
//
//window.onload = () => {
//    jasmineEnv.execute();
//};


jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
        'appSpec.js',
        'requests/**/*[sS]pec.js',
        'utils/**/*[sS]pec.js'
    ],
    helpers: [
        'helpers/**/*.js'
    ]
});

jasmine.configureDefaultReporter({
    onComplete: function(passed) {
        if(passed) {
            exit(0);
        }
        else {
            exit(1);
        }
    },
    timer: new this.jasmine.Timer(),
    print: function() {
        process.stdout.write(util.format.apply(this, arguments));
    },
    showColors: true,
    jasmineCorePath: this.jasmineCorePath
});

localStorageTests();

jasmine.execute();