import { StubzPluginContainer } from './stubz-plugin-container';

export interface StubzVariationSelector {
    plugins:StubzPluginContainer;
}

export class StubzSimpleVariationSelector{
    plugins:StubzPluginContainer;
    constructor({
        plugins
    }:{
        plugins:StubzPluginContainer;
    }){
        this.plugins = plugins;
    }
}