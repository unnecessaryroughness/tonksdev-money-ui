var debug = require('debug')('tonksDEV:routing'),
    debugM = require('debug')('tonksDEV:mongodb'),
    path = require('path'),
    express = require('express'),
    tonksDEVUser = require('../models/tonksdevUserModel.js');

var routes = function(moneyUIVars) {
    'use strict';

    var rootRouter = express.Router(),
        aytController = require('../controllers/aytController')(moneyUIVars);

    var rootDir = path.join(__dirname, '..', 'public');

    rootRouter.route('/')
        .get(function(req, res, next) {

            var sess = req.session;

            //increment pageview counter
            if (sess.pgviews) {
                sess.pgviews++;
            } else {
                sess.pgviews = 1;
            }

            //default the logged in user, but replace this if there is a user attached to the req object
            var loggedIn = false,
                loggedInUser = {displayName: 'not logged in'};

            if (req.user) {
                loggedIn = true;
                loggedInUser = req.user;
            }

            //NOT IN USE -- RETREIVE RECORDS FROM MONGO & SHOW ON-SCREEN
            //var query = transactions.find();
            // query.exec(function(err, results) {
            //     if (results) {
            //         debugM('found ' + results.length + ' record(s): ' + results);
            //     } else {
            //         debugM('errored whilst trying to retrieve record');
            //     }
            // });

            //render the index page
            res.render('index', { title: 'tonksDEV Money Home Page',
                                  pgViews: sess.pgviews,
                                  mongourl: moneyUIVars.mongourl,
                                  environment: moneyUIVars.environment,
                                  //data: results,
                                  //error: err,
                                  loggedIn: loggedIn,
                                  loggedInUser: loggedInUser
                                });
    });

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
        .get(aytController.ayt);

    return rootRouter;
};

module.exports = routes;
