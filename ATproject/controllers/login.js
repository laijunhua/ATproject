var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var User = require('../models/User');
/*
Controller for login
*/
function install() {
    var self = Login.prototype;
    framework.route('#401', self.unauthorized);
    framework.route('/login', self.index);
    framework.route('/login', self.upload, ['*login/user', 'xhr', 'post']);
    //framework.route('/login', self.homepage, ['authorize', '@visitor', '@teacher', '@admin']);
}
exports.install = install;
var Login = (function (_super) {
    __extends(Login, _super);
    function Login() {
        _super.apply(this, arguments);
    }
    Login.prototype.unauthorized = function () {
        var self = this;
        self.redirect('/login/');
    };
    Login.prototype.index = function () {
        var self = this;
        self.view('index');
    };
    Login.prototype.homepage = function () {
        var self = this;
        self.redirect('/');
    };
    Login.prototype.upload = function () {
        var self = this;
        self.body.$workflow('find-user', null, (function (err, user) {
            if (err && err.hasError())
                return self.json(err);
            // UId
            var expired = self.body['remember'] ? CONFIG('uid-period-remember') : CONFIG('uid-period-normal');
            user.makeUId(expired).save();
            self.res.cookie(CONFIG('uid-cookie'), user.uId, new Date().add('year', 2), { path: '/login', httponly: true });
            // Login
            self.session.isLogged = true;
            self.session.user = user;
            self.json(err);
        }));
    };
    return Login;
})(TotalJS.Controller);
/*
 * Schema
 */
var group = SCHEMA('login');
var userSchema = group.add('user');
userSchema.define('account', String, true);
userSchema.define('password', String, true);
userSchema.define('remember', String);
userSchema.setValidation(function (name, value) {
    switch (name) {
        case 'account':
            return (value || '').isEmail();
        case 'password':
            return (value || '').trim().length > 0;
    }
});
userSchema.addWorkflow('find-user', function (error, model, helper, callback) {
    error.resource('default', 'login_');
    User.findByAccount(model['account'], function (user) {
        if (user == null) {
            error.add('account', '@account_doesnt_exsist');
        }
        else if (!user.verifyPassword(model['password'])) {
            error.add('password', '@password_wrong');
        }
        if (callback)
            callback(user);
    });
});
//# sourceMappingURL=login.js.map