/// <reference path="../Scripts/typings/atproject.d.ts" />
import mongoose = require('mongoose');

var log4js = require('.\\log4js');
var logger = log4js.getLogger('model/User');


export interface IUser extends mongoose.Document {
    // field
    account: string;
    passhash: string;
    trueName: string;
    level: string;
    uId: string;
    uIdExpired: Date;
    cretationDate: Date;

    // method
    makeUId(expired: number): IUser;
    clearUId(): IUser;
    verifyPassword(password: string): boolean;
    setPassword(password: string): IUser;
}


/*
Model of user collection, verifying, updating and finding user database. 
*/
export var schema = new mongoose.Schema({
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
schema.method('makeUId', function (expired: number) {
    this.uId = framework.hash('sha1', this.account + this.passhash + Date.now());
    this.uIdExpired = new Date().add('day', expired);
    return this;
});


/*
* Clear UId
*/
schema.method('clearUId', function() {
    this.uId = '';
    this.uIdExpired = new Date();
    return this;
});


/*
* Verify incomming password with database
* password: should be the plaintext password
*/
schema.method('verifyPassword', function(password: string) {
    var hash = framework.hash('sha512', password);
    return hash === this.passhash;
});


/*
* Setting plaintext password
* password: should be the plaintext password
*/
schema.method('setPassword', function(password: string) {
    this.passhash = framework.hash('sha512', password);
    return this;
});


// Generate model and export
export var model = mongoose.model<IUser>('User', schema, 'User');


// -- Static --

/*
 * Access level 
 */
export var Level = {
    VISTOR: 'visitor',
    TEACHER: 'teacher',
    ADMIN: 'admin'
};


/*
* Search user in collection by account
* account: {String} search key
* callback: (user: {User}/{null})
*/
export function findByAccount(account: string, callback: (user: IUser) => void) {
    account = account.trim();

    model
        .findOne({ "account": account })
        .exec((err: Error, user: IUser) => {
            callback(user);
        })
        .then(null, logger.error);
};


/*
* Search user in collection by uId
* Verify uId validity by uIdExpried
* uId : {String} search key
* callback: 
	user: {User}/{null}
*/
export function findByUId(uId: string, callback: (user: IUser) => void) {
    uId = uId.trim();

    model
        .findOne({ "uId": uId })
        .exec((err: Error, user: IUser) => {
            if (user != null && user.uIdExpired < new Date()) {
                user = null;
            }
            callback(user);
        })
        .then(null, logger.error);
};