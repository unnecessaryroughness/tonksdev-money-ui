var express = require('express'),
    debug   = require('debug')('tonksDEV:money:ui:router:transaction'),
    callAPI = require('../common/callAPI'),
    sessionHelpers = require('../common/sessionHelpers'),
    controllerHelpers = require('../common/controllerHelpers'),
    errorController = require('../controllers/errorController');

var routes = function(moneyUIVars) {
    'use strict';

    var transRouter = express.Router(),
        transController = require('../controllers/transController')(moneyUIVars);

    //handle request for account register screen
    transRouter.route('/:txnid')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              controllerHelpers.routeGet(transController.getTransactionPageData, moneyUIVars, req, res, 'account/transaction');
            } else {
              controllerHelpers.routeError(moneyUIVars, req, res, 403, 'forbidden');
            }
          })

    return transRouter;
};

module.exports = routes;
