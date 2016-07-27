var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    tonksDEVUser = require('../../models/tonksdevUserModel'),
    debug = require('debug')('tonksDEV:google-auth'),
    debugL = require('debug')('tonksDEV:google-auth:login-debugger'),
    callAPI = require('../../common/callAPI');

module.exports = function(moneyUI) {
    'use strict';

    var authCallBack = moneyUI.variables.g_callback;
    debugL ('using callback: ' + authCallBack);

    passport.use(new GoogleStrategy({
            clientID: '430969087731-a47i215viu0akr6g7vmvnuqkq0kqjpj8.apps.googleusercontent.com', //identifies this application
            clientSecret: 'zj9ucehT1939AEwwiT2zk7LA', //identifies this application
            callbackURL: authCallBack //where will Google send us back to after authenticating?
            },
            function(req, accessToken, refreshToken, profile, done) { //function to call after control comes back

                debugL('in the return function - about to call the API to look for a user matching the email returned');

                //query the API for a user record matching the Google user primary email address
                callAPI(moneyUI.variables.apiaddress + '/user/email/' + profile.emails[0].value, 'GET', null, null, function(err, response, data) {

                    debugL('found a user from the API');

                    let foundUser = (data && JSON.parse(data) && JSON.parse(data).user) ? JSON.parse(data).user : {};

                    if (foundUser && foundUser.email && foundUser.email === profile.emails[0].value) {
                        debug('found user in database - this is a returning user');
                        done(null, foundUser);
                    } else {
                        debug('did not find user in database - this is a new user - adding to database via API');
                        var g_user = {user: {}};
                        g_user.user.email = profile.emails[0].value;
                        g_user.user.image = profile._json.image.url;
                        g_user.user.displayName = profile.displayName;
                        g_user.user.google = {};
                        g_user.user.google.id = profile.id;
                        g_user.user.google.token = accessToken;

                        //call API to create user in back end
                        callAPI(moneyUI.variables.apiaddress + '/user', 'POST', g_user, null, function(err, response, data) {
                          done(null, data.user);
                        });
                    }
                });
            }
    ));
};
