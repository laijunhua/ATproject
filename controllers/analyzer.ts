import AnalyzeExecuter = require('../source/Analyzer/AnalyzeExecuter');


/*
 * Analyzer controller
 */
export function install() {
    var self = InputExam.prototype;

    framework.route('/analyzer/{analyzerName}/', self.analyze, ['xhr', 'get']);
}

class InputExam extends TotalJS.Controller {

    analyze(analyzerName: string) {
        var self = this;

        try {
            var analyzer = new AnalyzeExecuter();
            analyzer.setSignature(self.query);
            analyzer.addTask(analyzerName).onComplete((data) => self.json({ '$document': data }));
            analyzer.exec();

        } catch (e) {
            self.json({ '$error': e.message });
        }
    }
}