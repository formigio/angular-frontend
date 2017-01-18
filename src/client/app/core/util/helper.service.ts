import { Injectable } from '@angular/core';
import { Config } from '../../shared/index';

declare let apigClientFactory: any;
declare let apiGateway: any;
declare let uritemplate: any;

export class AppState {
    constructor(
        public state: any,
        public services: any
    ) {}
}

@Injectable()
export class HelperService {

    apiFactory: any;

    public runtimestorage: AppState = {
        state: {},
        services: {}
    };

    constructor() {
        this.apiFactory = (<any>this.getApiClientFactory());
    }

    sortBy(arr:any[],property:string) {
        arr.sort((a,b) => {
                    if(a[property] < b[property])
                        return -1;
                    if(a[property] > b[property])
                        return 1;
                    return 0;
                    });
    }

    getServiceInstance(service:any,alias:string): any {
        if(!this.runtimestorage.services.hasOwnProperty(alias)) {
            this.runtimestorage.services[alias] = service;
        }
        return this.runtimestorage.services[alias];
    }

    getAppState(location:string): any {
        if(<any>this.runtimestorage.state.hasOwnProperty(location)) {
            return this.runtimestorage.state[location];
        }
    }

    setAppState(location:string,value:any): boolean {
        this.runtimestorage.state[location] = value;
        return true;
    }

    getApiClientFactory() {
        let apigClientFactory = {};
        (<any>apigClientFactory).newClient = function (config:any) {

            let apigClient: any = {};

            if(config === undefined) {
                config = {
                    accessKey: '',
                    secretKey: '',
                    sessionToken: '',
                    region: '',
                    apiKey: undefined,
                    defaultContentType: 'application/json',
                    defaultAcceptType: 'application/json'
                };
            }
            if(config.accessKey === undefined) {
                config.accessKey = '';
            }
            if(config.secretKey === undefined) {
                config.secretKey = '';
            }
            if(config.apiKey === undefined) {
                config.apiKey = '';
            }
            if(config.sessionToken === undefined) {
                config.sessionToken = '';
            }
            if(config.region === undefined) {
                config.region = 'us-east-1';
            }
            //If defaultContentType is not defined then default to application/json
            if(config.defaultContentType === undefined) {
                config.defaultContentType = 'application/json';
            }
            //If defaultAcceptType is not defined then default to application/json
            if(config.defaultAcceptType === undefined) {
                config.defaultAcceptType = 'application/json';
            }


            // extract endpoint and path from url
            let invokeUrl:string = Config.API;
            let endpoint:string = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
            let pathComponent:string = invokeUrl.substring(endpoint.length);

            let sigV4ClientConfig:any = {
                accessKey: config.accessKey,
                secretKey: config.secretKey,
                sessionToken: config.sessionToken,
                serviceName: 'execute-api',
                region: config.region,
                endpoint: endpoint,
                defaultContentType: config.defaultContentType,
                defaultAcceptType: config.defaultAcceptType
            };

            let authType:string = 'NONE';
            if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== ''
                && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
                authType = 'AWS_IAM';
            }

            let simpleHttpClientConfig:any = {
                endpoint: endpoint,
                defaultContentType: config.defaultContentType,
                defaultAcceptType: config.defaultAcceptType
            };

            let apiGatewayClient:any = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);

            apigClient.get = function (path:any, options:any) {
                if(options.params === undefined) { options.params = {}; }
                if(options.headers === undefined) { options.headers = {}; }

                let requestOptions:any = {
                    verb: 'get'.toUpperCase(),
                    path: pathComponent + uritemplate(path).expand(apiGateway.core.utils.parseParametersToObject(options.params, [])),
                    headers: options.headers,
                    queryParams: options.params
                };

                return apiGatewayClient.makeRequest(requestOptions, authType, options.params, config.apiKey);
            };

            apigClient.post = function (path:any, options:any, body:any) {
                if(options.params === undefined) { options.params = {}; }
                if(options.headers === undefined) { options.headers = {}; }
                if(body === undefined) { body = {}; }

                let rootOptionsRequest:any = {
                    verb: 'post'.toUpperCase(),
                    path: pathComponent + uritemplate(path).expand(apiGateway.core.utils.parseParametersToObject(options.params, [])),
                    headers: options.headers,
                    queryParams: options.params,
                    body: body
                };

                return apiGatewayClient.makeRequest(rootOptionsRequest, authType, options.params, config.apiKey);
            };

            apigClient.put = function (path:any, options:any, body:any) {
                if(options.params === undefined) { options.params = {}; }
                if(options.headers === undefined) { options.headers = {}; }
                if(body === undefined) { body = {}; }

                let rootOptionsRequest:any = {
                    verb: 'put'.toUpperCase(),
                    path: pathComponent + uritemplate(path).expand(apiGateway.core.utils.parseParametersToObject(options.params, [])),
                    headers: options.headers,
                    queryParams: options.params,
                    body: body
                };

                return apiGatewayClient.makeRequest(rootOptionsRequest, authType, options.params, config.apiKey);
            };

            apigClient.delete = function (path:any, options:any) {
                if(options.params === undefined) { options.params = {}; }
                if(options.headers === undefined) { options.headers = {}; }

                let requestOptions:any = {
                    verb: 'delete'.toUpperCase(),
                    path: pathComponent + uritemplate(path).expand(apiGateway.core.utils.parseParametersToObject(options.params, [])),
                    headers: options.headers,
                    queryParams: options.params
                };

                return apiGatewayClient.makeRequest(requestOptions, authType, options.params, config.apiKey);
            };

            return apigClient;
        };
        return apigClientFactory;
    }

}
