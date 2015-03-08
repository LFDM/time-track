#! /usr/bin/env node

'use strict';

var _    = require('lodash'),
    fs   = require('fs'),
    path = require('path'),
    moment = require('moment');

var DATA_PATH = path.join(__dirname, '..', 'data');

function Span(beginning, end, time) {
    var self = this;

    this.beginning = beginning;
    this.end = end;
    this.time = time;

    this.start = start;
    this.stop  = stop;

    this.isRunning = isRunning;

    function isRunning() {
        return self.beginning && !self.end;
    }

    this.toJSON = toJSON;

    function start() {
        self.beginning = Date.now();
    }

    function stop() {
        self.end = Date.now();
        self.time = self.end - self.beginning;
    }

    function toJSON() {
        return {
            start: self.beginning,
            stop: self.end,
            time: self.time
        }
    }
}

function Record(date, spans) {
    var current;
    var self = this;

    this.date = date;
    this.spans = _.map(spans || [], function(span) {
        return new Span(span.start, span.stop, span.time);
    });

    this.start = start;
    this.stop  = stop ;
    this.total = 0;

    this.printStatus = printStatus;
    this.toJSON = toJSON;

    current = _.last(this.spans);
    updateTotal()

    function start() {
        if (current && current.isRunning()) {
            self.stop();
        }

        current = new Span();
        self.spans.push(current);
        current.start();
    }

    function stop() {
        if (current) {
            current.stop();
            updateTotal();
        }
    }

    function updateTotal() {
        self.total = _.inject(self.spans, function(total, span) {
            if (!span.isRunning()) {
                total += span.time;
            }
            return total;
        }, 0);
    }

    function printStatus() {
        var time = new Time(self.total);
        console.log([
            'So far you\'ve been working',
            time.toString(),
            'today.',
            getSuggestion(time.hours)
        ].join(' '));
    }

    function getSuggestion(hours) {
        if (hours > 8) {
            return 'Time to stop soon, huh?';
        } else {
            return '';
        }
    }

    function toJSON() {
        return {
            date: self.date,
            spans: _.map(self.spans, function(span) {
                return span.toJSON();
            }),
            total: self.total
        }
    }
}

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

function Time(milliseconds) {
    var self = this;

    this.hours = Math.floor(milliseconds / 36e5);
    this.minutes = Math.floor((milliseconds % 36e5) / 6e4);
    this.seconds = Math.floor((milliseconds % 6e4) / 1000);

    this.toString = toString;

    function toString() {
        return [
            self.hours + 'h',
            self.minutes + 'm',
            self.seconds + 's'
        ].join(' ');
    }
}


var tt = new TimeTrack()

var command = parseCommand(process.argv[2]);

tt[command]();

function parseCommand(arg) {
    if (!arg || !arg.match(/(start|stop|show)/) ) {
        console.log('Needs to be called with either start, stop or show as command');
        process.exit();
    }
    return arg;
}
