$server
    .READ('model/exam')
    .query('generation', 2016)
    .query('grade', 2)
    .exec()
    .then(function(respond) {
        console.log(respond.getDocument());
    })
    .catch(function(err) {
        console.log(err);
    });

$server
    .READ('model/exam')
    .id('abcdefghijklmnopqrstuvwx')
    .exec()
    .then(function(respond) {
        console.log(respond.getDocument());
    })
    .catch(function(err) {
        console.log(err);
    });

$server
    .DELETE('model/exam')
    .id('abcdefghijklmnopqrstuvwx')
    .exec()
    .then(function(respond) {
        console.log(respond.getID());
    })
    .catch(function(err) {
        console.log(err);
    });

$server
    .UPDATE('model/exam')
    .id('abcdefghijklmnopqrstuvwx')
    .document({ foo: 'bar' })
    .exec()
    .then(function(respond) {
        console.log(respond.getID());
    })
    .catch(function(err) {
        console.log(err);
    });

$server
    .POST('login')
    .query('account', 'a@a.cc')
    .query('password', 'a7654321')
    .exec()
    .then(function() {
        window.location.href = '/';
    })
    .catch(function(err) {
        console.log(err);
    });

$server
    .POST('login')
    .form($('.login-form'))
    .exec()
    .then(function() {
        window.location.href = '/';
    })
    .catch(function(err) {
        console.log(err);
    });

    
// IMPORTANT
Promise.onPossiblyUnhandledRejection(function(reason, promise) {
    console.log(reason.message);
});

$server
    .POST('login')
    .form($('.login-form'))
    .exec()
    .then(function() {
        window.location.href = '/';
    }); // No catch here