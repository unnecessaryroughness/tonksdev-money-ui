var passport = require('passport'),
    User = require('../models/tonksdevUserModel'),
    callAPI = require('../common/callAPI');

module.exports = function(moneyUI) {
    'use strict';

    moneyUI.app.use(passport.initialize());
    moneyUI.app.use(passport.session());

    //code to only store the user ID in the session, not the whole user object.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //code to return the full user object when supplied with the ID
    passport.deserializeUser(function(id, done) {
        callAPI(moneyUI.variables.apiaddress + '/user/' + id, 'GET', null, null, function(err, response, user) {
            done(err, JSON.parse(user).user);
        });
    });

    require('./strategies/google.strategy')(moneyUI);
    // require('./strategies/facebook.strategy')(moneyUI.app);
};
