import Student = require('../../../models/Student');


/*
 * 查找班级中的人
 */
class StudentsOfClass implements IAnalyzer {

    /*
     * Name of analyzer
     */
    Name = 'students-of-class';

    /*
     * Analyzer will be cache automaticlly if set it true
     */
    IsCacheable = true;

    /*
     * Arrary of string that declare which signatures were needed 
     */
    NeedSignature = ['genernation', 'grade', 'classId'];

    /*
     * Start actual analyzing
     */
    Exec(signature: ISignature, callback: (data: any) => void) {
        var data = new StudentsOfClassData();

        Student.model
            .find({ generation: signature.generation })
            .elemMatch('trace', { grade: signature.grade, classId: signature.classId })
            .exec()
            .then(students => {
                data.students = students || [];
                callback(data);
            })
            .then(null, () => {
                callback(data);
            });
    }
}


export = StudentsOfClass;


class StudentsOfClassData {
    students: Array<Student.IStudent>;
}