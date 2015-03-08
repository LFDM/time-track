var _    = require('lodash'),
    Span = require('./span'),
    Time = require('./time');

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

module.exports = Record;
