var mongoose = require('mongoose'),
    debug = require('debug')('tonksDEV:money:api:aytController'),
    request = require('request');

var controller = function(moneyApiVars) {
  'use strict';

  var readyStateMap = {
    '0': 'disconnected',
    '1': 'connected',
    '2': 'connecting',
    '3': 'disconnecting'
  }

  var ayt = function(req, res) {
      var rtnVal = {
          'application': 'UI',
          'database': readyStateMap[mongoose.connection.readyState].toUpperCase(),
          'db-connection': moneyApiVars.mongourl,
          'environment': moneyApiVars.environment.toUpperCase(),
          'ip-port': moneyApiVars.ipaddress + ':' + moneyApiVars.port
      }

      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(rtnVal);
  }

  var aytAPI = function(req, res) {
      request('http://' + moneyApiVars.apiaddress + '/ayt', function(error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log(body);
              return res.status(200).json(JSON.parse(body));
          }
      });
  }

  return {
    ayt: ayt,
    aytAPI: aytAPI
  }
}

module.exports = controller;
