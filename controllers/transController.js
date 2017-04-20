const debug = require('debug')('tonksDEV:money:api:transController'),
      callAPI = require('../common/callAPI'),
      viewdataHelpers = require('../common/viewdataHelpers');

const controller = function(moneyUIVars) {
  'use strict';

  //customise this function to retrieve the right data to support the display of all account groups for the user
  const getTransactionPageData = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    //sequence for transaction register
    // 1. get transaction
    // 2. get account list
    // 3. get payee list
    // 4. get category list


    // API call for transaction register
    callAPI(envVars.apiaddress + '/transaction/' + envQSParams.txnid, 'GET', null, {userid: envSession.passport.user}, function(txnerr, txnresponse, txndata) {

      let txnApiResponse = viewdataHelpers.sanitizeErrAndData(txnerr, txndata, txnresponse.statusCode);
      let jsoResponse = JSON.parse(txnApiResponse.data);

      //bail out if no transaction was found
      if (txnApiResponse.err) {
        done(txnApiResponse.err, null);
      }

      callAPI(envVars.apiaddress + '/account/group/' + envSession.accountGroupId + '/allaccounts', 'GET', null, {userid: envSession.passport.user}, function(accserr, accsresponse, accsdata) {
        let accsApiResponse = viewdataHelpers.sanitizeErrAndData(accserr, accsdata, accsresponse.statusCode);
        let accsList = JSON.parse(accsApiResponse.data);
        jsoResponse.accountList = accsList.accountList;

        callAPI(envVars.apiaddress + '/payee/allpayees/' + envSession.accountGroupId, 'GET', null, {userid: envSession.passport.user}, function(payerr, payresponse, paydata) {
          let payApiResponse = viewdataHelpers.sanitizeErrAndData(payerr, paydata, payresponse.statusCode);
          let payList = JSON.parse(payApiResponse.data);
          jsoResponse.payeeList = payList.payeeList;

          callAPI(envVars.apiaddress + '/category/allcategories/' + envSession.accountGroupId, 'GET', null, {userid: envSession.passport.user}, function(caterr, catresponse, catdata) {
            let catApiResponse = viewdataHelpers.sanitizeErrAndData(caterr, catdata, catresponse.statusCode);
            let catList = JSON.parse(catApiResponse.data);
            jsoResponse.categoryList = catList.categoryList;

            //if there is no account id set this must be a new transaction.
            //the account id is stored in the querystring parameter. use it and look up the account code & name
            if (!jsoResponse.transaction.account.id) {
              jsoResponse.transaction.account.id = envQSParams.accid;
              jsoResponse.accountList.forEach(function(val, idx) {
                if (val.id === jsoResponse.transaction.account.id) {
                  jsoResponse.transaction.account.code = val.accountCode;
                  jsoResponse.transaction.account.name = val.accountName;
                }
              })
            }

            done(null, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody,
                      'tonksDEV Money: Transaction ' + jsoResponse.transaction.id, JSON.stringify(jsoResponse)));
          });
        });
      });
    });
  };

  return {
    getTransactionPageData: getTransactionPageData
  }
}

module.exports = controller;
