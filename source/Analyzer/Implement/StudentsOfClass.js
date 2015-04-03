var Student = require('../../../models/Student');
/*
 * 查找班级中的人
 */
var StudentsOfClass = (function () {
    function StudentsOfClass() {
        /*
         * Name of analyzer
         */
        this.Name = 'students-of-class';
        /*
         * Analyzer will be cache automaticlly if set it true
         */
        this.IsCacheable = true;
        /*
         * Arrary of string that declare which signatures were needed
         */
        this.NeedSignature = ['genernation', 'grade', 'classId'];
    }
    /*
     * Start actual analyzing
     */
    StudentsOfClass.prototype.Exec = function (signature, callback) {
        var data = new StudentsOfClassData();
        Student.model.find({ generation: signature.generation }).elemMatch('trace', { grade: signature.grade, classId: signature.classId }).exec().then(function (students) {
            data.students = students || [];
            callback(data);
        }).then(null, function () {
            callback(data);
        });
    };
    return StudentsOfClass;
})();
var StudentsOfClassData = (function () {
    function StudentsOfClassData() {
    }
    return StudentsOfClassData;
})();
module.exports = StudentsOfClass;
//# sourceMappingURL=StudentsOfClass.js.map