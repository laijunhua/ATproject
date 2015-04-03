/*
Driven for mongoose
*/

var mongoose = require('.\\mongoose');
var log4js = require('.\\log4js');
var logger = log4js.getLogger('mongoose');

var url = CONFIG('database-url');
mongoose.connect(url);

mongoose.connection.on('error', function() {
    setTimeout(function() {
        if (!mongoose.connection._hasOpened) {
            mongoose.connect(url);
        }
    }, CONFIG('database-reconnect'));
    logger.fatal('Faild to connect to database', ' url:', url);
});

mongoose.connection.on('open', function() {
    logger.info('Connect to database correctly', ' url:', url);
});

mongoose.connection.on('disconnected', function() {
    logger.error('Disconnected database');
});

mongoose.connection.on('reconnected', function() {
    logger.info('Reconnected database');
});

mongoose.connection.on('close', function() {
    logger.info('Closed database');
});

module.exports = mongoose;