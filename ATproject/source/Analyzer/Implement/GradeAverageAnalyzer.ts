import Exam = require('../../../models/Exam/Exam');

import log4js = require('log4js');
var logger = log4js.getLogger('analyzer/GradeAverageAnalyzer');


/*
 * Average mark of a subject in one exam
 */
class GradeAverageAnalyzer implements IAnalyzer {

    /*
     * Name of analyzer
     */
    Name = 'grade-average';

    /*
     * Analyzer will be cache automaticlly if set it true
     */
    IsCacheable = true;

    /*
     * Arrary of string that declare which signatures were needed 
     */
    NeedSignature = ['examId', 'subject'];

    /*
     * Start actual analyzing
     */
    Exec(signature: ISignature, callback: (data: any) => void) {
        var data = new GradeAverageData();

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

                if (count === 0) {
                    data.average = 0;
                } else {
                    data.average = sum / count;
                }
                callback(data);

            })
            .then(null, logger.error);
    }
}

export = GradeAverageAnalyzer;


class GradeAverageData {
    average: number;
}