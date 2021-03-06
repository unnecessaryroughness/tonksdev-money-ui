var express = require('express'),
    debug   = require('debug')('tonksDEV:money:ui:router:register'),
    callAPI = require('../common/callAPI'),
    sessionHelpers = require('../common/sessionHelpers'),
    controllerHelpers = require('../common/controllerHelpers'),
    errorController = require('../controllers/errorController');

var routes = function(moneyUIVars) {
    'use strict';

    var regRouter = express.Router(),
        regController = require('../controllers/regController')(moneyUIVars);

    //handle request for account register screen
    regRouter.route('/:accid')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              controllerHelpers.routeGet(regController.getRegisterPageData, moneyUIVars, req, res, 'account/register');
            } else {
              controllerHelpers.routeError(moneyUIVars, req, res, 403, 'forbidden');
            }
          })

    return regRouter;
};

module.exports = routes;
