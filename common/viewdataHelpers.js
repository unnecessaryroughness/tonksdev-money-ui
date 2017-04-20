const helper = function() {
  'use strict';

  function generateViewData(envVars, envSession, envUser, envQSParams, envBody, pageTitle, pageData) {
    let rtnVal = {
            "header": {
              "environment": envVars.environment,
              "loggedIn": envUser ? true : false,
              "loggedInUser": envUser ? envUser : {displayName: 'not logged in'},
              "loggedInUserGroups": envUser ? envUser.groups : ['none'],
              "selectedAccountGroup": envSession.accountGroupName || (envUser ? envUser.groups[0] : ''),
              "selectedAccountGroupId": envSession.accountGroupId || '',
              "selectedAccountId": envQSParams.accid
            },
            "sessionData": {
              "lastNewTransactionDate": envSession.lastNewTransactionDate
            },
            "pageTitle": pageTitle,
            "pageData": (typeof pageData === 'string') ? JSON.parse(pageData) : pageData,
            "pageError": envBody.error
          };

    // console.log("rtnVal", rtnVal);
    return rtnVal;
  }

  function sanitizeErrAndData(err, data, statusCode) {
    return {
      err: (!err && statusCode !== 200) ? data : err,
      data: (!err && statusCode === 200) ? data : {}
    }
  }

  return {
    generateViewData: generateViewData,
    sanitizeErrAndData: sanitizeErrAndData
  }
}

module.exports = helper();
