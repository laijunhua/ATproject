var Exam = require('../../../models/Exam/Exam');
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
        Exam.model.findById(signature.examId).populate('mainTable').exec().then(function (exam) {
            if (!exam || !exam.mainTable)
                return callback('Cannot find exam table ' + signature.examId, null);
            var sum = 0;
            var count = 0;
            for (var i = 0, length = exam.mainTable.rows.length; i < length; i++) {
                var value = exam.mainTable.rows[i].cell[signature.subject];
                if ('number' === typeof value) {
                    sum += value;
                    count++;
                }
            }
            if (count !== 0) {
                data.average = sum / count;
            }
            callback(null, data);
        }).then(null, (function (error) {
            callback(error.message, null);
        }));
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