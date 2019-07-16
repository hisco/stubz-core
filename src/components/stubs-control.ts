import { StubzServer } from './stubz-server';
import { StubzPluginContainer } from './stubz-plugin-container';
import { StubzVariationSelector } from './simple-variation-selector';

export interface StubzControl{
    pluginsContainer: StubzPluginContainer;
    stubzServer: StubzServer;
    variationSelector: StubzVariationSelector;
}
export class StubzSimpleControl implements StubzControl{
    public pluginsContainer: StubzPluginContainer;
    public stubzServer: StubzServer;
    public variationSelector: StubzVariationSelector

    constructor({
        stubzServer,
        pluginsContainer,
        variationSelector
    }:{
        stubzServer: StubzServer,
        pluginsContainer: StubzPluginContainer,
        variationSelector: StubzVariationSelector
    }){
        this.stubzServer = stubzServer;
        this.pluginsContainer = pluginsContainer;
        this.variationSelector = variationSelector;
    }
    getPluginsStatus(){
        return this.variationSelector.getPluginsStatus();
    }
    setVariationsByName(nameStatus:{[key:string]:boolean}){
        return this.variationSelector.setVariationsByName(nameStatus);
    }

}
