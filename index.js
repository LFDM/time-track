#! /usr/bin/env node

'use strict';

var _ = require('lodash'),
    TimeTrack = require('./lib/time-track');

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
    var Outputter = require('./lib/terminal-outputter');
    var exporter = new Outputter();
    var tt = new TimeTrack(exporter);
    var command = parseCommand(process.argv[2]);
    tt[command]();
}

if (require.main === module) {
    execute();
}
