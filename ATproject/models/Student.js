var mongoose = require('mongoose');
/*
 * Grade Const
 */
exports.Grade = {
    ONE: 1,
    TWO: 2,
    THREE: 3
};
exports.schema = new mongoose.Schema({
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
exports.model = mongoose.model('Student', exports.schema, 'Student');
//# sourceMappingURL=Student.js.map