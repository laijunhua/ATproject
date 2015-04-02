import mongoose = require('mongoose');


export interface IStudent extends mongoose.Document {
    generation: number;
    name: string;
    abb: string;        /*姓名缩写*/
    trace: Array<IStudentTrace>;
}

interface IStudentTrace {
    grade: number;
    classId: number;
    number: number;     /*学号*/
}


/* 
 * Grade Const
 */
export var Grade = {
    ONE: 1,
    TWO: 2,
    THREE: 3
};


export var schema = new mongoose.Schema({
    generation: { type: String, default: '', trim: true },
    name: { type: String, default: '', trim: true },
    abb: { type: String, default: '', trim: true, index: { unique: false } },
    trace: {
        type: [
            {
                grade: Number,
                classId: Number,
                number: Number
            }
        ],
        default: []
    }
});



// Generate model and export
export var model = mongoose.model<IStudent>('Student', schema, 'Student');