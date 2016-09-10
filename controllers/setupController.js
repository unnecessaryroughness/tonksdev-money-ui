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

  return {
    getAccGroupPageData: getAccGroupPageData,
    addNewAccGroup: addNewAccGroup
  }
}

module.exports = controller;
