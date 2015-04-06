import AnalyzeTask = require('./AnalyzeTask');

/*
 * Execute analyze task automaticlly
 * */
class AnalyzeExecuter {

    /* 
     * Store registerd analyzer by name
     * */
    private static _analyzers = {};


    /*
     * Register a analyzer constructor
     * */
    static Register(analyzer: IAnalyzer) {
        AnalyzeExecuter._analyzers[analyzer.Name] = analyzer;
    }


    private _signature: ISignature;
    private _tasks = new Array<AnalyzeTask>();


    constructor() {
        this._signature = {};
    }


    /*
     * Set a most detailed signature which will be send to each task
     */
    setSignature(signature: ISignature) { this._signature = signature; }


    /*
     * Add a new analyze task and return a wrapper
     */
    addTask(analyzerName: string): AnalyzeTask {
        if (AnalyzeExecuter._analyzers[analyzerName] === undefined)
            throw new Error('Analyzer \'' + analyzerName + '\' is not provided');

        var task = new AnalyzeTask(AnalyzeExecuter._analyzers[analyzerName], this._signature);
        this._tasks.push(task);
        return task;
    }


    /*
     * Execute all task
     */
    exec(callback?: () => void) {
        if (this._tasks.length === 0) {
            if (callback) callback();
        } else {
            this._tasks.pop().exec(() => { this.exec(callback) });
        }
    }
}

export = AnalyzeExecuter;