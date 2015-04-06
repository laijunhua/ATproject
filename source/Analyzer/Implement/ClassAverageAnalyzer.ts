import Exam = require('../../../models/Exam/Exam');
import AnalyzeExecuter = require("../AnalyzeExecuter");


import log4js = require('log4js');
var logger = log4js.getLogger('analyzer/ClassAverageAnalyzer');


/*
 * Average mark of a subject in one exam
 */
class ClassAverageAnalyzer implements IAnalyzer {

    /*
     * Name of analyzer
     */
    Name = 'class-average';

    /*
     * Analyzer will be cache automaticlly if set it true
     */
    IsCacheable = true;

    /*
     * Arrary of string that declare which signatures were needed 
     */
    NeedSignature = ['examId', 'subject','classID'];

    /*
     * Start actual analyzing
     */
    Exec(signature: ISignature, callback: (data: any) => void) {
        var data = new ClassAverageData();









        var analyzer = new AnalyzeExecuter();
        analyzer.setSignature({ examID: signature.examId, subject: signature.subject,classID:signature.classId });
        analyzer.addTask('students-of-class').onComplete(data => {
            
        });

        analyzer.exec();














        // Table
        Exam.model
            .findById(signature.examId)
            .populate('mainTable')
            .exec((exam) => {

            if (!exam || !exam.mainTable) return callback(data);

            var sum = 0;
            var count = 0;

            // Average
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

        })
            .then(null, logger.error);
    }
}

export = ClassAverageAnalyzer;


class ClassAverageData {
    average: number;
}