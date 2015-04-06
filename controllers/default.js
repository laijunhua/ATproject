var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Exam = require("../models/Exam/Exam");
var ExamTable = require("../models/Exam/ExamTable");
var ExamTableColumnMeta = require("../models/Exam/ExamTableColumnMeta");
var ExamTableRow = require("../models/Exam/ExamTableRow");
function install() {
    var self = Default.prototype;
    framework.route('/', self.view_homepage);
}
exports.install = install;
var Default = (function (_super) {
    __extends(Default, _super);
    function Default() {
        _super.apply(this, arguments);
    }
    Default.prototype.view_homepage = function () {
        var self = this;
        var column = new ExamTableColumnMeta.model({
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
        table.save();
        /*var analyzer = new AnalyzeExecuter();
        analyzer.setSignature({ examId: '55166d709e9399d82811513f', subject: 'chinese' });
        analyzer.addTask('grade-pass-rate').onComplete(data => {
            self.json(data);
        });

        analyzer.exec();*/
        self.json(self.session);
    };
    return Default;
})(TotalJS.Controller);
//# sourceMappingURL=default.js.map