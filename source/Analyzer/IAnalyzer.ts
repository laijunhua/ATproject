/// <reference path="ISignature.ts" />

interface IAnalyzer {

    /*
     * Name of analyzer
     */
    Name: string;

    /*
     * Analyzer will be cache automaticlly if set it true
     */
    IsCacheable: boolean;

    /*
     * Arrary of string that declare which signatures were needed 
     */
    NeedSignature: Array<string>;

    /*
     * Start actual analyzing
     */
    Exec(signature: ISignature, callback: (error:string, data: any) => void): void;
}