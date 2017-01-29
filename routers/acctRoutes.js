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
    acctRouter.route('/:accid/register')
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



    return acctRouter;
};

module.exports = routes;
