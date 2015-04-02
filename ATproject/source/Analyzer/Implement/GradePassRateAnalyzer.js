var Exam = require('../../../models/Exam/Exam');
var log4js = require('log4js');
var logger = log4js.getLogger('analyzer/GradeAverageAnalyzer');
/*
 * 合格率
 */
var GradePassRateAnalyzer = (function () {
    function GradePassRateAnalyzer() {
        /*
         * Name of analyzer
         */
        this.Name = 'grade-pass-rate';
        /*
         * Analyzer will be cache automaticlly if set it true
         */
        this.IsCacheable = true;
        /*
         * Arrary of string that declare which signatures were needed
         */
        this.NeedSignature = ['examId', 'subject'];
    }
    /*
     * Start actual analyzing
     */
    GradePassRateAnalyzer.prototype.Exec = function (signature, callback) {
        var data = new GradePassRateData();
        // Table
        Exam.model.findById(signature.examId).populate('mainTable').exec(function (exam) {
            if (!exam || !exam.mainTable)
                return callback(data);
            var passmark = exam.mainTable.findColumnBySubject(signature.subject).passmark;
            var pass_count = 0;
            var count = 0;
            for (var i = 0; i < exam.mainTable.rows.length; i++) {
                var value = exam.mainTable.rows[i].cell[signature.subject];
                if ('number' === typeof value) {
                    if (value >= passmark)
                        pass_count++;
                    count++;
                }
            }
            if (count === 0) {
                data.passrate = 0;
            }
            else {
                data.passrate = pass_count * 100 / count;
            }
            callback(data);
        }).then(null, logger.error);
    };
    return GradePassRateAnalyzer;
})();
var GradePassRateData = (function () {
    function GradePassRateData() {
    }
    return GradePassRateData;
})();
module.exports = GradePassRateAnalyzer;
//# sourceMappingURL=GradePassRateAnalyzer.js.map