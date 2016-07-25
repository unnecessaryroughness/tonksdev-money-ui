var debug = require('debug')('tonksDEV:routing'),
    debugM = require('debug')('tonksDEV:mongodb'),
    path = require('path'),
    express = require('express'),
    tonksDEVUser = require('../models/tonksdevUserModel.js'),
    callAPI = require('../common/callAPI');

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
              debug('req.user exists');
                loggedIn = true;
                loggedInUser = req.user;
            } else {
                debug('req.user does not exist');
            }

            //get all registered users
            callAPI(moneyUIVars.apiaddress + '/user/allusers', 'GET', null, null, function(err, response, data) {

                let allUsers = {
                    userList: [{'displayName': 'Could not retrieve users from database'}]
                };

                //check response
                if (!err && response.statusCode === 200) {
                    allUsers = JSON.parse(data);
                }

                //render the index page
                res.render('index', {
                    title: 'tonksDEV Money Home Page',
                    pgViews: sess.pgviews,
                    mongourl: moneyUIVars.mongourl,
                    environment: moneyUIVars.environment,
                    loggedIn: loggedIn,
                    loggedInUser: loggedInUser,
                    allUsers: allUsers
                });
            })

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
        .get(function(req, res, next) {
            aytController.aytData(function(err, data) {
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
            aytController.aytAPI(function(err, data) {
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
