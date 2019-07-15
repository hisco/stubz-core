import { RequestListener } from "http";

export type StubzRouteResponse = StubzRouteStaticResponse | RequestListener;
export class StubzRouteStaticResponse{
    public statusCode: string;
    public content: any;
    public json: any;
    public headers: {[key:string]:string|string[]};
    constructor(responseOptions:{
        statusCode?: string;
        content?: any;
        json?: any;
        headers?: {[key:string]:string|string[]}
    }){
        this.headers = responseOptions.headers || {};
        if (responseOptions.hasOwnProperty('json')){
            this.json = responseOptions.json;
        }
        else{
            this.content = responseOptions.content;
        }
        this.statusCode = responseOptions.statusCode == undefined ? '200' : responseOptions.statusCode;
    }
}