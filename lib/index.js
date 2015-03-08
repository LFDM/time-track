#! /usr/bin/env node

'use strict';

var TimeTrack = require('./time-track');

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
