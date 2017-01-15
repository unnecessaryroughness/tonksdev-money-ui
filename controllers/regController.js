const debug = require('debug')('tonksDEV:money:api:regController'),
      callAPI = require('../common/callAPI'),
      viewdataHelpers = require('../common/viewdataHelpers');

const controller = function(moneyUIVars) {
  'use strict';

  //customise this function to retrieve the right data to support the display of all account groups for the user
  const getRegisterPageData = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    // API call for transaction register
    callAPI(envVars.apiaddress + '/transaction/recent/10/' + envQSParams.accid, 'GET', null, {userid: envSession.passport.user}, function(err, response, data) {
      let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
      let jsoResponse = JSON.parse(apiResponse.data);

      callAPI(envVars.apiaddress + '/account/' + envQSParams.accid, 'GET', null, {userid: envSession.passport.user}, function(accterr, acctresponse, acctdata) {
        let acctApiResponse = viewdataHelpers.sanitizeErrAndData(accterr, acctdata, acctresponse.statusCode);
        let fullAcct = JSON.parse(acctApiResponse.data);

        callAPI(envVars.apiaddress + '/account/group/' + envSession.accountGroupId + '/allaccounts', 'GET', null, {userid: envSession.passport.user}, function(accserr, accsresponse, accsdata) {
          let accsApiResponse = viewdataHelpers.sanitizeErrAndData(accserr, accsdata, accsresponse.statusCode);
          let accsList = JSON.parse(accsApiResponse.data);

          jsoResponse.account = fullAcct.account;
          jsoResponse.accountList = accsList.accountList;

          done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody,
            'tonksDEV Money: ' + jsoResponse.account.accountCode + ' Register', JSON.stringify(jsoResponse)));
        });
      });
    });
  };

  return {
    getRegisterPageData: getRegisterPageData
  }
}

module.exports = controller;
