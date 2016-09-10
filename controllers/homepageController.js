const debug = require('debug')('tonksDEV:money:api:homepageController'),
      callAPI = require('../common/callAPI'),
      viewdataHelpers = require('../common/viewdataHelpers');

const controller = function(moneyUIVars) {
  'use strict';

  const getHomePageData = function(envVars, envSession, envUser, envQSParams, envBody, done) {
    envSession.pgviews++;
    done(null, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody,
                                            'tonksDEV Money: Welcome', {pageViews: envSession.pgviews}));
  };


  const getBalancesData = function(envVars, envSession, envUser, envQSParams, envBody, done) {
    let userid = (typeof envSession.passport !== 'undefined') ? envSession.passport.user : 'no-user';

    callAPI(envVars.apiaddress + '/account/group/' + envSession.accountGroupId + '/allaccounts', 'GET', null, {userid: userid}, function(err, response, data) {
      let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
      done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody,
                                                              'tonksDEV Money: Balances', apiResponse.data));
    });
  };


  return {
    getHomePageData: getHomePageData,
    getBalancesData: getBalancesData
  }
}

module.exports = controller;
