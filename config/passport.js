var passport = require('passport'),
    User = require('../models/tonksdevUserModel'),
    callAPI = require('../common/callAPI');

module.exports = function(moneyUI) {
    'use strict';

    moneyUI.app.use(passport.initialize());
    moneyUI.app.use(passport.session());

    //code to only store the user ID in the session, not the whole user object.
    passport.serializeUser(function(user, done) {
        if (user && user.id) {
          done(null, user.id);
        } else {
          done({error: response.statusCode, message: 'error retrieving user'}, 0);
        }
    });

    //code to return the full user object when supplied with the ID
    passport.deserializeUser(function(id, done) {
        callAPI(moneyUI.variables.apiaddress + '/user/' + id, 'GET', null, {userid: moneyUI.variables.systemacc}, function(err, response, user) {
            if (response.statusCode !== 200) {
              done({error: response.statusCode, message: 'error retrieving user'}, {displayName: 'unknown'});
            } else {
              done(err, JSON.parse(user).user);
            }
        });
    });

    require('./strategies/google.strategy')(moneyUI);
    // require('./strategies/facebook.strategy')(moneyUI.app);
};
