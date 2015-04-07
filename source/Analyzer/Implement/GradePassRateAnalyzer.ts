import Exam = require('../../../models/Exam/Exam');


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
    Exec(signature: ISignature, callback: (error: string, data: any) => void) {
        var data = new GradePassRateData();

        // Table
        Exam.model
            .findById(signature.examId)
            .populate('mainTable')
            .exec()
            .then(exam => {

                if (!exam || !exam.mainTable) return callback('Cannot find table of exam ' + signature.examId, null);

                var passmark = exam.mainTable.findColumnBySubject(signature.subject).passmark;
                var pass_count = 0;
                var count = 0;

                // Pass Rate
                for (var i = 0, length = exam.mainTable.rows.length; i < length; i++) {
                    var value = exam.mainTable.rows[i].cell[signature.subject];
                    if ('number' === typeof value) {
                        if (value >= passmark) pass_count++;
                        count++;
                    }
                }

                if (count !== 0) {
                    data.passrate = pass_count * 100 / count;
                }
                callback(null, data);

            })
            .then(null, (error => {
                callback(error.message, null);
            }));
    }
}

export = GradePassRateAnalyzer;


class GradePassRateData {
    passrate: number;
}