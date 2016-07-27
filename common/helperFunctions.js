var debug = require('debug')('tonksDEV:money:ui:server:helpers'),
    debugT = require('debug')('tonksDEV:money:ui:term:handlers');

function helpers(moneyUI) {
    'use strict';

    var self = moneyUI;
    moneyUI.variables = {};

    //Set up server IP address and port # using env variables/defaults.
    var setupVariables = function() {
        moneyUI.variables.uiversion = '0.2.0';
        moneyUI.variables.ipaddress  = process.env.IP;
        moneyUI.variables.port       = process.env.PORT;
        moneyUI.variables.apiaddress = process.env.MONEYAPI_PORT_8081_TCP_ADDR + ':' + process.env.MONEYAPI_PORT_8081_TCP_PORT;
        moneyUI.variables.apiip      = process.env.MONEYAPI_PORT_8081_TCP_ADDR;
        moneyUI.variables.apiport    = process.env.MONEYAPI_PORT_8081_TCP_PORT;
        moneyUI.variables.mongourl   = process.env.MONEYSESSION_PORT_27017_TCP_ADDR+':'+process.env.MONEYSESSION_PORT_27017_TCP_PORT + '/session?authSource=admin';
        moneyUI.variables.secret     = process.env.SESSION_SECRET;
        moneyUI.variables.g_callback = process.env.GOOGLE_CALLBACK;
        moneyUI.variables.apikey     = process.env.API_KEY;
    };

    // terminator === the termination handler
    // Terminate server on receipt of the specified signal.
    // @param {string} sig  Signal to terminate on.
    var terminator = function(sig){
        if (typeof sig === 'string') {
           debugT('%s: Received %s - terminating tonksDEV Money app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        debugT('%s: Node server stopped.', Date(Date.now()) );
    };

    // Setup termination handlers (for exit and a list of signals).
    var setupTerminationHandlers = function(){

        //  Process on exit and signals.
        process.on('exit', function() { self.helperFunctions.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.helperFunctions.terminator(element); });
        });
    };

    //return a single object exposing all of the above functions
    return {
        setupVariables: setupVariables,
        terminator: terminator,
        setupTerminationHandlers: setupTerminationHandlers
    };
}

//expose the helpers function as the default entrypoint for this file.
module.exports = helpers;
