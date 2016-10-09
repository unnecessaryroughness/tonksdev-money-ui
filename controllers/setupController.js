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


  return {
    getAccGroupPageData: getAccGroupPageData,
    addNewAccGroup: addNewAccGroup,
    deleteAccGroup: deleteAccGroup,
    leaveAccGroup: leaveAccGroup,
    joinAccGroup: joinAccGroup,
    editAccGroup: editAccGroup
  }
}

module.exports = controller;
