var express = require('express'),
    debug   = require('debug')('tonksDEV:money:ui:router:register'),
    callAPI = require('../common/callAPI'),
    sessionHelpers = require('../common/sessionHelpers'),
    controllerHelpers = require('../common/controllerHelpers'),
    errorController = require('../controllers/errorController');

var routes = function(moneyUIVars) {
    'use strict';

    var acctRouter = express.Router(),
        regController = require('../controllers/regController')(moneyUIVars),
        transController = require('../controllers/transController')(moneyUIVars);

    //handle request for account register screen
    acctRouter.route('/:accid/register/:limit?')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              controllerHelpers.routeGet(regController.getRegisterPageData, moneyUIVars, req, res, 'account/register');
            } else {
              controllerHelpers.routeError(moneyUIVars, req, res, 403, 'forbidden');
            }
          })


    //handle request for account register screen
    acctRouter.route('/:accid/transaction/:txnid')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              controllerHelpers.routeGet(transController.getTransactionPageData, moneyUIVars, req, res, 'account/transaction');
            } else {
              controllerHelpers.routeError(moneyUIVars, req, res, 403, 'forbidden');
            }
          })
        .post(function(req, res, next) {
          if (sessionHelpers.userIsLoggedIn(req)) {
            switch(req.body.inputAction) {
              case "create":
                res.redirectBackTo = "/account/" + JSON.parse(req.body.inputtransaction).account.id + "/register";
                controllerHelpers.routePost(transController.addNewTransaction, moneyUIVars, req, res);
                break;

              case "update":
                res.redirectBackTo = "/account/" + JSON.parse(req.body.inputtransaction).account.id + "/register";
                controllerHelpers.routePost(transController.updateTransaction, moneyUIVars, req, res);
                break;

              case "delete":
                res.redirectBackTo = "/account/" + JSON.parse(req.body.inputtransaction).account.id + "/register";
                controllerHelpers.routePost(transController.deleteTransaction, moneyUIVars, req, res);
                break;

              default:
                  controllerHelpers.routeError(moneyUIVars, req, res, 404, 'action not found (' + req.body.inputAction + ')');
                break;
              }
            }
          });

    return acctRouter;
};

module.exports = routes;
