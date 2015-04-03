var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var User = require('../models/User');
var log4js = require('log4js');
var logger = log4js.getLogger('controller/register');
/*
Controller for register
*/
function install() {
    var self = Register.prototype;
    framework.route('/register', self.upload, ['*register/user', 'xhr', 'post']);
}
exports.install = install;
;
var Register = (function (_super) {
    __extends(Register, _super);
    function Register() {
        _super.apply(this, arguments);
    }
    Register.prototype.upload = function () {
        var self = this;
        self.body.$workflow('check-exist', null, (function (err) {
            if (err && err.hasError())
                return self.json(err);
            // create new user
            self.body.$save(function (error, user) {
                if (error && error.hasError())
                    return self.json(error);
                self.session.isLogged = true;
                self.session.user = user;
                self.json(error);
            });
        }));
    };
    return Register;
})(TotalJS.Controller);
/*
 * Schema
 */
var group = SCHEMA('register');
var userSchema = group.add('user');
userSchema.define('account', String, true);
userSchema.define('password', String, true);
userSchema.define('trueName', String, true);
userSchema.setValidation(function (name, value) {
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
userSchema.addWorkflow('check-exist', function (error, model, helper, callback) {
    error.resource('default', 'register_');
    User.findByAccount(model['account'], function (user) {
        if (user != null)
            error.add('account', '@account_exsist');
        if (callback)
            callback(user);
    });
});
userSchema.setSave((function (error, model, helper, callback) {
    error.resource('default', 'register_save_');
    var user = new User.model(model.$clean());
    user.level = User.Level.VISTOR;
    user.setPassword(model['password']);
    user.save(function (err, doc) {
        if (err)
            logger.error(err);
        if (!doc)
            error.add('', '@faild');
        callback(error, doc);
    });
}));
//# sourceMappingURL=register.js.map