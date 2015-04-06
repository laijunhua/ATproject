var Exam = require('../../../models/Exam/Exam');
var AnalyzeExecuter = require("../AnalyzeExecuter");
var log4js = require('log4js');
var logger = log4js.getLogger('analyzer/ClassAverageAnalyzer');
/*
 * Average mark of a subject in one exam
 */
var ClassAverageAnalyzer = (function () {
    function ClassAverageAnalyzer() {
        /*
         * Name of analyzer
         */
        this.Name = 'class-average';
        /*
         * Analyzer will be cache automaticlly if set it true
         */
        this.IsCacheable = true;
        /*
         * Arrary of string that declare which signatures were needed
         */
        this.NeedSignature = ['examId', 'subject', 'classID'];
    }
    /*
     * Start actual analyzing
     */
    ClassAverageAnalyzer.prototype.Exec = function (signature, callback) {
        var data = new ClassAverageData();
        var analyzer = new AnalyzeExecuter();
        analyzer.setSignature({ examID: signature.examId, subject: signature.subject, classID: signature.classId });
        analyzer.addTask('students-of-class').onComplete(function (data) {
        });
        analyzer.exec();
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
            if (count !== 0) {
                data.average = sum / count;
            }
            callback(data);
        }).then(null, logger.error);
    };
    return ClassAverageAnalyzer;
})();
var ClassAverageData = (function () {
    function ClassAverageData() {
    }
    return ClassAverageData;
})();
module.exports = ClassAverageAnalyzer;
//# sourceMappingURL=ClassAverageAnalyzer.js.map