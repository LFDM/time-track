var _ = require('lodash'),
    moment = require('moment'),
    Time = require('./time');

var DELIMITER = '----------------------------';

function Week(number, year) {
    var self = this;

    this.number = number;
    this.year   = year;
    this.days = [];

    this.addDay = addDay;
    this.printSummary = printSummary;

    function addDay(record) {
        self.days.push(new Day(record));
    }

    function printSummary() {
        var parts = [
            '',
            DELIMITER,
            'WEEK ' + self.year + '/' + _.padLeft(self.number, 2, ' ') + '\t' + weeklyTotal(),
            DELIMITER,
            daysToString(),
            DELIMITER,
        ];

        console.log(parts.join('\n'));
    }

    function weeklyTotal() {
        var total = _.inject(self.days, function(memo, day) {
            memo += day.record.total;
            return memo;
        }, 0);
        return new Time(total).toString();
    }

    function daysToString() {
        return _.map(self.days, function(day) {
            return day.toString();
        }).join('\n');
    }
}

function Day(record) {
    this.record = record;
    this.toString = toString;

    function toString() {
        return record.date + '\t' + new Time(record.total).toString()
    }
}

function TerminalOutputter() {
    this.output = output;

    function output(records) {
        var totalTime = 0;
        var weeks = {};

        _.forEach(records, addRecord);

        outputWeeklies();
        console.log('');
        outputTotal();

        function addRecord(record) {
            totalTime += record.total;

            var mom = moment(record.date);
            var number = mom.week();
            var week = weeks[number];
            if (!week) {
                weeks[number] = week = new Week(number, mom.year());
            }
            week.addDay(record);
        }

        function outputWeeklies() {
            _.forEach(weeks, function(week) {
                week.printSummary();
            });
        }

        function outputTotal() {
            console.log(DELIMITER);
            console.log('Total:\t' + new Time(totalTime).toString());

        }
    }
}

module.exports = TerminalOutputter;
