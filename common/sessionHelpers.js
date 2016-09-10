const helper = function() {

  const userIsLoggedIn = function(req) {
    if (typeof req !== 'undefined' &&
        typeof req.session != 'undefined' &&
        typeof req.session.passport != 'undefined' &&
        typeof req.session.passport.user != 'undefined') {
        
        console.log("logged IN")
        return true;
    } else {
        console.log("logged OUT")
        return false;
    }
  }

  return {
    userIsLoggedIn: userIsLoggedIn
  }
}

module.exports = helper;
