import Exam = require('../../models/Exam/Exam');

import log4js = require('log4js');
var logger = log4js.getLogger('controller/exam');


/*
Contorller for upload exam
*/
export function install() {
    var self = InputExam.prototype;

    framework.route('/model/exam/', self.create, ['xhr', 'put', '*model/exam', 'authorize', '@teacher', '@admin']);
    framework.route('/model/exam/', self.read, ['xhr', 'get']);
    framework.route('/model/exam/{id}', self.readOne, ['xhr', 'get', '*model/exam-query']);
    framework.route('/model/exam/{id}', self.update, ['xhr', 'post', '*model/exam', 'authorize', '@teacher', '@admin']);
    framework.route('/model/exam/{id}', self.remove, ['xhr', 'delete', 'authorize', '@teacher', '@admin']);
}

class InputExam extends TotalJS.Controller {

    create() {
        var self = this;
        self.body.$save(error => { return self.json(error); });
    }

    read() {
        var self = this;
        self.json({ $document: [] });
    }

    readOne() {
        var self = this;
        self.json({ $document: [] });
    }

    update() {
        var self = this;
        self.body.$save(error => { return self.json(error); });
    }

    remove() {
        var self = this;
        self.body.$remove(error => { return self.json(error); });
    }
}


/*
 * Schema
 */
var group = SCHEMA('model');
var examSchema = group.add('exam');

examSchema.setValidation((name, value) => {
    switch (name) {
    case 'examId':
        return (<string>(value || '')).trim().length === 24;
    }
});

examSchema.setGet((error, model, helper, callback) => {
    error.resource('default', 'exam_remove_');
});

examSchema.setSave((error, model, helper, callback) => {
    error.resource('default', 'exam_save_');

    var promise;

    if (model['examId']) {
        promise = Exam.model.findByIdAndUpdate(model['examId'], model.$clean()).exec();
    } else {
        promise = Exam.model.create(model.$clean());
    }

    promise.exec((err, doc) => {
        if (err) logger.error(err);
        if (!doc) error.add('', err);
        callback(error, doc);
    });
});

examSchema.setRemove((error, model, helper, callback) => {
    error.resource('default', 'exam_remove_');

    Exam.model.findByIdAndRemove(model['examId'], (err, doc) => {
        if (err) logger.error(err);
        if (!doc) error.add('', '@doesnt_exsist');
        callback(error, doc);
    });
});


var querySchema = group.add('exam-query');