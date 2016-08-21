const request = require('request'),
      debug = require('debug')('tonksDEV:money:api:callAPI:request'),
      debugR = require('debug')('tonksDEV:money:api:callAPI:response');

function callAPI(reqPath, reqMethod, reqJSON, reqOptions, doneCallback) {
    'use strict';

    reqOptions = reqOptions || {};
    reqOptions.url = (reqPath.substr(0, 7) === 'http://') ? reqPath : 'http://' + reqPath;
    reqOptions.json = true;
    reqOptions.headers = {'content-type': 'application/json',
                          'apikey': process.env.API_KEY,
                          'userid': reqOptions.userid || ''}
    reqOptions.method = (reqMethod) ? reqMethod.toUpperCase() : 'GET';
    reqOptions.json = reqJSON;

    debug('calling API: ' + reqPath + '(' + reqMethod + ') ' + JSON.stringify(reqOptions.headers));

    //doneCallback must implement signature --> function(error, response, body) {}
    request(reqOptions, function(error, response, body) {
        debugR('received response from API: ' + reqPath + '(' + reqMethod + ') --> ' + response.statusCode);
        doneCallback(error, response, body);
    });
}

module.exports = callAPI;
