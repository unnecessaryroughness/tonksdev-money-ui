var express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    path         = require('path'),
    debug        = require('debug')('tonksDEV:money:ui:server'),
    session      = require('express-session'),
    mongoose     = require('mongoose'),
    mongoStore   = require('connect-mongo')(session),
    errorController = require('../controllers/errorController');

//Define the application object
var moneyUI = function() {
    'use strict';

    var self = this;
    self.helperFunctions = require('./helperFunctions')(self);

    //Initialize the server (express)
    self.initializeServer = function() {

        //setup the web server app
            self.app = express();
            self.app.use(bodyParser.urlencoded({extended:true}));
            self.app.use(bodyParser.json());
            self.app.use(cookieParser());
            self.app.use(express.static('public'));
            self.app.set('trust proxy', 1);
            self.variables.environment = self.app.get('env');
            self.app.use(session({
                            secret: self.variables.secret,
                            store: new mongoStore({mongooseConnection: mongoose.connection}),
                            resave: false,
                            saveUninitialized: false,
                            cookie: { httpOnly: true,
                                      secure: (self.variables.environment === 'development') ? false : false }
                        }));

            require('../config/passport')(self);

        //set up connection to mongodb
            self.mongoose = mongoose;

            mongoose.connection.on('open', function() {
                debug('Connected to Mongo server');
            });

            mongoose.connection.on('error', function(err) {
                debug('Could not connect to Mongo server');
                debug(err);
            });

            self.mongoose.connect(self.variables.mongourl);
            debug('connecting to database: ' + self.variables.mongourl);

        //setup the view engine
            self.app.set('views', path.join(__dirname, '../views'));
            self.app.set('view engine', 'ejs');

        //use predefined routers
            var ajaxRouter = require('../routers/ajaxRoutes')(self.variables);
            var authRouter = require('../routers/authRoutes')(self.variables);
            var rootRouter = require('../routers/rootRoutes')(self.variables);
            var setupRouter = require('../routers/setupRoutes')(self.variables);
            var regRouter = require('../routers/regRoutes')(self.variables);
            var transRouter = require('../routers/transRoutes')(self.variables);
            self.app.use('/', rootRouter);
            self.app.use('/ajax', ajaxRouter);
            self.app.use('/auth', authRouter);
            self.app.use('/setup', setupRouter);
            self.app.use('/account/register', regRouter);
            self.app.use('/account/transaction', transRouter);

        //default route error handler - did not find a matching route - throw 404
            self.app.use(function(req, res, next) {
                debug('UI-ERROR: failed to match a route... this is the default route error handler -> ' + req.url);
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
            });

        debug('environment: ' + self.variables.environment);

        //development error handler - show stack trace
            if (self.variables.environment === 'development') {
                self.app.use(function(err, req, res, next) {
                    debug('UI-ERROR (DEV): ' + err.error + ': ' + err.message, JSON.stringify(err));
                    res.status(err.status || 500);
                    errorController.getErrorPageData(self.variables, req.session, req.user, req.params,
                                      {'error' : {'error': err.status || 500, 'message': err.message}}, function(err, errorData) {
                        res.render('error', errorData);
                    })
                });
            }

        //production error handler - hide stack trace
            self.app.use(function(err, req, res, next) {
                debug('UI-ERROR: ' + err.error + ': ' + err.message);
                res.status(err.status || 500);
                errorController.getErrorPageData(self.variables, req.session, req.user, req.params,
                                  {'error' : {'error': err.status || 500, 'message': 'Ooops. This is a little embarrasing.'}}, function(err, errorData) {
                    res.render('error', errorData);
                })
            });
    };


    //Perform application setup functions
    self.initialize = function() {
        debug('setting up variables...');
        self.helperFunctions.setupVariables();

        debug('setting up termination handlers...');
        self.helperFunctions.setupTerminationHandlers();

        debug('initializing server...');
        self.initializeServer();
    };

    //Start the server (starts up the sample application).
    self.start = function() {
        debug('attempting to start server on %s:%d', self.variables.ipaddress, self.variables.port);

        self.server = self.app.listen(self.variables.port, self.variables.ipaddress, function() {
            debug('%s: tonksDEV Money Node server started on %s:%d ...',
                        Date(Date.now() ), self.variables.ipaddress, self.variables.port);
        });
    };

    self.stop = function() {
      self.server.close();
    }
};

module.exports = moneyUI;
