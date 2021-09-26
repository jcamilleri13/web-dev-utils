export default log;
declare function log(level: any, ...logs: any[]): void;
declare namespace log {
    export function flush(): Promise<void>;
    export function flushAll(): Promise<void>;
    export { setHeader };
    export { setLogLevel };
    export function debug(...logs: any[]): void;
    export function info(...logs: any[]): void;
    export function warning(...logs: any[]): void;
    export function error(...logs: any[]): void;
    export function success(...logs: any[]): void;
}
declare function setHeader(text: any): void;
declare function setLogLevel(level: any): void;
