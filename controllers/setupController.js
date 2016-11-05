const debug = require('debug')('tonksDEV:money:api:setupController'),
      callAPI = require('../common/callAPI'),
      viewdataHelpers = require('../common/viewdataHelpers');

const controller = function(moneyUIVars) {
  'use strict';

  //customise this function to retrieve the right data to support the display of all account groups for the user
  const getAccGroupPageData = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    callAPI(envVars.apiaddress + '/account/group/allgroups', 'GET', null, {userid: envSession.passport.user}, function(err, response, data) {
      let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
      done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody,
                                              'tonksDEV Money: Account Group Setup', apiResponse.data));
    });
  };


  const addNewAccGroup = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    let postBody = {
      "accountGroup": {
        "groupCode": envBody.inputGroupCode,
        "description": envBody.inputDescription,
        "password": envBody.inputPassword,
        "owner": envSession.passport.user,
        "members": [ envSession.passport.user ]
      }
    }

    callAPI(envVars.apiaddress + '/account/group', 'POST', postBody, {userid: envSession.passport.user}, function(err, response, data) {
        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }


  const editAccGroup = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    let postBody = {
      "accountGroup": {
        "description": envBody.inputEditDescription,
        "password": envBody.inputEditCurrentPassword
      }
    }

    let postPWBody = {
      "oldPassword": envBody.inputEditCurrentPassword,
      "newPassword": envBody.inputEditNewPassword
    }

    //edit the group description
    callAPI(envVars.apiaddress + '/account/group/' + envBody.inputEditId, 'PUT', postBody, {userid: envSession.passport.user}, function(err, response, data) {
        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);

        //update the group password
        if (envBody.inputEditNewPassword && envBody.inputEditNewPassword.length > 0 && envBody.inputEditNewPassword !== envBody.inputEditCurrentPassword) {
          callAPI(envVars.apiaddress + '/account/group/' + envBody.inputEditId + '/changepassword', 'PUT', postPWBody, {userid: envSession.passport.user}, function(err, response, data) {
            let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
            done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
          });
        } else {
          done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
        }
    });
  }


  const deleteAccGroup = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    let postBody = {
      "accountGroup": {
        "password": envBody.inputEditCurrentPassword
      }
    }
    callAPI(envVars.apiaddress + '/account/group/' + envBody.inputEditId, 'DELETE', postBody,
                                {userid: envSession.passport.user}, function(err, response, data) {

        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }


  const leaveAccGroup = function(envVars, envSession, envUser, envQSParams, envBody, done) {
    callAPI(envVars.apiaddress + '/user/' + envSession.passport.user + '/group/' + envBody.inputEditGroupCode, 'DELETE', {},
                                {userid: envSession.passport.user}, function(err, response, data) {

        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }


  const joinAccGroup = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    let putBody = {
      "accountGroup": {
        "password": envBody.inputPassword
      }
    }

    callAPI(envVars.apiaddress + '/user/' + envSession.passport.user + '/group/' + envBody.inputJoinGroup, 'PUT', putBody,
                                {userid: envSession.passport.user}, function(err, response, data) {

        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }


//SETUP ACCOUNT FUNCTIONS

  const getAccountsPageData = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    callAPI(envVars.apiaddress + '/account/group/' + envSession.accountGroupId + '/allaccounts', 'GET', null, {userid: envSession.passport.user}, function(err, response, data) {

      //default apiResponse to an empty object
      let apiResponse = {data:{accountList: []}, err: err};

      //if some data was returned overwrite the apiResponse object
      if (response.statusCode === 200) {
        apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);

        let tmpRsp = JSON.parse(apiResponse.data);
        tmpRsp.accountList.forEach(function(acct, idx) {
          acct.accountTypeText = translateAcctType(acct.accountType);
        })
        apiResponse.data = JSON.stringify(tmpRsp);
      } else {
        apiResponse.err = {"error": response.statusCode, "message": "no accounts found"}
      }

      done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody,
                                              'tonksDEV Money: Account Setup', apiResponse.data));
    });
  };


  const translateAcctType = function(acctType) {
      switch (acctType) {
          case 'CA':
            return 'Current Account';
            break;
          case 'SA':
            return 'Savings Account';
            break;
          case 'CC':
            return 'Credit Card';
            break;
          case 'SC':
            return 'Store Card';
            break;
          default:
            return 'Unknown Type';
            break;
      }
  }


  const addNewAccount = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    let postBody = {
      "account": {
        "accountCode": envBody.inputAcctCode,
        "accountName": envBody.inputAcctName,
        "accountType": envBody.selAcctType,
        "bankName": envBody.inputBankName,
        "accountGroup": envSession.accountGroupId,
        "balance": 0.00
      }
    }

    callAPI(envVars.apiaddress + '/account', 'POST', postBody, {userid: envSession.passport.user}, function(err, response, data) {
        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }


  const editAccount = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    let postBody = {
      "account": {
        "accountCode": envBody.inputEditAcctCode,
        "accountName": envBody.inputEditAcctName,
        "accountType": envBody.selEditAcctType,
        "bankName": envBody.inputEditBankName
      }
    }

    //edit the group description
    callAPI(envVars.apiaddress + '/account/' + envBody.inputEditId, 'PUT', postBody, {userid: envSession.passport.user}, function(err, response, data) {
        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }


  const deleteAccount = function(envVars, envSession, envUser, envQSParams, envBody, done) {

    let postBody = {
      "accountGroup": {
        "password": envBody.inputEditPassword
      }
    }

    callAPI(envVars.apiaddress + '/account/' + envBody.inputEditId, 'DELETE', postBody,
                                {userid: envSession.passport.user}, function(err, response, data) {

        let apiResponse = viewdataHelpers.sanitizeErrAndData(err, data, response.statusCode);
        done(apiResponse.err, viewdataHelpers.generateViewData(envVars, envSession, envUser, envQSParams, envBody, '', apiResponse.data));
    });
  }


  return {
    getAccGroupPageData: getAccGroupPageData,
    addNewAccGroup: addNewAccGroup,
    deleteAccGroup: deleteAccGroup,
    leaveAccGroup: leaveAccGroup,
    joinAccGroup: joinAccGroup,
    editAccGroup: editAccGroup,
    getAccountsPageData: getAccountsPageData,
    addNewAccount: addNewAccount,
    editAccount: editAccount,
    deleteAccount: deleteAccount
  }
}

module.exports = controller;
