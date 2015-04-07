import Exam = require('../../../models/Exam/Exam');


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
    Exec(signature: ISignature, callback: (error: string, data: any) => void) {
        var data = new GradeAverageData();

        // Table
        Exam.model
            .findById(signature.examId)
            .populate('mainTable')
            .exec()
            .then(exam => {

                if (!exam || !exam.mainTable) return callback('Cannot find exam table ' + signature.examId, null);

                var sum = 0;
                var count = 0;

                // Average
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

            })
            .then(null, (error => {
                callback(error.message, null);
            }));
    }
}

export = GradeAverageAnalyzer;


class GradeAverageData {
    average: number;
}