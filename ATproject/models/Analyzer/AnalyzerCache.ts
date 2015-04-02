import mongoose = require('mongoose');
import Schema = mongoose.Schema;


/*
Model of user collection, verifying, updating and finding user database. 
*/
export interface IAnalyzerCache extends mongoose.Document {
    analyzer: string;
    signature: ISignature;
    data: any;
}


export var schema = new mongoose.Schema({
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
export var model = mongoose.model<IAnalyzerCache>('AnalyzerCache', schema, 'AnalyzerCache');


/*
* Search analyzer cache data
*/
export function findOne(analyzer: string, signature: ISignature, callback: (data: IAnalyzerCache) => void) {
    var query = model
        .findOne({ analyzer: analyzer })
        .select('data');

    // signature compare query
    for (var path in signature) {
        query.where('signature.' + path, signature[path]);
    }

    query.exec((err: Error, cache: IAnalyzerCache) => {
        callback(cache);
    });
}