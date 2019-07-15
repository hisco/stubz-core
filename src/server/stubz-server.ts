import {Server , createServer , RequestListener, IncomingMessage, ServerResponse} from 'http';

export class StubzHTTPServer{
    server: Server;
    ports: (string|number)[] = [];
    requestListener: RequestListener;
    constructor({
        server,
        ports,
        requestListener
    }:{
        server? : Server,
        ports: (string|number)[],
        requestListener?: RequestListener
    }){
        this.requestListener = requestListener;
        if (!server){
            server = createServer((req: IncomingMessage, res: ServerResponse)=>{
                this.requestListener(req,res)
            })
        }
        this.server = server;
        if (ports&& ports.length){
            this.ports.push(...ports)
        }
    }
    public setRequestListener(requestListener:RequestListener){
        this.requestListener = requestListener;
    }
    async listen(ports:(string|number)[]):Promise<(string|number)[]>{
        const failedPorts:(string|number)[] = [];
        const successPorts = await Promise.all<(number|string)>(ports.map((port)=>{
            return new Promise((resolve,reject)=>{
                this.server.listen(port , function(){
                    const error = arguments[0];
                    if (error){
                        reject(error);
                    }
                    else{
                        resolve(port);
                    }
                })
            })
        }));
        if (failedPorts.length){
            //It's all or nothing... so failure
            throw new Error(`Server failure, unable listen to: ${failedPorts}`)
        }
        return successPorts;
    }
    async start(){
        await this.listen(this.ports);
    }
    async stop(){
        await new Promise((resolve, reject)=>{
            this.server.close(function (){
                const error = arguments[0];
                if (error){
                    reject(error)
                }
                else resolve()
            })
        })
    }
}