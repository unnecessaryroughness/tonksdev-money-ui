#!/bin/env node

var debug        = require('debug')('tonksDEV:money:ui:server'),
    moneyUI     = require('./common/moneyUI'),
    mApp         = new moneyUI();

mApp.initialize();
mApp.start();
debug('server running');
