var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnalyzeExecuter = require('../source/Analyzer/AnalyzeExecuter');
/*
 * Analyzer controller
 */
function install() {
    var self = InputExam.prototype;
    framework.route('/analyzer/{analyzerName}/', self.analyze, ['xhr', 'get']);
}
exports.install = install;
var InputExam = (function (_super) {
    __extends(InputExam, _super);
    function InputExam() {
        _super.apply(this, arguments);
    }
    InputExam.prototype.analyze = function (analyzerName) {
        var self = this;
        try {
            var analyzer = new AnalyzeExecuter();
            analyzer.setSignature(self.query);
            analyzer.addTask(analyzerName).onComplete(function (error, data) {
                if (error)
                    return self.json({ '$error': error });
                self.json({ '$document': data });
            });
            analyzer.exec();
        }
        catch (e) {
            self.json({ '$error': e.message });
        }
    };
    return InputExam;
})(TotalJS.Controller);
//# sourceMappingURL=analyzer.js.map