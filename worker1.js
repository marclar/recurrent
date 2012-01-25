#!/usr/bin/env node

var recurrent = require('./recurrent.js');

var w = new recurrent.Worker('q');

w.do = function(taskId, cb) {
  setTimeout(function() {
    console.error('completed', taskId);
    cb(null, new Date().getTime()+ (taskId === 't1' ? 10000 : 25000));
  }, 6000);
};
w.go();

