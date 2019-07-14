export interface StubzServer{
    listen(ports:(string|number)[]):Promise<(string|number)[]>;
    start():Promise<void>;
    stop():Promise<void>;
}