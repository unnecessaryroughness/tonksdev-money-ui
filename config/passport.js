var passport = require('passport'),
    User = require('../models/tonksdevUserModel');

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
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    require('./strategies/google.strategy')(moneyUI);
    // require('./strategies/facebook.strategy')(moneyUI.app);
};
