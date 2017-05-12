var express = require('express'),
    debug   = require('debug')('tonksDEV:money:ui:router:repeating'),
    callAPI = require('../common/callAPI'),
    sessionHelpers = require('../common/sessionHelpers'),
    controllerHelpers = require('../common/controllerHelpers'),
    errorController = require('../controllers/errorController');

var routes = function(moneyUIVars) {
    'use strict';

    var reptRouter = express.Router(),
        reptController = require('../controllers/reptController')(moneyUIVars);

    //handle request for account register screen
    reptRouter.route('/')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              controllerHelpers.routeGet(reptController.getRepeatingPageData, moneyUIVars, req, res, 'repeating/repeating');
            } else {
              controllerHelpers.routeError(moneyUIVars, req, res, 403, 'forbidden');
            }
          })


    reptRouter.route('/:rptid')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              controllerHelpers.routeGet(reptController.getRepeatingTransPageData, moneyUIVars, req, res, 'repeating/repeatingtrans');
            } else {
              controllerHelpers.routeError(moneyUIVars, req, res, 403, 'forbidden');
            }
          })
          .post(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {
              switch(req.body.inputAction) {
                case "create":
                  res.redirectBackTo = "/repeating";
                  debug("in the create routine");
                  console.log(JSON.parse(req.body.inputtransaction).amount);
                  controllerHelpers.routePost(reptController.addNewRepeating, moneyUIVars, req, res);
                  break;

                case "update":
                debug("in the update routine");
                  res.redirectBackTo = "/repeating";
                  controllerHelpers.routePost(reptController.updateRepeating, moneyUIVars, req, res);
                  break;

                case "delete":
                  res.redirectBackTo = "/repeating";
                  controllerHelpers.routePost(reptController.deleteRepeating, moneyUIVars, req, res);
                  break;

                case "apply":
                  res.redirectBackTo = "/repeating";
                  controllerHelpers.routePost(reptController.applyRepeating, moneyUIVars, req, res);
                  break;

              default:
                  controllerHelpers.routeError(moneyUIVars, req, res, 404, 'action not found (' + req.body.inputAction + ')');
                break;
              }
            }
          });


    return reptRouter;
};

module.exports = routes;
