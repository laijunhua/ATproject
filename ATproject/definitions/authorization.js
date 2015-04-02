var User = MODEL('User');

/*
Framework authorzation
*/
framework.onAuthorization = function (req, res, flags, next) {
    if (!req.session.isLogged || !req.session.user) return notAuthorized(req, next);
    
    // User has logged in
    flags || (flags = []);
    flags.push('@' + req.session.user.level);
    
    return next(true, req.session.user);
};

function notAuthorized(req, next) {
    // Try to login with uid
    var uId = req.cookie(CONFIG('uid-cookie')) || '';
    if (uId.length < 30) return next(false);

    User.findByUId(uId, function(user) {
        if (user == null) return next(false);

        req.session.isLogged = true;
        req.session.user = user;
        return next(true, user);
    });
}