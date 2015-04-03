import AnalyzeExecuter = require('./AnalyzeExecuter');
import GradeAverageAnalyzer = require('./implement/GradeAverageAnalyzer');
import GradePassRateAnalyzer = require('./implement/GradePassRateAnalyzer');

/*
 * Load analyzers
 */
class AnalyzerLoader {
    static Load() {
        AnalyzeExecuter.Register(new GradeAverageAnalyzer());
        AnalyzeExecuter.Register(new GradePassRateAnalyzer());
    }
}

export = AnalyzerLoader;