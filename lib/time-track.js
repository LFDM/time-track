var fs   = require('fs'),
    path = require('path'),
    moment = require('moment'),
    Record = require('./record');

var DATA_PATH = path.join(__dirname, '..', 'data');

function TimeTrack() {
    var date = getDate();
    var filePath = path.join(DATA_PATH, date + '.json');

    this.start = start;
    this.stop = stop;
    this.show = show;

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

            var json = JSON.parse(data);
            cb(new Record(json.date, json.spans));
        })
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

        return now.format('YYYY-MM-DD')
    }

}

module.exports = TimeTrack;
