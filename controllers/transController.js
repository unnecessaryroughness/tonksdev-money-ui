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

            callAPI(envVars.apiaddress + '/transaction/placeholders/' + envQSParams.accid, 'GET', null, {userid: envSession.passport.user}, function(pherr, phresponse, phdata) {
              let phApiResponse = viewdataHelpers.sanitizeErrAndData(pherr, phdata, phresponse.statusCode);
              let phList = JSON.stringify(phApiResponse.data) !== "{}" ? JSON.parse(phApiResponse.data) : {"transactionList": []};
              jsoResponse.placeholderList = phList.transactionList;

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
    });
  };

  const addNewTransaction = function(envVars, envSession, envUser, envQSParams, envBody, done) {
    let postBody = {transaction: JSON.parse(envBody.inputtransaction)};

    callAPI(envVars.apiaddress + '/transaction', 'POST', postBody, {userid: envSession.passport.user}, function(err, response, data) {

        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);

        //if successfully saved, update the persistent `new transaction` date
        if (!err && response.statusCode === 200) {
          envSession.lastNewTransactionDate = postBody.transaction.transactionDate;
        }

        //if a placeholder is to be reduced, fire off that transaction now
        if (response.statusCode === 200 &&
            data.transaction && data.transaction.amount != 0 &&
            postBody.transaction.reducePlaceholder && postBody.transaction.reduceAmount) {

            let adjustBody = {"transactionId": postBody.transaction.reducePlaceholder,
                              "adjustBy": parseFloat(postBody.transaction.reduceAmount).toFixed(2)};

            //call API to get reduce placeholder transaction
            callAPI(envVars.apiaddress + '/transaction/adjust/' + postBody.transaction.reducePlaceholder, 'PUT', adjustBody, {userid: envSession.passport.user}, function(ad_err, ad_response, ad_data) {
              done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
            });
        } else {
            //nothing to reduce, just return as normal
            done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
        }
    });
  }

  const updateTransaction = function(envVars, envSession, envUser, envQSParams, envBody, done) {
    let postBody = {transaction: JSON.parse(envBody.inputtransaction)};

    callAPI(envVars.apiaddress + '/transaction/' + postBody.transaction.id, 'PUT', postBody, {userid: envSession.passport.user}, function(err, response, data) {
        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }

  const deleteTransaction = function(envVars, envSession, envUser, envQSParams, envBody, done) {
    let postBody = {transaction: JSON.parse(envBody.inputtransaction)};

    callAPI(envVars.apiaddress + '/transaction/' + postBody.transaction.id, 'DELETE', null, {userid: envSession.passport.user}, function(err, response, data) {
        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }

  return {
    getTransactionPageData: getTransactionPageData,
    addNewTransaction: addNewTransaction,
    updateTransaction: updateTransaction,
    deleteTransaction: deleteTransaction
  }
}

module.exports = controller;
