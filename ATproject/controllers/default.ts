import AnalyzeExecuter = require('../source/Analyzer/AnalyzeExecuter');
import Exam = require("../models/Exam/Exam");
import ExamTable = require("../models/Exam/ExamTable");
import ExamTableColumnMeta = require("../models/Exam/ExamTableColumnMeta");
import ExamTableRow = require("../models/Exam/ExamTableRow");

export function install() {
    var self = Default.prototype;
    framework.route('/', self.view_homepage);
}

class Default extends TotalJS.Controller {

    view_homepage() {
        var self = this;

        /*var column = new ExamTableColumnMeta.model({
            title: 'CHINESE',
            subject: 'chinese',
            order: 0,
            passmark: 1500,
            auto: null
        });

        var table = new ExamTable.model({});

        table.columns.push(column);


        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 100 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 100 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 100 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 100 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 100 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 10000 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 10000 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 10000 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 10000 } }));
        table.rows.push(new ExamTableRow.model({ cell: { "chinese": 10000 } }));

        var exam = new Exam.model(null);
        exam.name = '期末考';
        exam.mainTable = table;

        exam.save();
        table.save();*/

        var analyzer = new AnalyzeExecuter();
        analyzer.setSignature({ examId: '55166d709e9399d82811513f', subject: 'chinese' });
        analyzer.addTask('grade-pass-rate').onComplete(data => {
            self.json(data);
        });

        analyzer.exec();

        self.json(self.session);

    }
}