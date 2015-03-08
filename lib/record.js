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
        var breaks = self.spans.length - 1
        var parts = [
            'So far you\'ve been working ',
            time.toString(true) + ' ',
            'today.',
            '\n',
            getBreakStatus(breaks),
            '\n',
            getSuggestion(time.hours)
        ];
        console.log(_.trim(_.filter(parts).join('')));
    }

    function getBreakStatus(breaks) {
        if (breaks > 1) {
            return 'You took ' + breaks + ' breaks during this.'
        }
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
