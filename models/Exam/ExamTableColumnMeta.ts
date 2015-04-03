import mongoose = require('mongoose');
import Row = require('./ExamTableRow');

export interface IExamTableColumnMeta extends mongoose.Document {
    title: string;
    subject: string;
    order: number;
    passmark: number;   /*合格率*/
    visible: boolean;
    auto: IMetaAuto;
}

export interface IMetaAuto {
    method: string;
    source: Array<string>; /*累加字段*/
}


export var schema = new mongoose.Schema({
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
export var model = mongoose.model<IExamTableColumnMeta>('ExamTableColumnMeta', schema);


export var Method = {
    PLUS: 'PLUS'
};

export var Subject = {
    //TODO:

};