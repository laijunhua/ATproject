/*
 * Server API
 */

var $server = {};


/*
 * Server requset excutor
 */
$server.Action = function () {
    this.id = '';
    this.data = {};
    this.method = 'GET';
    this.url = '';
}

/*
 * Push data into request
 */
$server.Action.prototype.push = function(name, value) {
    this.data[name] = value;
    return this;
}

/*
 * Set specific id of request, blocking requeset data after set
 */
$server.Action.prototype.id = function (id) {
    this.id = id;
    return this;
}