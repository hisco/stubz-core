import { StubzPlugin } from './stubz-server-plugin';
import { StubzServer } from './stubz-server';


export class StubzPluginContainer {
    public plugins: PluginWithStatus[] = [];
    private stubzServer: StubzServer;

    constructor({stubzServer}:{stubzServer:StubzServer}){
        this.stubzServer = stubzServer;
    }
    public getPluginByName(name : string){
        return this.plugins.find(pluginStatus=> pluginStatus.plugin.name == name)
    }
    async addPlugins(plugins: StubzPlugin[]){
        await Promise.all(
            plugins.map(async (plugin)=>{
                const foundPlugin = this.getPluginByName(plugin.name);
                if (foundPlugin){
                    this.removePluginStatus(foundPlugin);
                    const newPlugin = {
                        plugin,
                        status: false
                    };
                    this.plugins.push(newPlugin);
                    await foundPlugin.plugin.unmount(this.stubzServer);
                    newPlugin.status = true;
                }
                
                await plugin.mount(this.stubzServer);
            })
        );
    }
    async removePlugins(plugins: StubzPlugin[]){
        await Promise.all(
            plugins.map(async (plugin)=>{
                const foundPlugin = this.getPluginByName(plugin.name);
                if (foundPlugin){
                    this.removePluginStatus(foundPlugin);
                    foundPlugin.plugin.unmount(this.stubzServer);
                }
            })
        )
    }
    private removePluginStatus(pluginWithStatus: PluginWithStatus){
        const index = this.plugins.indexOf(pluginWithStatus);
        if (index!=-1){
            this.plugins[index].status = false;
            this.plugins.splice(index,1);
        }
    }
}

interface PluginWithStatus{
    plugin: StubzPlugin;
    status: boolean;
}