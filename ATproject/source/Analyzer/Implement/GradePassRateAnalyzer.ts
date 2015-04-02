import Exam = require('../../../models/Exam/Exam');

import log4js = require('log4js');
var logger = log4js.getLogger('analyzer/GradeAverageAnalyzer');


/*
 * 合格率
 */
class GradePassRateAnalyzer implements IAnalyzer {

    /*
     * Name of analyzer
     */
    Name = 'grade-pass-rate';

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
        var data = new GradePassRateData();

        // Table
        Exam.model
            .findById(signature.examId)
            .populate('mainTable')
            .exec(exam => {

                if (!exam || !exam.mainTable) return callback(data);

                var passmark = exam.mainTable.findColumnBySubject(signature.subject).passmark;
                var pass_count = 0;
                var count = 0;

                // Pass Rate
                for (var i = 0; i < exam.mainTable.rows.length; i++) {
                    var value = exam.mainTable.rows[i].cell[signature.subject];
                    if ('number' === typeof value) {
                        if (value >= passmark) pass_count++;
                        count++;
                    }
                }

                if (count === 0) {
                    data.passrate = 0;
                } else {
                    data.passrate = pass_count * 100 / count;
                }
                callback(data);

            })
            .then(null, logger.error);
    }
}

export = GradePassRateAnalyzer;


class GradePassRateData {
    passrate: number;
}