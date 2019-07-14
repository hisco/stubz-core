import { StubzServer } from './stubz-server';
export interface StubzPlugin{
    name: string;
    variations: StubzVariation<any>[];
    setVariationsByName(nameStatus:{[key:string]:boolean}):void;
    mount(server:StubzServer):Promise<void>;
    unmount(server:StubzServer):Promise<void>;
}

export interface StubzVariation<T>{
    name: string;
    variationData: T;
    defaultStatus?: boolean;
}