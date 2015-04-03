var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Exam = require('../../models/Exam/Exam');
var log4js = require('log4js');
var logger = log4js.getLogger('controller/exam');
/*
Contorller for upload exam
*/
function install() {
    var self = InputExam.prototype;
    framework.route('/model/exam/', self.create, ['xhr', 'put', '*model/exam', 'authorize', '@teacher', '@admin']);
    framework.route('/model/exam/', self.read, ['xhr', 'get']);
    framework.route('/model/exam/{id}', self.readOne, ['xhr', 'get', '*model/exam-query']);
    framework.route('/model/exam/{id}', self.update, ['xhr', 'post', '*model/exam', 'authorize', '@teacher', '@admin']);
    framework.route('/model/exam/{id}', self.remove, ['xhr', 'delete', 'authorize', '@teacher', '@admin']);
}
exports.install = install;
var InputExam = (function (_super) {
    __extends(InputExam, _super);
    function InputExam() {
        _super.apply(this, arguments);
    }
    InputExam.prototype.create = function () {
        var self = this;
        self.body.$save(function (error) {
            return self.json(error);
        });
    };
    InputExam.prototype.read = function () {
        var self = this;
        self.json({ $document: [] });
    };
    InputExam.prototype.readOne = function () {
        var self = this;
        self.json({ $document: [] });
    };
    InputExam.prototype.update = function () {
        var self = this;
        self.body.$save(function (error) {
            return self.json(error);
        });
    };
    InputExam.prototype.remove = function () {
        var self = this;
        self.body.$remove(function (error) {
            return self.json(error);
        });
    };
    return InputExam;
})(TotalJS.Controller);
/*
 * Schema
 */
var group = SCHEMA('model');
var examSchema = group.add('exam');
examSchema.setValidation(function (name, value) {
    switch (name) {
        case 'examId':
            return (value || '').trim().length === 24;
    }
});
examSchema.setGet(function (error, model, helper, callback) {
    error.resource('default', 'exam_remove_');
});
examSchema.setSave(function (error, model, helper, callback) {
    error.resource('default', 'exam_save_');
    var promise;
    if (model['examId']) {
        promise = Exam.model.findByIdAndUpdate(model['examId'], model.$clean()).exec();
    }
    else {
        promise = Exam.model.create(model.$clean());
    }
    promise.exec(function (err, doc) {
        if (err)
            logger.error(err);
        if (!doc)
            error.add('', err);
        callback(error, doc);
    });
});
examSchema.setRemove(function (error, model, helper, callback) {
    error.resource('default', 'exam_remove_');
    Exam.model.findByIdAndRemove(model['examId'], function (err, doc) {
        if (err)
            logger.error(err);
        if (!doc)
            error.add('', '@doesnt_exsist');
        callback(error, doc);
    });
});
var querySchema = group.add('exam-query');
//# sourceMappingURL=exam.js.map