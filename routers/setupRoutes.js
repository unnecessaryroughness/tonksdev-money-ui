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
              setupController.getAccGroupPageData(moneyUIVars, req.session, req.user, req.params, req.body, function(err, pageData) {
                res.render('setup/accgroups', pageData);
              });
            } else {
              errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params,
                                {'error' : {'error': 403, 'message': 'forbidden'}},
                                function(err, errorData) {

                res.status(403).render('error', errorData);
              })
            }
          })
        .post(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {

              switch(req.body.inputAction) {
                case "create":
                  setupController.addNewAccGroup(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                    if (!err) {
                      res.redirect('back');
                    } else {
                      errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params, {'error': err}, function(cErr, errorData) {
                          res.status(err.statusCode || 500).render('error', errorData);
                      })
                    }
                  });
                  break;

                case "join":
                  setupController.joinAccGroup(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                    if (!err) {
                      res.redirect('back');
                    } else {
                      errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params, {'error': err}, function(cErr, errorData) {
                          res.status(err.statusCode || 500).render('error', errorData);
                      })
                    }
                  });
                  break;

                case "leave":
                  setupController.leaveAccGroup(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                    if (!err) {
                      res.redirect('back');
                    } else {
                      errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params, {'error': err}, function(cErr, errorData) {
                          res.status(err.statusCode || 500).render('error', errorData);
                      })
                    }
                  });
                  break;

                case "update":
                  setupController.editAccGroup(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                    if (!err) {
                      res.redirect('back');
                    } else {
                      errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params, {'error': err}, function(cErr, errorData) {
                          res.status(err.statusCode || 500).render('error', errorData);
                      })
                    }
                  });
                  break;

                case "delete":
                  setupController.deleteAccGroup(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                    if (!err) {
                      res.redirect('back');
                    } else {
                      errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params, {'error': err}, function(cErr, errorData) {
                          res.status(err.statusCode || 500).render('error', errorData);
                      })
                    }
                  });
                  break;

                default:
                  errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params,
                                    {'error':{'error': 404, 'message': 'not found'}}, function(cErr, errorData) {

                      res.status(500).render('error', errorData);
                  })
                  break;
              }
            }
          });

    setupRouter.route('/accounts')
        .get(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {    //only do anything if user is logged in
              setupController.getAccountsPageData(moneyUIVars, req.session, req.user, req.params, req.body, function(err, pageData) {
                res.render('setup/accounts', pageData);
              });
            } else {
              errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params,
                                {'error' : {'error': 403, 'message': 'forbidden'}},
                                function(err, errorData) {

                res.status(403).render('error', errorData);
              })
            }
          })
        .post(function(req, res, next) {
            if (sessionHelpers.userIsLoggedIn(req)) {

              switch(req.body.inputAction) {
                case "create":
                  setupController.addNewAccount(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                    if (!err) {
                      res.redirect('back');
                    } else {
                      errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params, {'error': err}, function(cErr, errorData) {
                          res.status(err.statusCode || 500).render('error', errorData);
                      })
                    }
                  });
                  break;

                case "update":
                debug("calling the new ROUTE method");
                  controllerHelpers.route(setupController.editAccount, moneyUIVars, req, res);

                  // setupController.editAccount(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                  //   if (!err) {
                  //     res.redirect('back');
                  //   } else {
                  //     errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params, {'error': err}, function(cErr, errorData) {
                  //         res.status(err.statusCode || 500).render('error', errorData);
                  //     })
                  //   }
                  // });
                  break;

                  case "delete":
                    setupController.deleteAccount(moneyUIVars, req.session, req.user, req.params, req.body, function(err, newGroupData) {
                      if (!err) {
                        res.redirect('back');
                      } else {
                        errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params, {'error': err}, function(cErr, errorData) {
                            res.status(err.statusCode || 500).render('error', errorData);
                        })
                      }
                    });
                    break;

              default:
                errorController.getErrorPageData(moneyUIVars, req.session, req.user, req.params,
                                  {'error':{'error': 404, 'message': 'action not found (' + req.body.inputAction + ')'}}, function(cErr, errorData) {
                    res.status(500).render('error', errorData);
                })
                break;
            }
          }
        });


    return setupRouter;
};

module.exports = routes;
