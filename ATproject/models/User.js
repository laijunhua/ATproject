/// <reference path="../Scripts/typings/atproject.d.ts" />
var mongoose = require('mongoose');
var log4js = require('.\\log4js');
var logger = log4js.getLogger('model/User');
/*
Model of user collection, verifying, updating and finding user database.
*/
exports.schema = new mongoose.Schema({
    account: { type: String, default: '', index: { unique: true } },
    passhash: { type: String, default: '' },
    trueName: { type: String, default: '' },
    level: { type: String, default: 'visitor' },
    uId: { type: String, default: '', index: { unique: false } },
    uIdExpired: { type: Date, default: Date.now() },
    cretationDate: { type: Date, default: Date.now() }
});
/*
* Build new UId and expiry time
*/
exports.schema.method('makeUId', function (expired) {
    this.uId = framework.hash('sha1', this.account + this.passhash + Date.now());
    this.uIdExpired = new Date().add('day', expired);
    return this;
});
/*
* Clear UId
*/
exports.schema.method('clearUId', function () {
    this.uId = '';
    this.uIdExpired = new Date();
    return this;
});
/*
* Verify incomming password with database
* password: should be the plaintext password
*/
exports.schema.method('verifyPassword', function (password) {
    var hash = framework.hash('sha512', password);
    return hash === this.passhash;
});
/*
* Setting plaintext password
* password: should be the plaintext password
*/
exports.schema.method('setPassword', function (password) {
    this.passhash = framework.hash('sha512', password);
    return this;
});
// Generate model and export
exports.model = mongoose.model('User', exports.schema, 'User');
// -- Static --
/*
 * Access level
 */
exports.Level = {
    VISTOR: 'visitor',
    TEACHER: 'teacher',
    ADMIN: 'admin'
};
/*
* Search user in collection by account
* account: {String} search key
* callback: (user: {User}/{null})
*/
function findByAccount(account, callback) {
    account = account.trim();
    exports.model.findOne({ "account": account }).exec(function (err, user) {
        callback(user);
    }).then(null, logger.error);
}
exports.findByAccount = findByAccount;
;
/*
* Search user in collection by uId
* Verify uId validity by uIdExpried
* uId : {String} search key
* callback:
    user: {User}/{null}
*/
function findByUId(uId, callback) {
    uId = uId.trim();
    exports.model.findOne({ "uId": uId }).exec(function (err, user) {
        if (user != null && user.uIdExpired < new Date()) {
            user = null;
        }
        callback(user);
    }).then(null, logger.error);
}
exports.findByUId = findByUId;
;
//# sourceMappingURL=User.js.map