import { Injectable } from '@angular/core';
import { Config } from '../../shared';

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
        var apigClientFactory = {};
        (<any>apigClientFactory).newClient = function (config:any) {
            var apigClient: any;
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
            var invokeUrl = Config.API;
            var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
            var pathComponent = invokeUrl.substring(endpoint.length);

            var sigV4ClientConfig = {
                accessKey: config.accessKey,
                secretKey: config.secretKey,
                sessionToken: config.sessionToken,
                serviceName: 'execute-api',
                region: config.region,
                endpoint: endpoint,
                defaultContentType: config.defaultContentType,
                defaultAcceptType: config.defaultAcceptType
            };

            var authType = 'NONE';
            if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== ''
                && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
                authType = 'AWS_IAM';
            }

            var simpleHttpClientConfig = {
                endpoint: endpoint,
                defaultContentType: config.defaultContentType,
                defaultAcceptType: config.defaultAcceptType
            };

            var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);

            apigClient.makeRequest = function (path:any ,params:any, body:any, additionalParams:any) {
                if(additionalParams === undefined) { additionalParams = {}; }

                var rootOptionsRequest = {
                    verb: 'options'.toUpperCase(),
                    path: pathComponent + uritemplate(path).expand(apiGateway.core.utils.parseParametersToObject(params, [])),
                    headers: apiGateway.core.utils.parseParametersToObject(params, []),
                    queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
                    body: body
                };

                return apiGatewayClient.makeRequest(rootOptionsRequest, authType, additionalParams, config.apiKey);
            };
            return apigClient;
        };
        return apigClientFactory;
    }

}
