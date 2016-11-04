var errorController = require('../controllers/errorController');

const helper = function() {

  const route = function(ctrlMethod, envVars, envReq, envRes) {
    ctrlMethod(envVars, envReq.session, envReq.user, envReq.params, envReq.body, function(err, rtnData) {
      if (!err) {
        envRes.redirect('back');
      } else {
        errorController.getErrorPageData(envVars, envReq.session, envReq.user, envReq.params, {'error': err}, function(cErr, errorData) {
            envRes.status(err.statusCode || 500).render('error', errorData);
        })
      }
    });
  }

  return {
    route: route
  }
}

module.exports = helper();
