var fs   = require('fs'),
    path = require('path'),
    _    = require('lodash'),
    moment = require('moment'),
    Record = require('./record');

var DATA_PATH = path.join(__dirname, '..', 'data');
var DAILY_PATH = path.join(DATA_PATH, 'daily');

function TimeTrack(exporter) {
    var date = getDate();
    var filePath = path.join(DAILY_PATH, date + '.json');

    this.setup = setup;

    this.start = start;
    this.stop = stop;
    this.show = show;

    function setup() {
        fs.mkdir(DATA_PATH, function() {
            fs.mkdir(DAILY_PATH);
        })
    }

    function start() {
        update(function(record) {
            record.start();
            record.printStatus();
        })

    }

    function stop() {
        update(function(record) {
            record.stop();
            record.printStatus();
        })
    }

    function show() {
        fs.readdir(DAILY_PATH, function(err, files) {
            var total = files.length;
            var records = []
            _.forEach(files, function(file) {
                var p = path.join(DAILY_PATH, file);
                fs.readFile(p, 'utf8', function(err, data) {
                    records.push(fileToRecord(data));
                    tryToShow(records, total);
                })
            })
        })

    }

    function tryToShow(records, total) {
        if (records.length !== total) {
            return;
        }
        records = _.sortBy(records, function(record) {
            return record.date;
        })

        exporter.output(records);
    }

    function update(fn) {
        readFile(function(record) {
            fn(record);
            writeFile(record);
        })
    }

    function readFile(cb) {
        fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) {
                cb(new Record(date));
                return;
            }
            cb(fileToRecord(data));
        })
    }

    function fileToRecord(data) {
        var json = JSON.parse(data);
        return new Record(json.date, json.spans);
    }

    function writeFile(record) {
        var json = JSON.stringify(record, null, 2);
        fs.writeFile(filePath, json, function(err, data) {
            if (err) {
                console.log('Failed to write ' + filePath);
            }
        });
    }

    function getDate() {
        var now = moment();

        // Before 5am, it counts against the day before
        if (now.hour() < 5) {
            now = now.subtract('1', 'day');
        }

        return now.format('YYYY-MM-DD');
    }

}

module.exports = TimeTrack;
