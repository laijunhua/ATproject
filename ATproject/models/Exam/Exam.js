var mongoose = require('mongoose');
exports.schema = new mongoose.Schema({
    name: { type: String, default: '', trim: true, validate: /\S+/ },
    grade: { type: Number, default: 0, enum: [1, 2, 3] },
    genaration: { type: Number, default: 2015, min: 2000 },
    examDate: { type: Date, default: Date.now() },
    changeDate: { type: Date, default: Date.now() },
    mainTable: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamTable' }
});
/*
 * Pre
 */
exports.schema.pre('save', function (next) {
    this.changeDate = new Date();
    next();
});
// Generate model and export
exports.model = mongoose.model('Exam', exports.schema, 'Exam');
//# sourceMappingURL=Exam.js.map