import User = require('../models/User');


/*
Controller for login
*/
export function install() {
    var self = Login.prototype;

    framework.route('#401', self.unauthorized);
    framework.route('/login', self.index);
    framework.route('/login', self.upload, ['*login/user', 'xhr', 'post']);
    //framework.route('/login', self.homepage, ['authorize', '@visitor', '@teacher', '@admin']);
}


class Login extends TotalJS.Controller {

    unauthorized() {
        var self = this;
        self.redirect('/login/');
    }

    index() {
        var self = this;
        self.view('index');
    }

    homepage() {
        var self = this;
        self.redirect('/');
    }

    upload() {
        var self = this;

        self.body.$workflow('find-user', null, ((err, user: User.IUser) => {
            if (err && err.hasError()) return self.json(err);
            
            // UId
            var period = self.body['remember'] ?
                <number>CONFIG('uid-period-remember') :
                <number>CONFIG('uid-period-normal');
            user.makeUId(period).save();

            self.res.cookie(CONFIG('uid-cookie'), user.uId, new Date().add('year', 2), { path: '/login', httponly: true });

            // Login
            self.session.isLogged = true;
            self.session.user = user;

            self.json(err);
        }));
    }
}


/*
 * Schema
 */
var group = SCHEMA('login');
var userSchema = group.add('user');

userSchema.define('account', String, true);
userSchema.define('password', String, true);
userSchema.define('remember', String);

userSchema.setValidation((name, value: string) => {
    switch (name) {
    case 'account':
        return (value || '').isEmail();
    case 'password':
        return (value || '').trim().length > 0;
    }
});

userSchema.addWorkflow('find-user', (error, model, helper, callback) => {
    error.resource('default', 'login_');

    User.findByAccount(model['account'], user => {
        if (user == null) {
            error.add('account', '@account_doesnt_exsist');
        } else if (!user.verifyPassword(model['password'])) {
            error.add('password', '@password_wrong');
        }
        if (callback) callback(user);
    });
});