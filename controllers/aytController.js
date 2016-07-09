var mongoose = require('mongoose'),
    debug = require('debug')('tonksDEV:money:api:aytController'),
    request = require('request'),
    http = require('http');

var controller = function(moneyUIVars) {
  'use strict';

  var readyStateMap = {
    '0': 'disconnected',
    '1': 'connected',
    '2': 'connecting',
    '3': 'disconnecting'
  }

  var aytData = function(done) {
      request('http://' + moneyUIVars.apiaddress + '/ayt', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var rtnVal = {
              'application': 'UI',
              'database': readyStateMap[mongoose.connection.readyState].toUpperCase(),
              'dbconnection': moneyUIVars.mongourl,
              'environment': moneyUIVars.environment.toUpperCase(),
              'ipport': moneyUIVars.ipaddress + ':' + moneyUIVars.port,
              'apiayt': JSON.parse(body)
            }
            done(null, rtnVal);
        } else {
          var rtnVal = {
            'error': error
          }
          done(rtnVal, null);
        }
    });
  }

  var aytAPI = function(done) {
      request('http://' + moneyUIVars.apiaddress + '/ayt', function(error, response, body) {
          if (!error && response.statusCode == 200) {
              done(null, JSON.parse(body));
          } else {
            var rtnVal = {
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
