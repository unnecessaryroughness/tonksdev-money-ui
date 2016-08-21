const debug = require('debug')('tonksDEV:money:api:homepageController'),
      callAPI = require('../common/callAPI');

const controller = function(moneyUIVars) {
  'use strict';

  const getHomePageData = function(envVars, envSession, envUser, envQSParams, envBody, done) {
    envSession.pgviews++;
    done(null, {
                title: 'tonksDEV Money: Welcome',
                pgViews: envSession.pgviews,
                mongourl: envVars.mongourl,
                environment: envVars.environment,
                loggedIn: envUser ? true : false,
                loggedInUser: envUser ? envUser : {displayName: 'not logged in'}
              });
  };


  const getBalancesData = function(envVars, envSession, envUser, envQSParams, envBody, done) {
    let userid = (typeof envSession.passport !== 'undefined') ? envSession.passport.user : 'no-user';
    callAPI(envVars.apiaddress + '/account/allaccounts', 'GET', null, {userid: userid}, function(err, response, data) {
      let allAccounts = {};
      if (err || response.statusCode !== 200) {
        allAccounts = {
          accountList: [{'accountCode': 'N/A', 'accountName': 'No accounts to display', 'error': err}]
        };
      } else {
        allAccounts = JSON.parse(data);
      }

      done(err, {
                  title: 'tonksDEV Money: Balances',
                  environment: envVars.environment,
                  loggedIn: envUser ? true : false,
                  loggedInUser: envUser ? envUser : {displayName: 'not logged in'},
                  allAccounts: allAccounts
                });
    });
  };


  return {
    getHomePageData: getHomePageData,
    getBalancesData: getBalancesData
  }
}

module.exports = controller;
