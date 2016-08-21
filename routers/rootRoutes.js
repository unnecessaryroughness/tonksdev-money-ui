var debug = require('debug')('tonksDEV:routing'),
    debugM = require('debug')('tonksDEV:mongodb'),
    path = require('path'),
    express = require('express'),
    tonksDEVUser = require('../models/tonksdevUserModel.js'),
    callAPI = require('../common/callAPI');

var routes = function(moneyUIVars) {
    'use strict';

    var rootRouter = express.Router(),
        aytController = require('../controllers/aytController')(moneyUIVars),
        homepageController = require('../controllers/homepageController')(moneyUIVars);

    var rootDir = path.join(__dirname, '..', 'public');

    rootRouter.route('/')
      .get(function(req, res, next) {
          homepageController.getHomePageData(moneyUIVars, req.session, req.user, req.params, req.body, function(err, homepageData) {
            res.render('index', homepageData);
          });
      })


    rootRouter.route('/balances')
      .get(function(req, res, next) {
          homepageController.getBalancesData(moneyUIVars, req.session, req.user, req.params, req.body, function(err, homepageData) {
            res.render('balances', homepageData);
          });
      })


    //handle request to log out
    rootRouter.route('/logout')
      .get(function(req, res, next) {
          debug('User has logged out. Session destroyed.');
          req.logout();
          res.redirect('/');
      });

    rootRouter.route('/health')
        .get(function(req, res, next) {
            res.writeHead(200);
            res.end();
          });

    //handle request to "are you there?"
    rootRouter.route('/ayt')
        .get(function(req, res, next) {
            aytController.aytData(req.session.passport.user || 'no-user', function(err, data) {
              res.setHeader('Content-Type', 'application/json');
              if (!err) {
                return res.status(200).json(data);
              } else {
                return res.status(400).json({'error': err});
              }
            });
        });

    rootRouter.route('/aytAPI')
        .get(function(req, res, next) {
            aytController.aytAPI(req.session.passport.user || 'no-user', function(err, data) {
                res.setHeader('Content-Type', 'application/json');
                if (!err) {
                  debug("API AYT data is: " + JSON.stringify(data));
                  return res.status(200).json(data);
                } else {
                  debug('API AYT call failed');
                  return res.status(400).json({'error': err});
                }
            });
        });

    return rootRouter;
};

module.exports = routes;
