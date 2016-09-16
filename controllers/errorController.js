const debug = require('debug')('tonksDEV:money:api:errorController'),
      viewdataHelpers = require('../common/viewdataHelpers');

const controller = function() {
  'use strict';


  const getErrorPageData = function(envVars, envSession, envUser, envQSParams, envBody, done) {
      done(null, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, 'tonksDEV Money: Error', envBody));
  };


  return {
    getErrorPageData: getErrorPageData
  }
}

module.exports = controller();
