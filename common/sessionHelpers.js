const helper = function() {

  const userIsLoggedIn = function(req) {
    if (typeof req !== 'undefined' &&
        typeof req.session != 'undefined' &&
        typeof req.session.passport != 'undefined' &&
        typeof req.session.passport.user != 'undefined') {
        return true;
    } else {
        return false;
    }
  }

  return {
    userIsLoggedIn: userIsLoggedIn
  }
}

module.exports = helper();
