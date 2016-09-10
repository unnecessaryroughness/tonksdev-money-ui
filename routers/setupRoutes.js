var express = require('express'),
    debug   = require('debug')('tonksDEV:money:ui:router:setup'),
    callAPI = require('../common/callAPI'),
    sessionHelpers = require('../common/sessionHelpers')();

var routes = function(moneyUIVars) {
    'use strict';

    var setupRouter = express.Router(),
        setupController = require('../controllers/setupController')(moneyUIVars);

    //handle request to sign-in with google
    setupRouter.route('/accgroups')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              setupController.getAccGroupPageData(moneyUIVars, req.session, req.user, req.params, req.body, function(err, pageData) {
                res.render('setup/accgroups', pageData);
              });
            } else {
              return res.render('error', {'error' : {'error': 403, 'message': 'forbidden'}});
            }
          })
        .post(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {

              switch(req.body.inputAction) {
                case "create":
                  setupController.addNewAccGroup(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                    res.redirect('back');
                  });
                  break;

                case "join":
                  break;

                case "leave":
                  break;

                case "delete":
                  break;

                default:
                  return res.render('error', {'error' : {'error': 404, 'message': 'not found'}});
                  break;
              }
            }
          });


    return setupRouter;
};

module.exports = routes;
