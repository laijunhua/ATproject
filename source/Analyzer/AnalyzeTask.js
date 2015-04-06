var AnalyzerCache = require('../../models/Analyzer/AnalyzerCache');
/*
 * Task wrapper that cache the analyze result and manage analyzer
 */
var AnalyzeTask = (function () {
    function AnalyzeTask(analyzer, signature) {
        this._signature = this.filterSignature(analyzer, signature);
        this._analyzer = analyzer;
        this._signature = signature;
    }
    /*
     * 过滤分析器声明所需的签名
     */
    AnalyzeTask.prototype.filterSignature = function (analyzer, signature) {
        var sig = {};
        for (var i = 0; i < analyzer.NeedSignature.length; i++) {
            var path = analyzer.NeedSignature[i];
            if (signature[path] === undefined)
                throw new Error('Signature \'' + path + '\' should be provided');
            sig[path] = signature[path];
        }
        return sig;
    };
    /*
     * Callback when finished analyzing
     */
    AnalyzeTask.prototype.onComplete = function (callback) {
        this._complete = callback;
    };
    /*
     * Load cache or start analyzing
     */
    AnalyzeTask.prototype.exec = function (callback) {
        var _this = this;
        AnalyzerCache.findOne(this._analyzer.Name, this._signature, function (cache) {
            // Load cache
            if (cache != null) {
                _this._complete(null, cache.data);
                return callback();
            }
            // Actually start analyzing
            _this._analyzer.Exec(_this._signature, function (error, analyzedData) {
                if (analyzedData && _this._analyzer.IsCacheable)
                    _this.cacheData(analyzedData);
                _this._complete(error, analyzedData);
                callback();
            });
        });
    };
    /*
     * Push data to cache database
     */
    AnalyzeTask.prototype.cacheData = function (analyzedData) {
        var cache = new AnalyzerCache.model(null);
        cache.analyzer = this._analyzer.Name;
        cache.signature = this._signature;
        cache.data = analyzedData;
        cache.save();
    };
    return AnalyzeTask;
})();
module.exports = AnalyzeTask;
//# sourceMappingURL=AnalyzeTask.js.map