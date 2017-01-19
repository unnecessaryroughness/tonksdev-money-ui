var express = require('express'),
    debug   = require('debug')('tonksDEV:money:ui:router:ajax'),
    callAPI = require('../common/callAPI');

var routes = function(moneyUIVars) {
    'use strict';

    var ajaxRouter = express.Router();

    //handle request to switch account groups
    ajaxRouter.route('/switchag')
        .post(function(req, res, next) {
            if (typeof req.session.passport !== 'undefined') {    //only do anything if user is logged in

            //store accountgroup name in session
            req.session.accountGroupName = req.body.accountGroupName;

            //call API to get accountgroup id to store in session
            callAPI(moneyUIVars.apiaddress + '/account/group/' + req.session.accountGroupName, 'GET',
                    null, {userid: req.session.passport.user}, function(err, response, data) {

                if (err || response.statusCode === 200) {
                  req.session.accountGroupId = JSON.parse(data).accountGroup.id
                  return res.status(200).json({'accountGroupName': req.session.accountGroupName, "accountGroupId": req.session.accountGroupId});
                } else {
                  return res.status(404).json({'accountGroupName': "not found", "accountGroupId": "not found", "data": JSON.parse(data), "stack": err});
                }
            });
          } else {
            return res.status(403).json({'error': "forbidden"});
          }
        });


    //handle request to toggle transaction cleared flag
    ajaxRouter.route("/cleartxn")
      .put(function(req, res, next) {
        if (typeof req.session.passport !== 'undefined') {    //only do anything if user is logged in

          //call API to get accountgroup id to store in session
          callAPI(moneyUIVars.apiaddress + '/transaction/clear/' + req.body.transactionId, 'PUT',
                  null, {userid: req.session.passport.user}, function(err, response, data) {

              if (err || response.statusCode === 200) {
                return res.status(200).json({'isCleared': JSON.parse(data).transaction.isCleared});
              } else {
                return res.status(404).json({'accountGroupName': "not found", "accountGroupId": "not found", "data": JSON.parse(data), "stack": err});
              }
          });
        } else {
          return res.status(403).json({'error': "forbidden"});
        }
      })

    return ajaxRouter;
};

module.exports = routes;
