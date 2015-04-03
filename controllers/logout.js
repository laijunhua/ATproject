/*
Controller for logout
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function install() {
    var self = Logout.prototype;
    framework.route('/logout', self.logout, ['authorize', '@visitor', '@teacher', '@admin']);
}
exports.install = install;
var Logout = (function (_super) {
    __extends(Logout, _super);
    function Logout() {
        _super.apply(this, arguments);
    }
    Logout.prototype.logout = function () {
        var self = this;
        self.session.isLogged = false;
        self.session.user = null;
        self.res.cookie(CONFIG('uid-cookie'), '', new Date(), { path: '/login', httponly: true });
        self.redirect('/');
    };
    return Logout;
})(TotalJS.Controller);
//# sourceMappingURL=logout.js.map