#!/usr/bin/env node

/* Copyright 2011-2012 Carlos Guerreiro
 *   http://perceptiveconstructs.com
 * Licensed under the MIT license */

'use strict';

var assert = require('assert');

var startRedis = require('./startRedis.js');
var recurrent = require('../recurrent.js');

startRedis(function(err, redis) {
  if(err) {
    throw err;
  }

  process.on('uncaughtException', function(err) {
    console.error(err.toString());
    redis.stop();
    process.exit(1);
  });

  var m = new recurrent.Manager('q').connect(6363);

  var count = 0;

  function doWork(taskId, cb) {
    assert.equal(taskId, 't1');
    setTimeout(function() {
      count++;
      if(count === 3) {
        cb(null, null);
        w.stop();
        m.stop();
        redis.stop();
        console.log('OK');
      } else if(count === 2) {
        cb('something went wrong');
      } else {
        cb(null, new Date().getTime()+ 5000);
      }
    }, 500);
  }

  var w = new recurrent.Worker('q', doWork).connect(6363);

  var c = new recurrent.Client('q').connect(6363);
  c.add('t1', new Date().getTime()+ 500, function(err, results) {
    if(err) {
      throw err;
    }
  });
  c.stop();
});
