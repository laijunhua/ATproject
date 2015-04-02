var AnalyzeExecuter = require('./AnalyzeExecuter');
var GradeAverageAnalyzer = require('./implement/GradeAverageAnalyzer');
var GradePassRateAnalyzer = require('./implement/GradePassRateAnalyzer');
/*
 * Load analyzers
 */
var AnalyzerLoader = (function () {
    function AnalyzerLoader() {
    }
    AnalyzerLoader.Load = function () {
        AnalyzeExecuter.Register(new GradeAverageAnalyzer());
        AnalyzeExecuter.Register(new GradePassRateAnalyzer());
    };
    return AnalyzerLoader;
})();
module.exports = AnalyzerLoader;
//# sourceMappingURL=AnalyzerLoader.js.map