var log4js = require('log4js');
var routeLogger = log4js.getLogger('route');


framework.on('controller', function(controller) {
    var req = controller.req;
    routeLogger.info(req._ip, req.method, req.uri.pathname, 'xhr:', req.xhr, 'query:', req.query);
});