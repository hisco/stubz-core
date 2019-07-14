import {IncomingMessage , OutgoingMessage} from 'http';

export interface HTTPRouter{
    clearRoutes():void;
    use(req:HTTPRouterRequest,res:HTTPRouterResponse,next?:(error?:Error)=>void):void;
    get(req:HTTPRouterRequest,res:HTTPRouterResponse):void;
    post(req:HTTPRouterRequest,res:HTTPRouterResponse):void;
    all(req:HTTPRouterRequest,res:HTTPRouterResponse):void;
    put(req:HTTPRouterRequest,res:HTTPRouterResponse):void;
    patch(req:HTTPRouterRequest,res:HTTPRouterResponse):void;
    head(req:HTTPRouterRequest,res:HTTPRouterResponse):void;
    delete(req:HTTPRouterRequest,res:HTTPRouterResponse):void;
}
export interface HTTPRouterRequest extends IncomingMessage{
    url: string;
}
export interface HTTPRouterResponse extends OutgoingMessage{
    set(headers:{[key:string]:string|string[]}):HTTPRouterResponse;
    send(content:string|Buffer):HTTPRouterResponse;
    status(statusCode: string):HTTPRouterResponse;
}