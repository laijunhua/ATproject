/// <reference path="../../../Scripts/typings/client/jquery.d.ts" />

/*
 * Server API
 */
module $server {


    /*
     * Public Method
     */


    /*
     * HTTP GET
     */
    export var GET = (url: string): ServerAction => {
        return new ServerAction('GET', url);
    };


    /*
     * HTTP POST
     */
    export var POST = (url: string): ServerAction => {
        return new ServerAction('POST', url);
    };


    /*
     * MODEL - CREATE
     */
    export var CREATE = (url: string): ServerAction => {
        var action = new ServerAction('PUT', url);

        action.validate((respond) => {
            return respond.getId() ? null : 'No ID contains in the respond of CREATE()';
        });

        return action;
    };


    /*
     * MODEL - READ
     */
    export var READ = (url: string): ServerAction => {
        var action = new ServerAction('GET', url);

        action.validate((respond) => {
            return respond.getDocument() ? null : 'No Document contains in the respond of READ()';
        });

        return action;
    };


    /*
     * MODEL - UPDATE
     */
    export var UPDATE = (url: string): ServerAction => {
        var action = new ServerAction('POST', url);

        action.pre((action) => {
            return action._id ? null : 'UPDATE() requires an ID';
        });

        action.validate((respond) => {
            return respond.getId() ? null : 'No ID contains in the respond of UPDATE()';
        });

        return action;
    };


    /*
     * MODEL - DELETE
     */
    export var DELETE = (url: string): ServerAction => {
        var action = new ServerAction('DELETE', url);

        action.pre((action) => {
            return action._id ? null : 'DELETE() requires an ID';
        });

        action.validate((respond) => {
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
    class ServerAction {

        // field
        _method: string;
        _url: string;
        _id: string;
        _data = {};

        // hook
        pre_hook: (action: ServerAction) => string;
        validate_hook: (respond: RespondBody) => string;


        constructor(method: string, url: string) {
            this._method = method;
            this._url = url;
        }


        /*
         * Push a query data
         */
        query(name: string, value: any): ServerAction {
            this._data[name] = value;
            return this;
        }


        /*
         * Add _id
         */
        id(id: string): ServerAction {
            this._id = id;
            return this;
        }


        /*
         * Push a form into data
         */
        form(form: JQuery): ServerAction {
            this._data = form.serializeArray();
            return this;
        }


        /*
         * Push a complete document to data
         */
        document(doc: Object): ServerAction {
            this._data = doc;
            return this;
        }


        /*
         * Set a pre hook - emit before ajax
         */
        pre(callback: (action: ServerAction) => string): ServerAction {
            this.pre_hook = callback;
            return this;
        }


        /*
         * Set a validate hook - emit after received 
         */
        validate(callback: (respond: RespondBody) => string): ServerAction {
            this.validate_hook = callback;
            return this;
        }


        exec(): Promise<RespondBody> {

            return new Promise<RespondBody>(((resolve, reject: (reason: string) => void) => {

                // invoke pre
                if (this.pre_hook) {
                    var pre = this.pre_hook(this);
                    if (pre) return reject(pre);
                }

                var url = this._url;
                // build id
                if (this._id) {
                    if (this._id.length !== 24)
                        return reject('ID must be length of 24');
                    url = this._url + '/' + this._id;
                }

                // ajax
                $.ajax({
                        url: url,
                        type: this._method,
                        dataType: 'json',
                        data: this._data
                    })
                    .done((respond) => {

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
                        if (this.validate_hook) {
                            var validate = this.validate_hook(body);
                            if (validate) return reject(validate);
                        }

                        // fulfill
                        resolve(body);

                    })
                    .fail(() => {
                        // network error
                        return reject('Network is not working.');
                    });
            }));


        }
    }


    /*
     * Server respond wrapper
     */
    class RespondBody {

        respond: Object;

        constructor(respond: Object) {
            this.respond = respond;
        }


        /*
         * Get operation result id
         */
        getId(): string {
            return this.respond['$id'];
        }


        /*
         * Get a respond document
         */
        getDocument(): Object {
            return this.respond['$document'];
        }
    }
}