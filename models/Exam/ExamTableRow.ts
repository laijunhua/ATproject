import mongoose = require('mongoose');

export interface IExamTableRow extends mongoose.Document {
    studentId: string;
    cell: Object;
}


export var schema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    cell: { type: Object, default: {} }
});


// Generate model and export
export var model = mongoose.model<IExamTableRow>('ExamTableRow', schema);