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

module.exports = Time;
