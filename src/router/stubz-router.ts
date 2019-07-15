import { HTTPRouter, HTTPRouterRequest, HTTPRouterResponse } from './http-router';
import { StubzRouteResponse, StubzRouteStaticResponse } from './responses';
import { StubzPlugin, StubzVariation, StubzServer } from '../components/components';

interface StubzHTTPApplicationServer extends StubzServer{
    routerApplication:{
        use(route:string|RegExp, router:HTTPRouter):void;
        use(router:HTTPRouter):void;
    }
}
export class StubzRouter implements StubzPlugin{
    variations: StubzVariation<RouteVariation>[] = [];
    router: HTTPRouter;
    public name: string = `random-${Math.random()}`;
    public route: string| RegExp;
    constructor({
        name,
        route,
        router
    }:{
        name:string ,
        route?:string|RegExp,
        router:HTTPRouter
    }){
        this.name = name;
        this.route = route;
        this.router = router;
    }
    async mount(server:StubzHTTPApplicationServer): Promise<void> {
        if (this.route){
            server.routerApplication.use(this.route, this.router);
        }
        else{
            server.routerApplication.use(this.router);
        }
        this.setVariationsByName({});
    }    
    async unmount(server: StubzServer): Promise<void> {
        this.clearRouter();
    }
    private clearRouter(){
        this.router.clearRoutes();
    }
    setVariationsByName(nameStatus: {[key:string]:boolean}): void {
        const disabledVariations:string[] = [];
        const enabledVariations:string[] = [];
        Object.keys(nameStatus).forEach(name => {
           if (nameStatus[name]){
               enabledVariations.push(name)
           }
           else{
               disabledVariations.push(name);
           }
        });
        this.setVariationsByCB((variation)=>{
            if (enabledVariations.includes(variation.name)){
                return true;
            }
            else if (disabledVariations.includes(variation.name)){
                return false;
            }
            else{
                return variation.defaultStatus == true;
            }
        })
    }
    private setVariationsByCB(cb : (variation: StubzVariation<RouteVariation>)=>boolean){
        this.clearRouter();
        this.variations.forEach((variation : StubzVariation<RouteVariation>)=>{
            const status = cb(variation);
            if (status){
                variation.variationData.mount();
            }
        })
    }
    private routeGeneric(
        pathMethod: 'get'|'post'|'all' | 'put' | 'patch' | 'head'| 'delete', 
        pathName: string , 
        stubzRouteResponse : StubzRouteResponse
    ){
        const {router , route , name} = this;
        const r = new StubzAction({
            routerName: name,
            name:'default',
            variationData: {
                pathName,
                pathMethod,
                mount(){
                    function f(...params:any[]){
                        router[pathMethod].apply(router,params);
                    }
                    if (typeof stubzRouteResponse == 'object' ){
                        stubzRouteResponse = new StubzRouteStaticResponse(stubzRouteResponse);
                    }
                    if (stubzRouteResponse instanceof StubzRouteStaticResponse){
                        const staticRouteResponse = <StubzRouteStaticResponse>stubzRouteResponse;
                        f(pathName , (req:HTTPRouterRequest,res:HTTPRouterResponse)=>{
                            res
                                .set(staticRouteResponse.headers)
                                .status(staticRouteResponse.statusCode)
                                .send(staticRouteResponse.content);
                        });
                    }
                    else if (typeof stubzRouteResponse == 'function'){
                        f(pathName , stubzRouteResponse)
                    }
                    else {
                        throw new Error(`Unrecognized type for ${route || ''}${pathName}`)
                    }
                }
            },
            defaultStatus: false
        });
        this.variations.push(r.stubzVariation);
        return r;
    }
    /*
        methods start
    */
    get(path: string , cb : StubzRouteResponse):StubzAction{
        return this.routeGeneric('get' , path , cb);
    }
    post(path: string , cb : StubzRouteResponse):StubzAction{
        return this.routeGeneric('post' , path , cb);
    }
    delete(path: string , cb : StubzRouteResponse):StubzAction{
        return this.routeGeneric('delete' , path , cb);
    }
    head(path: string , cb : StubzRouteResponse):StubzAction{
        return this.routeGeneric('head' , path , cb);
    }
    patch(path: string , cb : StubzRouteResponse):StubzAction{
        return this.routeGeneric('patch' , path , cb);
    }
    put(path: string , cb : StubzRouteResponse):StubzAction{
        return this.routeGeneric('put' , path , cb);
    }
    all(path: string , cb : StubzRouteResponse):StubzAction{
        return this.routeGeneric('all' , path , cb);
    }  
    /*
        methods end
    */
    
}
class StubzAction{
    private optionName:string = '';
    private routerName:string = '';
    private isUniq:boolean= false;
    constructor(
        public stubzVariation: StubzVariation<RouteVariation>&{routerName: string}
    ){
        this.routerName = this.stubzVariation.routerName;
    }
    private setOptionInternal(){
        if (this.isUniq && this.routerName){
            this.stubzVariation.name = `${this.routerName}.${this.optionName}`;
        }
        else{
            this.stubzVariation.name = `${this.optionName}`;
        }
    }
    setOption(name:string):StubzAction{
        this.optionName = name;
        this.setOptionInternal();
        return this;
    }
    routerOnlyOption(){
        this.isUniq = true;
        this.setOptionInternal();
    }
    commonOption(){
        this.isUniq = false;
        this.setOptionInternal();
    }
    defaultOn(){
        this.stubzVariation.defaultStatus = true;
    }
    defaultOff(){
        this.stubzVariation.defaultStatus = false;
    }
}
interface RouteVariation{
    pathName:string;
    pathMethod:string;
    mount():void;
}
