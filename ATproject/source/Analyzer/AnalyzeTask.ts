import AnalyzerCache = require('../../models/Analyzer/AnalyzerCache');
import IAnalyzerCache = AnalyzerCache.IAnalyzerCache;


/*
 * Task wrapper that cache the analyze result and manage analyzer
 */
class AnalyzeTask {

    private _analyzer: IAnalyzer;
    private _signature: ISignature;
    private _complete: (data: any) => void;


    constructor(analyzer: IAnalyzer, signature: ISignature) {
        this._signature = this.filterSignature(analyzer, signature);

        this._analyzer = analyzer;
        this._signature = signature;
    }


    /*
     * 过滤分析器声明所需的签名
     */
    private filterSignature(analyzer: IAnalyzer, signature: ISignature): ISignature {
        var sig = {};
        for (var i = 0; i < analyzer.NeedSignature.length; i++) {
            var path = analyzer.NeedSignature[i];
            if (signature[path] === undefined)
                throw new Error('Signature \'' + path + '\' should be provided');

            sig[path] = signature[path];
        }
        return sig;
    }


    /*
     * Callback when finished analyzing
     */
    onComplete(callback: (data: any) => void) { this._complete = callback; }


    /*
     * Load cache or start analyzing
     */
    exec(callback: () => void) {

        AnalyzerCache.findOne(this._analyzer.Name, this._signature,(cache: IAnalyzerCache) => {
            // Load cache
            if (cache != null) {
                this._complete(cache.data);
                return callback();
            }

            // Actually start analyzing
            this._analyzer.Exec(this._signature, (analyzedData) => {
                if (this._analyzer.IsCacheable)
                    this.cacheData(analyzedData);
                this._complete(analyzedData);
                callback();
            });

        });
    }

    /*
     * Push data to cache database
     */
    private cacheData(analyzedData) {
        var cache = new AnalyzerCache.model(null);
        cache.analyzer = this._analyzer.Name;
        cache.signature = this._signature;
        cache.data = analyzedData;
        cache.save();
    }
}

export = AnalyzeTask;