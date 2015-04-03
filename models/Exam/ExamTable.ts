import mongoose = require('mongoose');
import Meta = require('./ExamTableColumnMeta');
import Row = require('./ExamTableRow');


export interface IExamTable extends mongoose.Document {
    name: string;
    columns: Array<Meta.IExamTableColumnMeta>;
    rows: Array<Row.IExamTableRow>;
    changeDate: Date;

    findColumnBySubject(subject: string): Meta.IExamTableColumnMeta;
}


export var schema = new mongoose.Schema({
    name: { type: String, default: '', trim: true },
    changeDate: { type: Date, default: new Date() },
    columns: { type: [Meta.schema], default: [] },
    rows: { type: [Row.schema], default: [] }
});


/*
*  Find subject meta.
*/
schema.method('findColumnBySubject', function (subject: string): Meta.IExamTableColumnMeta {
    for (var i = 0; i < this.columns.length; i++) {
        var column = this.columns[i];
        if (column.subject === subject) return column;
    }
    return null;
});


// Generate model and export
export var model = mongoose.model<IExamTable>('ExamTable', schema, 'ExamTable');