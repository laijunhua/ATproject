var mongoose = require('mongoose');
var Schema = mongoose.Schema;
exports.schema = new mongoose.Schema({
    analyzer: { type: String, default: '', index: true },
    signature: {
        type: {
            generation: Number,
            grade: Number,
            examId: String,
            classId: String,
            studentId: String,
            subject: String
        },
        default: {},
        index: true
    },
    data: { type: Schema.Types.Mixed, default: {} }
});
// Generate model and export
exports.model = mongoose.model('AnalyzerCache', exports.schema, 'AnalyzerCache');
/*
* Search analyzer cache data
*/
function findOne(analyzer, signature, callback) {
    var query = exports.model.findOne({ analyzer: analyzer }).select('data');
    for (var path in signature) {
        query.where('signature.' + path, signature[path]);
    }
    query.exec(function (err, cache) {
        callback(cache);
    });
}
exports.findOne = findOne;
//# sourceMappingURL=AnalyzerCache.js.map