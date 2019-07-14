
export type StubzRouteResponse = StubzRouteStaticResponse;
export class StubzRouteStaticResponse{
    public statusCode: string;
    public content: string | Buffer;
    public headers: {[key:string]:string|string[]};
    constructor({
        statusCode,
        content,
        headers
    }:{
        statusCode?: string;
        content?: string| Buffer;
        headers?: {[key:string]:string|string[]}
    }){
        this.headers = headers || {};
        this.content = content;
        this.statusCode = statusCode == undefined ? '200' : statusCode;
    }
}