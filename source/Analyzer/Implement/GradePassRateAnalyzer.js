var Exam = require('../../../models/Exam/Exam');
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
        Exam.model.findById(signature.examId).populate('mainTable').exec().then(function (exam) {
            if (!exam || !exam.mainTable)
                return callback('Cannot find table of exam ' + signature.examId, null);
            var passmark = exam.mainTable.findColumnBySubject(signature.subject).passmark;
            var pass_count = 0;
            var count = 0;
            for (var i = 0, length = exam.mainTable.rows.length; i < length; i++) {
                var value = exam.mainTable.rows[i].cell[signature.subject];
                if ('number' === typeof value) {
                    if (value >= passmark)
                        pass_count++;
                    count++;
                }
            }
            if (count !== 0) {
                data.passrate = pass_count * 100 / count;
            }
            callback(null, data);
        }).then(null, (function (error) {
            callback(error.message, null);
        }));
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