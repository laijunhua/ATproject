var mongoose = require('mongoose');
var Meta = require('./ExamTableColumnMeta');
var Row = require('./ExamTableRow');
exports.schema = new mongoose.Schema({
    name: { type: String, default: '', trim: true },
    changeDate: { type: Date, default: new Date() },
    columns: { type: [Meta.schema], default: [] },
    rows: { type: [Row.schema], default: [] }
});
/*
*  Find subject meta.
*/
exports.schema.method('findColumnBySubject', function (subject) {
    for (var i = 0; i < this.columns.length; i++) {
        var column = this.columns[i];
        if (column.subject === subject)
            return column;
    }
    return null;
});
// Generate model and export
exports.model = mongoose.model('ExamTable', exports.schema, 'ExamTable');
//# sourceMappingURL=ExamTable.js.map