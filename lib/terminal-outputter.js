var _ = require('lodash'),
    Time = require('./time');

function TerminalOutputter() {
    this.output = output;

    function output(records) {
        var totalTime = 0;
        var stats = [];
        _.forEach(records, function(record) {
            totalTime += record.total;
            stats.push(record.date + '\t' + new Time(record.total).toString());
        })
        stats.push('');
        stats.push('----------------------------------')
        stats.push('Total:\t' + new Time(totalTime).toString());

        console.log(stats.join('\n'));
    }
}

module.exports = TerminalOutputter;
