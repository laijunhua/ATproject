/// <reference path="../../../Scripts/typings/client/jquery.d.ts" />
/*
 * Server API
 */
var $server;
(function ($server) {
    /*
     * Public Method
     */
    /*
     * HTTP GET
     */
    $server.GET = function (url) {
        return new ServerAction('GET', url);
    };
    /*
     * HTTP POST
     */
    $server.POST = function (url) {
        return new ServerAction('POST', url);
    };
    /*
     * MODEL - CREATE
     */
    $server.CREATE = function (url) {
        var action = new ServerAction('PUT', url);
        action.validate(function (respond) {
            return respond.getId() ? null : 'No ID contains in the respond of CREATE()';
        });
        return action;
    };
    /*
     * MODEL - READ
     */
    $server.READ = function (url) {
        var action = new ServerAction('GET', url);
        action.validate(function (respond) {
            return respond.getDocument() ? null : 'No Document contains in the respond of READ()';
        });
        return action;
    };
    /*
     * MODEL - UPDATE
     */
    $server.UPDATE = function (url) {
        var action = new ServerAction('POST', url);
        action.pre(function (action) {
            return action._id ? null : 'UPDATE() requires an ID';
        });
        action.validate(function (respond) {
            return respond.getId() ? null : 'No ID contains in the respond of UPDATE()';
        });
        return action;
    };
    /*
     * MODEL - DELETE
     */
    $server.DELETE = function (url) {
        var action = new ServerAction('DELETE', url);
        action.pre(function (action) {
            return action._id ? null : 'DELETE() requires an ID';
        });
        action.validate(function (respond) {
            return respond.getId() ? null : 'No ID contains in the respond of DELETE()';
        });
        return action;
    };
    /*
         * Class
         */
    /*
     * Server Requset Action
     */
    var ServerAction = (function () {
        function ServerAction(method, url) {
            this._data = {};
            this._method = method;
            this._url = url;
        }
        /*
         * Push a query data
         */
        ServerAction.prototype.query = function (name, value) {
            this._data[name] = value;
            return this;
        };
        /*
         * Add _id
         */
        ServerAction.prototype.id = function (id) {
            this._id = id;
            return this;
        };
        /*
         * Push a form into data
         */
        ServerAction.prototype.form = function (form) {
            this._data = form.serializeArray();
            return this;
        };
        /*
         * Push a complete document to data
         */
        ServerAction.prototype.document = function (doc) {
            this._data = doc;
            return this;
        };
        /*
         * Set a pre hook - emit before ajax
         */
        ServerAction.prototype.pre = function (callback) {
            this.pre_hook = callback;
            return this;
        };
        /*
         * Set a validate hook - emit after received
         */
        ServerAction.prototype.validate = function (callback) {
            this.validate_hook = callback;
            return this;
        };
        ServerAction.prototype.exec = function () {
            var _this = this;
            return new Promise((function (resolve, reject) {
                // invoke pre
                if (_this.pre_hook) {
                    var pre = _this.pre_hook(_this);
                    if (pre)
                        return reject(pre);
                }
                var url = _this._url;
                // build id
                if (_this._id) {
                    if (_this._id.length !== 24)
                        return reject('ID must be length of 24');
                    url = _this._url + '/' + _this._id;
                }
                // ajax
                $.ajax({
                    url: url,
                    type: _this._method,
                    dataType: 'json',
                    data: _this._data
                }).done(function (respond) {
                    // ErrorBuilder error
                    if (respond instanceof Array && respond.length > 0) {
                        return reject(respond[0].error);
                    }
                    // Server error
                    if (respond['$error']) {
                        return reject(respond['$error']);
                    }
                    // prepare respond
                    if (respond instanceof Array && respond.length === 0)
                        respond = {};
                    var body = new RespondBody(respond);
                    // invoke validate
                    if (_this.validate_hook) {
                        var validate = _this.validate_hook(body);
                        if (validate)
                            return reject(validate);
                    }
                    // fulfill
                    resolve(body);
                }).fail(function () {
                    // network error
                    return reject('Network is not working.');
                });
            }));
        };
        return ServerAction;
    })();
    /*
     * Server respond wrapper
     */
    var RespondBody = (function () {
        function RespondBody(respond) {
            this.respond = respond;
        }
        /*
         * Get operation result id
         */
        RespondBody.prototype.getId = function () {
            return this.respond['$id'];
        };
        /*
         * Get a respond document
         */
        RespondBody.prototype.getDocument = function () {
            return this.respond['$document'];
        };
        return RespondBody;
    })();
})($server || ($server = {}));
//# sourceMappingURL=server-api.js.map