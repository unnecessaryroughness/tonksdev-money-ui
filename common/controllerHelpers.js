var errorController = require('../controllers/errorController');

const helper = function() {

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
        envRes.redirect(envRes.redirectBackTo || 'back');
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
