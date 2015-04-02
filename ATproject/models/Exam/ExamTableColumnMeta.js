var mongoose = require('mongoose');
exports.schema = new mongoose.Schema({
    title: { type: String, default: '', trim: true },
    subject: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    passmark: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    auto: {
        type: {
            method: String,
            source: [String]
        },
        default: null
    }
});
// Generate model and export
exports.model = mongoose.model('ExamTableColumnMeta', exports.schema);
exports.Method = {
    PLUS: 'PLUS'
};
exports.Subject = {};
//# sourceMappingURL=ExamTableColumnMeta.js.map