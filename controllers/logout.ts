/*
Controller for logout
*/


export function install() {
    var self = Logout.prototype;

    framework.route('/logout', self.logout, ['authorize', '@visitor', '@teacher', '@admin']);
}

class Logout extends TotalJS.Controller {

    logout() {
        var self = this;

        self.session.isLogged = false;
        self.session.user = null;
        self.res.cookie(CONFIG('uid-cookie'), '', new Date(), { path: '/login', httponly: true });

        self.redirect('/');
    }
}