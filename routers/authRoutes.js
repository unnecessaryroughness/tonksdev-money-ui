var express = require('express'),
    passport = require('passport');


var routes = function(moneyUIVars) {
    'use strict';

    var authRouter = express.Router();

    //handle request to sign-in with google
    authRouter.route('/google')
        .get(passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email']
            })
        );

    //handle callback following authentication by google
    authRouter.route('/google/callback')
        .get(passport.authenticate('google', {
                successRedirect: '/',
                failure: '/error/'
            })
        );

    //handle request to sign-in with facebook
    // authRouter.route('/facebook')
    //     .get(passport.authenticate('facebook', {
    //         scope: ['email', 'user_friends']
    //       })
    //     );
    //
    //handle callback following authentication by facebook
    // authRouter.route('/facebook/callback')
    //     .get(passport.authenticate('facebook', {
    //         successRedirect: '/',
    //         failure: '/error/'
    //       })
    //     );

    return authRouter;
};

module.exports = routes;
