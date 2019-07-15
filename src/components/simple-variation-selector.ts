import { StubzPluginContainer } from './stubz-plugin-container';
import { StubzVariation } from './stubz-server-plugin';

export interface StubzVariationSelector {
    pluginsContainer:StubzPluginContainer;
    setVariationsByName(nameStatus:{[key:string]:boolean}):void;
    getPluginsStatus():PluginStatus[];
}

export class StubzSimpleVariationSelector implements StubzVariationSelector{
    pluginsContainer:StubzPluginContainer;
    constructor({
        pluginsContainer
    }:{
        pluginsContainer:StubzPluginContainer;
    }){
        this.pluginsContainer = pluginsContainer;
    }
    setVariationsByName(nameStatus:{[key:string]:boolean}){
        this.pluginsContainer.plugins.forEach(pluginWithStatus => {
            pluginWithStatus.plugin.setVariationsByName(nameStatus)
        });
    }
    getPluginsStatus():PluginStatus[]{
        return this.pluginsContainer.plugins.map(pluginWithStatus=>({
            status : pluginWithStatus.status,
            name: pluginWithStatus.plugin.name,
            variations : pluginWithStatus.plugin.variations
        }))
    }
}

export interface PluginStatus{
    status: boolean;
    name: string;
    variations: StubzVariation<any>[]
}