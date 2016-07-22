const mongoose = require('mongoose'),
      debug = require('debug')('tonksDEV:money:api:aytController'),
      request = require('request'),
      http = require('http'),
      callAPI = require('../common/callAPI');

const controller = function(moneyUIVars) {
  'use strict';

  const readyStateMap = {
    '0': 'disconnected',
    '1': 'connected',
    '2': 'connecting',
    '3': 'disconnecting'
  }

  const aytData = function(done) {
      callAPI(moneyUIVars.apiaddress + '/ayt', 'GET', null, null, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const rtnVal = {
              'application': 'UI',
              'application-version': moneyUIVars.uiversion,
              'database': readyStateMap[mongoose.connection.readyState].toUpperCase(),
              'dbconnection': moneyUIVars.mongourl,
              'environment': moneyUIVars.environment.toUpperCase(),
              'ipport': moneyUIVars.ipaddress + ':' + moneyUIVars.port,
              'apiayt': JSON.parse(body)
            }
            done(null, rtnVal);
        } else {
          const rtnVal = {
            'error': error
          }
          done(rtnVal, null);
        }
    });
  }

  const aytAPI = function(done) {
      request('http://' + moneyUIVars.apiaddress + '/ayt', function(error, response, body) {
          if (!error && response.statusCode == 200) {
              done(null, JSON.parse(body));
          } else {
            const rtnVal = {
              'error': error
            }
            done(rtnVal, null);
          }
      });
  }

  return {
    aytData: aytData,
    aytAPI: aytAPI
  }
}

module.exports = controller;
