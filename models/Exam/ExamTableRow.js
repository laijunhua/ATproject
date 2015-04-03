var mongoose = require('mongoose');
exports.schema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    cell: { type: Object, default: {} }
});
// Generate model and export
exports.model = mongoose.model('ExamTableRow', exports.schema);
//# sourceMappingURL=ExamTableRow.js.map