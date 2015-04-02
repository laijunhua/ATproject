import User = require('../models/User');

import log4js = require('log4js');
var logger = log4js.getLogger('controller/register');


/*
Controller for register
*/
export function install() {
    var self = Register.prototype;
    framework.route('/register', self.upload, ['*register/user', 'xhr', 'post']);
};


class Register extends TotalJS.Controller {

    upload() {
        var self = this;

        self.body.$workflow('check-exist', null, (err => {
            if (err && err.hasError()) return self.json(err);

            // create new user
            self.body.$save((error, user: User.IUser) => {
                if (error && error.hasError()) return self.json(error);

                self.session.isLogged = true;
                self.session.user = user;

                self.json(error);
            });
        }));
    }
}


/*
 * Schema
 */
var group = SCHEMA('register');
var userSchema = group.add('user');

userSchema.define('account', String, true);
userSchema.define('password', String, true);
userSchema.define('trueName', String, true);

userSchema.setValidation((name, value: string) => {
    switch (name) {
    case 'account':
        return (value || '').isEmail();
    case 'password':
        var length = (value || '').trim().length;
        return length >= 8 && length <= 32;
    case 'trueName':
        return (value || '').trim().length > 0;
    }
});

userSchema.addWorkflow('check-exist', (error, model, helper, callback) => {
    error.resource('default', 'register_');

    User.findByAccount(model['account'], user => {
        if (user != null)
            error.add('account', '@account_exsist');
        if (callback) callback(user);
    });
});

userSchema.setSave(((error, model, helper, callback) => {
    error.resource('default', 'register_save_');

    var user = new User.model(model.$clean());
    user.level = User.Level.VISTOR;
    user.setPassword(model['password']);
    user.save((err, doc) => {
        if (err) logger.error(err);
        if (!doc) error.add('', '@faild');
        callback(error, doc);
    });
}));