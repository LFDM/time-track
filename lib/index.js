#! /usr/bin/env node

'use strict';

var _ = require('lodash'),
    TimeTrack = require('./time-track');

var commands = [
    'start',
    'stop',
    'show',
    'setup'
];

function parseCommand(arg) {
    if (!arg || !_.contains(commands, arg)) {
        console.log('Invalid command. Use one of these instead:');
        console.log(_.map(commands, function(command) {
            return '\t' + command;
        }).join('\n'));

        process.exit();
    }
    return arg;
}

function execute() {
    var tt = new TimeTrack()
    var command = parseCommand(process.argv[2]);
    tt[command]();
}

if (require.main === module) {
    execute();
}
