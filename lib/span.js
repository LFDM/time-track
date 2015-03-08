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

module.exports = Span;
