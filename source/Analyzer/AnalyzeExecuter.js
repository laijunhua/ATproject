var AnalyzeTask = require('./AnalyzeTask');
/*
 * Execute analyze task automaticlly
 * */
var AnalyzeExecuter = (function () {
    function AnalyzeExecuter() {
        this._tasks = new Array();
        this._signature = {};
    }
    /*
     * Register a analyzer constructor
     * */
    AnalyzeExecuter.Register = function (analyzer) {
        AnalyzeExecuter._analyzers[analyzer.Name] = analyzer;
    };
    /*
     * Set a most detailed signature which will be send to each task
     */
    AnalyzeExecuter.prototype.setSignature = function (signature) {
        this._signature = signature;
    };
    /*
     * Add a new analyze task and return a wrapper
     */
    AnalyzeExecuter.prototype.addTask = function (analyzerName) {
        if (AnalyzeExecuter._analyzers[analyzerName] === undefined)
            throw new Error('Analyzer \'' + analyzerName + '\' is not provided');
        var task = new AnalyzeTask(AnalyzeExecuter._analyzers[analyzerName], this._signature);
        this._tasks.push(task);
        return task;
    };
    /*
     * Execute all task
     */
    AnalyzeExecuter.prototype.exec = function (callback) {
        var _this = this;
        if (this._tasks.length === 0) {
            if (callback)
                callback();
        }
        else {
            this._tasks.pop().exec(function () {
                _this.exec(callback);
            });
        }
    };
    /*
     * Store registerd analyzer by name
     * */
    AnalyzeExecuter._analyzers = {};
    return AnalyzeExecuter;
})();
module.exports = AnalyzeExecuter;
//# sourceMappingURL=AnalyzeExecuter.js.map