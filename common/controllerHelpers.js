var errorController = require('../controllers/errorController');

const helper = function() {
  'use strict';

  const routeGet = function(ctrlMethod, envVars, envReq, envRes, viewUrl) {
    ctrlMethod(envVars, envReq.session, envReq.user, envReq.params, envReq.body, function(err, pageData) {
      if (!err) {
        envRes.render(viewUrl, pageData);
      } else {
        errorController.getErrorPageData(envVars, envReq.session, envReq.user, envReq.params, {'error': err}, function(cErr, errorData) {
            envRes.status(err.error || 500).render('error', errorData);
        })
      }
    });
  }

  const routePost = function(ctrlMethod, envVars, envReq, envRes) {
    ctrlMethod(envVars, envReq.session, envReq.user, envReq.params, envReq.body, function(err, rtnData) {
      if (!err) {
        let rbt = envRes.redirectBackTo || 'back';

        //if any substitution params are defined, iterate over them replacing placeholders with values
        if (envRes.redirectBackToParams) {
          envRes.redirectBackToParams.forEach(function(val, idx, arr) {

            //split object into an array & build rtnData[obj][obj][obj]
            let rarr = val.value.split(".");
            let rval = rtnData;
            rarr.forEach(function(val, idx) {
              rval = rval[val];
            })

            //replace placeholders with corresponding defined values
            let re = new RegExp("@" + val.name + "@", "g");
            rbt = rbt.replace(re, rval);
          })
        }
        envRes.redirect(rbt);
      } else {
        errorController.getErrorPageData(envVars, envReq.session, envReq.user, envReq.params, {'error': err}, function(cErr, errorData) {
            envRes.status(err.error || 500).render('error', errorData);
        })
      }
    });
  }

  const routeError = function(envVars, envReq, envRes, errCode, errMsg) {
    errorController.getErrorPageData(envVars, envReq.session, envReq.user, envReq.params, {'error' : {'error': errCode, 'message': errMsg}}, function(cErr, errorData) {
        envRes.status(errCode || 500).render('error', errorData);
    });
  }


  return {
    routeGet: routeGet,
    routePost: routePost,
    routeError: routeError
  }
}

module.exports = helper();
