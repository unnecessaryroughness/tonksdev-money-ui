var express = require('express'),
    debug   = require('debug')('tonksDEV:money:ui:router:setup'),
    callAPI = require('../common/callAPI'),
    sessionHelpers = require('../common/sessionHelpers'),
    controllerHelpers = require('../common/controllerHelpers'),
    errorController = require('../controllers/errorController');

var routes = function(moneyUIVars) {
    'use strict';

    var setupRouter = express.Router(),
        setupController = require('../controllers/setupController')(moneyUIVars);

    //handle request for account group setup screen
    setupRouter.route('/accgroups')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              controllerHelpers.routeGet(setupController.getAccGroupPageData, moneyUIVars, req, res, 'setup/accgroups');
            } else {
              controllerHelpers.routeError(moneyUIVars, req, res, 403, 'forbidden');
            }
          })
        .post(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {

              switch(req.body.inputAction) {
                case "create":
                  controllerHelpers.routePost(setupController.addNewAccGroup, moneyUIVars, req, res);
                  break;

                case "join":
                  controllerHelpers.routePost(setupController.joinAccGroup, moneyUIVars, req, res);
                  break;

                case "leave":
                  controllerHelpers.routePost(setupController.leaveAccGroup, moneyUIVars, req, res);
                  break;

                case "update":
                  controllerHelpers.routePost(setupController.editAccGroup, moneyUIVars, req, res);
                  break;

                case "delete":
                  controllerHelpers.routePost(setupController.deleteAccGroup, moneyUIVars, req, res);
                  break;

                default:
                  controllerHelpers.routeError(moneyUIVars, req, res, 404, 'not found');
                  break;
              }
            }
          });

    setupRouter.route('/accounts')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              controllerHelpers.routeGet(setupController.getAccountsPageData, moneyUIVars, req, res, 'setup/accounts');
            } else {
              controllerHelpers.routeError(moneyUIVars, req, res, 403, 'forbidden');
            }
          })
        .post(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {

              switch(req.body.inputAction) {
                case "create":
                  controllerHelpers.routePost(setupController.addNewAccount, moneyUIVars, req, res);
                  break;

                case "update":
                  controllerHelpers.routePost(setupController.editAccount, moneyUIVars, req, res);
                  break;

                case "delete":
                  controllerHelpers.routePost(setupController.deleteAccount, moneyUIVars, req, res);
                  break;

              default:
                  controllerHelpers.routeError(moneyUIVars, req, res, 404, 'action not found (' + req.body.inputAction + ')');
                break;
            }
          }
        });


    return setupRouter;
};

module.exports = routes;
