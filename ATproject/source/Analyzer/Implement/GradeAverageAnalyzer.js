var Exam = require('../../../models/Exam/Exam');
var log4js = require('log4js');
var logger = log4js.getLogger('analyzer/GradeAverageAnalyzer');
/*
 * Average mark of a subject in one exam
 */
var GradeAverageAnalyzer = (function () {
    function GradeAverageAnalyzer() {
        /*
         * Name of analyzer
         */
        this.Name = 'grade-average';
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
    GradeAverageAnalyzer.prototype.Exec = function (signature, callback) {
        var data = new GradeAverageData();
        // Table
        Exam.model.findById(signature.examId).populate('mainTable').exec(function (exam) {
            if (!exam || !exam.mainTable)
                return callback(data);
            var sum = 0;
            var count = 0;
            for (var row in exam.mainTable.rows) {
                var value = row.cell[signature.subject];
                if ('number' === typeof value) {
                    sum += value;
                    count++;
                }
            }
            if (count === 0) {
                data.average = 0;
            }
            else {
                data.average = sum / count;
            }
            callback(data);
        }).then(null, logger.error);
    };
    return GradeAverageAnalyzer;
})();
var GradeAverageData = (function () {
    function GradeAverageData() {
    }
    return GradeAverageData;
})();
module.exports = GradeAverageAnalyzer;
//# sourceMappingURL=GradeAverageAnalyzer.js.map